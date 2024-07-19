<script setup lang="jsx" name="purchaseList">
import ProTable from '@/components/ProTable/index.vue'
import { reactive, ref } from 'vue'
import { PurchaseListRequest, PurchaseDetailRequest } from '@/api/purchase/purchase'
import {
  DATE_TIME_FORMAT,
  DATE_TIME_VALUE_FORMAT,
  dateShortcuts,
  defaultTime,
  thisMonth,
  toDate
} from '@/utils/day'
import { useI18n } from 'vue-i18n'
import { phoneNumberFormat, priceFormat } from '@/utils/format'
import {
  customerInfoDoc,
  malaysiaState,
  numberSoldType,
  paymentType,
  purchaseStatus,
  tunnelType
} from '@/utils/dict'
import { EditPen } from '@element-plus/icons-vue'
import Reference from '@/views/purchase/components/reference.vue'
import Detail from '@/views/purchase/components/detail.vue'
import Confirm from '@/views/purchase/components/confirm.vue'
import CashSettlement from '@/views/purchase/components/cashSettlement.vue'
import ChangeNumber from '@/views/purchase/components/changeNumber.vue'
import Refund from '@/views/purchase/components/refund.vue'
import Completed from '@/views/purchase/components/completed.vue'

const { t, n } = useI18n()

const proTable = ref()

const initParam = reactive({
  date: thisMonth(),
  sort: 1
})

const sortLogic = (col) => {
  const { order, prop } = col
  if (order === null) {
    initParam.sort = 1
  } else {
    const sort = {
      id: { descending: 1, ascending: 2 },
      number: { descending: 3, ascending: 4 },
      payment_type: { descending: 5, ascending: 6 },
      tunnel_id: { descending: 7, ascending: 8 },
      reference_id: { descending: 9, ascending: 10 },
      amount: { descending: 11, ascending: 12 },
      price: { descending: 13, ascending: 14 },
      status: { descending: 15, ascending: 16 },
      owner: { descending: 17, ascending: 18 },
      order_id: { descending: 19, ascending: 20 }
    }
    initParam.sort = sort[prop][order]
  }
}

const findLabel = (list, item) => {
  const idx = list.findIndex((x) => x.value === item)
  if (idx === -1) {
    return '-'
  }
  return t(`${list[idx].label}`)
}

const getTableList = (params) => {
  return PurchaseListRequest(params)
}

const referenceVisible = ref(false)
const params = ref({ row: {}, enumMap: new Map(), getTableList: void 0, tab: 'first' })
const referenceIdDialog = (row) => {
  params.value.row = { ...row }
  referenceVisible.value = true
}

const detailVisible = ref(false)
const detailDialog = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.enumMap = proTable.value?.enumMap
    params.value.getTableList = proTable.value?.getTableList
    params.value.tab = 'first'
    detailVisible.value = true
  })
}

let fixed =
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  ) !== null
    ? false
    : 'right'

const completed = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.getTableList = proTable.value?.getTableList
    if (row.payment_type !== 2) {
      if (row.upload_register_status > 0) {
        params.value.tab = 'third'
      } else {
        params.value.tab = 'second'
      }
      detailVisible.value = true
    } else {
      completedVisible.value = true
    }
  })
}

const dataCallback = (data) => ({
  list: data.list,
  total: data.total,
  pageNum: data.pageNum,
  pageSize: data.pageSize
})

const columns = reactive([
  // { prop: 'id', label: '#', width: 50, sortable: 'custom' },
  { type: 'index', label: '#', width: 50 },
  {
    prop: 'date',
    label: t('form.fields.date'),
    isShow: false,
    search: {
      el: 'date-picker',
      props: {
        type: 'datetimerange',
        'value-format': DATE_TIME_VALUE_FORMAT,
        'default-time': defaultTime(),
        format: DATE_TIME_FORMAT,
        'arrow-control': true,
        clearable: false,
        shortcuts: dateShortcuts()
      }
    }
  },
  {
    prop: 'order_id',
    label: t('form.fields.order_id'),
    search: { el: 'input' },
    render: (scope) => {
      return <a onClick={() => detailDialog(scope.row)}>{scope.row.order_id}</a>
    },
    sortable: 'custom',
    width: 180
  },
  {
    prop: 'number',
    label: t('form.fields.number'),
    search: { el: 'input' },
    sortable: 'custom',
    render: (scope) => phoneNumberFormat(scope.row.number)
  },
  {
    prop: 'sold_type',
    label: t('form.fields.soldType'),
    enum: numberSoldType(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'tunnel_id',
    label: t('form.fields.tunnel_id'),
    enum: tunnelType(),
    sortable: 'custom',
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      return (
        <>
          {scope.row.tunnel_id === 1 && scope.row.upload_doc !== '' ? (
            <a onClick={() => viewerHandle(scope.row)}>
              {findLabel(tunnelType(), scope.row.tunnel_id)}
            </a>
          ) : (
            <span>{findLabel(tunnelType(), scope.row.tunnel_id)}</span>
          )}
        </>
      )
    }
  },
  {
    prop: 'payment_type',
    label: t('form.fields.payment_type'),
    enum: paymentType(),
    sortable: 'custom',
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    //  0: '未提交'  1: 'Submit' 2: 'Confirm' 3: 'Cancel' 4: 'Processing' 5: '充公' 6: 'Refund' 7: 'Success
    prop: 'lock_expired',
    label: t('form.fields.lock_expired'),
    width: 150,
    render: (scope) => {
      if (scope.row.payment_type === 2 && [1, 2].includes(scope.row.status)) {
        return toDate(scope.row.lock_expired)
      } else {
        return `--`
      }
    }
  },
  {
    prop: 'reference_id',
    label: t('form.fields.reference_id'),
    sortable: 'custom',
    render: (scope) => {
      return <a onClick={() => referenceIdDialog(scope.row)}>{scope.row.reference_id}</a>
    }
  },
  {
    prop: 'amount',
    label: t('form.fields.amount'),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.amount)
  },
  // {
  //   prop: 'price',
  //   label: t('form.fields.price'),
  //   sortable: 'custom',
  //   render: (scope) => priceFormat(n, scope.row.price)
  // },
  {
    prop: 'status',
    label: t('form.fields.status'),
    sortable: 'custom',
    enum: purchaseStatus(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },

  {
    prop: 'owner',
    label: t('form.fields.owner'),
    sortable: 'custom'
  },
  {
    prop: 'created_at',
    label: t('form.fields.createdAt'),
    render: (scope) => toDate(scope.row.created_at),
    width: 150
  },
  {
    prop: 'state',
    isShow: false,
    enum: malaysiaState(),
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'memberDoc',
    isShow: false,
    enum: customerInfoDoc(),
    fieldNames: { label: 'label', value: 'value' }
  },
  { prop: 'operation', label: t('form.fields.operation'), fixed: fixed, width: 250 }
])

const confirmVisible = ref(false)
const completedVisible = ref(false)
const confirm = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.getTableList = proTable.value?.getTableList
    confirmVisible.value = true
  })
}

const cashSettlementVisible = ref(false)
const cashSettlement = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.getTableList = proTable.value?.getTableList
    cashSettlementVisible.value = true
  })
}

const changeNumberVisible = ref(false)
const changeNumber = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.getTableList = proTable.value?.getTableList
    changeNumberVisible.value = true
  })
}

const refundVisible = ref(false)
const refund = (row) => {
  PurchaseDetailRequest({ order_id: row.order_id }).then((response) => {
    params.value.row = { ...response }
    params.value.getTableList = proTable.value?.getTableList
    refundVisible.value = true
  })
}

const viewer = ref(false)
const viewerList = ref([])
const viewerHandle = (row = null) => {
  if (row !== null) {
    viewerList.value = [row.upload_doc]
    viewer.value = true
  } else {
    viewerList.value = []
    viewer.value = false
  }
}
// const cancel = (row) => {}
</script>

<template>
  <div class="table-box">
    <el-image-viewer v-if="viewer" @close="viewerHandle" :url-list="viewerList" />
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="true"
      @sortLogic="sortLogic"
      :tool-button="true"
    >
      <template #operation="scope">
        <div>
          <el-button
            v-auth="['purchaseConfirm', 'purchaseCancel']"
            type="primary"
            round
            :icon="EditPen"
            @click="confirm(scope.row)"
            v-if="scope.row.status === 1 && scope.row.tunnel_id === 1"
            class="button-margin"
          >
            {{ t('form.action.confirm') }}/ {{ t('form.action.reject') }}
          </el-button>

          <el-button
            v-auth="['purchaseDirectCreateCashSettlementOrder']"
            type="warning"
            round
            @click="cashSettlement(scope.row)"
            v-if="
              scope.row.status === 2 &&
              scope.row.payment_type === 2 &&
              scope.row.count_settlement === 0
            "
            class="button-margin"
          >
            {{ t('form.action.directCashSettlement') }}
          </el-button>

          <el-button
            v-auth="['purchaseCompleted']"
            type="success"
            round
            class="button-margin"
            v-if="scope.row.status === 2"
            @click="completed(scope.row)"
          >
            {{ t('form.action.completed') }}
          </el-button>

          <el-button
            v-auth="['purchaseRefund']"
            type="info"
            round
            class="button-margin"
            @click="refund(scope.row)"
            v-if="scope.row.status === 2"
          >
            {{ t('form.action.refund') }}
          </el-button>

          <el-button
            v-auth="['purchaseChangeNumber']"
            type="warning"
            round
            class="button-margin"
            @click="changeNumber(scope.row)"
            v-if="scope.row.status === 2 && scope.row.sold_type === 2"
          >
            {{ t('form.action.changeNumber') }}
          </el-button>
        </div>
      </template>
    </ProTable>

    <Reference v-if="referenceVisible" v-model:visible="referenceVisible" v-model:params="params" />
    <Detail v-if="detailVisible" v-model:visible="detailVisible" v-model:params="params" />
    <Confirm v-if="confirmVisible" v-model:visible="confirmVisible" v-model:params="params" />
    <CashSettlement
      v-if="cashSettlementVisible"
      v-model:visible="cashSettlementVisible"
      v-model:params="params"
    />
    <Refund v-if="refundVisible" v-model:visible="refundVisible" v-model:params="params" />
    <Completed v-if="completedVisible" v-model:visible="completedVisible" v-model:params="params" />
    <ChangeNumber
      v-if="changeNumberVisible"
      v-model:visible="changeNumberVisible"
      v-model:params="params"
    />
  </div>
</template>

<style scoped lang="scss">
.button-margin {
  margin-top: 2px; /* 上下左右间距 */
}
</style>
