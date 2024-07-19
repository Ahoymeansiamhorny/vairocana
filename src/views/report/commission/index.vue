<script setup lang="jsx" name="productContributionReport">
import ProTable from '@/components/ProTable/index.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import {
  DATE_TIME_FORMAT,
  DATE_TIME_VALUE_FORMAT,
  dateShortcuts,
  defaultTime,
  thisMonth,
  toDate
} from '@/utils/day'
import {
  AgentCommissionReportRequest,
  MasterCommissionReportRequest,
  OwnerCostReport
} from '@/api/report'
import { phoneNumberFormat, priceFormat } from '@/utils/format'

const route = useRoute()

const { t, n } = useI18n()

const proTable = ref()

const label = () => {
  switch (route.name) {
    case 'masterCommissionList':
      return 'master'
    case 'agentCommissionList':
      return 'agent'
    case 'ownerCostList':
      return 'ownerId'
  }
}

const commlabel = () => {
  switch (route.name) {
    case 'masterCommissionList':
      return 'master_comm'
    case 'agentCommissionList':
      return 'agent_comm'
    case 'ownerCostList':
      return 'owner_cost'
  }
}

const initParam = reactive({
  date: thisMonth(), //today()
  sort: 14
})

const sortLogic = (col) => {
  const { order, prop } = col
  if (order === null) {
    initParam.sort = 14
  } else {
    const sort = {
      number: { descending: 3, ascending: 4 },
      order_id: { descending: 5, ascending: 6 },
      amount: { descending: 7, ascending: 8 },
      comm: { descending: 9, ascending: 10 },
      // rate: { descending: 11, ascending: 12 },
      settle_at: { descending: 13, ascending: 14 }
    }
    initParam.sort = sort[prop][order]
  }
}

const getTableList = (params) => {
  return route.name === 'masterCommissionList'
    ? MasterCommissionReportRequest(params)
    : route.name === 'agentCommissionList'
    ? AgentCommissionReportRequest(params)
    : OwnerCostReport(params)
}

const dataCallback = (data) => ({
  list: data.list,
  total: data.total,
  pageNum: data.pageNum,
  pageSize: data.pageSize
})

const columns = reactive([
  { type: 'index', label: '#', width: 50, sortable: 'custom' },
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
    prop: 'target',
    label: t(`form.fields.${label()}`),
    sortable: 'custom',
    search: { el: 'input' },
    isShow: false
  },
  {
    prop: 'account',
    label: t(`form.fields.${label()}`)
  },
  {
    prop: 'number',
    label: t('form.fields.number'),
    sortable: 'custom',
    render: (scope) => phoneNumberFormat(scope.row.number)
  },
  {
    prop: 'order_id',
    label: t('form.fields.order_id'),
    // search: { el: 'input' },
    sortable: 'custom',
    width: 180
  },
  {
    prop: 'amount',
    label: t('form.fields.amount'),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.amount)
  },
  {
    prop: 'comm',
    label: t(`form.fields.${commlabel()}`),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.comm)
  },
  {
    prop: 'rate',
    label: t('form.fields.rate'),
    render: (scope) => `${scope.row.rate}%`
  },
  {
    prop: 'settle_at',
    label: t('form.fields.settleAt'),
    sortable: 'custom',
    render: (scope) => toDate(scope.row.settle_at),
    width: 150
  }
])
</script>

<template>
  <div class="table-box">
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
      <template #tableHeader>
        {{ t(`menu.${route.name}`) }}
      </template>
    </ProTable>
  </div>
</template>

<style scoped lang="scss"></style>
