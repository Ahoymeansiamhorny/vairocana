<template>
  <div class="table-box product">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="true"
      @sortLogic="sortLogic"
      :tool-button="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          type="info"
          :icon="CopyDocument"
          @click="copyNumber(scope.selectedListIds, 1)"
          v-if="isSupported"
          :disabled="proTable?.value?.selectedList.length > 0"
          class="pr5 pl5"
        >
          {{ t('form.action.copyNumber') }}
        </el-button>

        <el-button
          type="info"
          :icon="CopyDocument"
          @click="copyNumber(scope.selectedListIds, 2)"
          v-if="isSupported"
          :disabled="proTable?.value?.selectedList.length > 0"
          class="pr5 pl5"
        >
          {{ t('form.action.copyResult') }}
        </el-button>

        <el-button
          type="primary"
          :icon="CirclePlus"
          @click="openDrawer('create')"
          v-auth="['numberCreate']"
          class="pr5 pl5"
        >
          {{ t('form.action.create') }}
        </el-button>

        <el-button
          v-auth="['numberDelete']"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
          class="pr5 pl5"
        >
          {{ t('form.action.delete') }}
        </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('view', scope.row)">
          {{ t('form.action.view') }}
        </el-button>
        <el-button
          v-auth="['numberUpdate']"
          v-if="scope.row.ownerId === userStore.userInfo.id || userStore.userInfo.identify === 1"
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('edit', scope.row)"
        >
          {{ t('form.action.edit') }}
        </el-button>

        <el-button
          v-auth="['numberDelete']"
          v-if="scope.row.ownerId === userStore.userInfo.id || userStore.userInfo.identify === 1"
          type="primary"
          link
          :icon="Delete"
          @click="batchDelete([scope.row.id])"
        >
          {{ t('form.action.delete') }}
        </el-button>
      </template>
    </ProTable>

    <Drawer ref="drawerRef" v-if="dialog" v-model:visible="dialog" v-model:params="params" />
  </div>
</template>

<script setup lang="jsx" name="numberList">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import ProTable from '@/components/ProTable/index.vue'
import {
  numberCategory,
  numberDisplay,
  // numberDisplay,
  numberRemark,
  numberSoldType,
  numberStatus,
  numberType
} from '@/utils/dict'
import { CirclePlus, Delete, EditPen, View, CopyDocument } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'
import { useUserStore } from '@/stores/modules/user'
import { priceFormat, phoneNumberFormat } from '@/utils/format'
import Drawer from '@/views/product/numberList/components/drawer.vue'
import { NumberOwnerRequest } from '@/api/selection/selection'
import {
  NumberCreateRequest,
  NumberDeleteRequest,
  NumberListRequest,
  NumberUpdateRequest
} from '@/api/product/product'

const { t, n } = useI18n()

const { isSupported, copy } = useClipboard()
const copyNumber = (item, type) => {
  const x = proTable.value.tableData
    .filter((i) => item.includes(i.id))
    .map((i) =>
      type === 1
        ? phoneNumberFormat(i.soldType === 2 ? i.afterDisplay : i.number)
        : `${phoneNumberFormat(i.soldType === 2 ? i.afterDisplay : i.number)} ${priceFormat(
            n,
            i.price
          )}`
    )
  copy(x.join('\n'))
  ElMessage({
    type: 'success',
    dangerouslyUseHTMLString: true,
    message: `${t('common.copySuccess')} <br/> ${x.join('<br/>')}`
  })
}

const userStore = useUserStore()
// ProTable 实例
const proTable = ref()

const dialog = ref(false)

const params = ref({
  row: {},
  api: void 0,
  getTableList: void 0,
  enumMap: new Map(),
  isView: false,
  title: 'view'
})

const getTableList = (params) => {
  return NumberListRequest(params)
}

const initParam = reactive({ sort: 1, type: 1, pageSize: 100 })

const sortLogic = (col) => {
  const { order, prop } = col
  if (order === null) {
    initParam.sort = 1
  } else {
    const sort = {
      id: { descending: 1, ascending: 2 },
      price: { descending: 3, ascending: 4 },
      category: { descending: 5, ascending: 6 },
      status: { descending: 7, ascending: 8 },
      createdAt: { descending: 11, ascending: 12 }
    }
    initParam.sort = sort[prop][order]
  }
}

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)

const dataCallback = (data) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
}

const columns = reactive([
  { type: 'selection', width: 40 },
  {
    prop: 'number',
    label: t('form.fields.number'),
    search: { el: 'input' },
    render: (scope) =>
      phoneNumberFormat(scope.row.soldType === 2 ? scope.row.afterDisplay : scope.row.number)
  },
  {
    prop: 'type',
    isShow: false,
    label: t('form.fields.type'),
    enum: numberType(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'display',
    isShow: false,
    label: t('form.fields.display'),
    enum: numberDisplay(),
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'price',
    label: t('form.fields.price'),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.price)
  },
  {
    prop: 'offerPrice',
    label: t('form.fields.OfferPrice'),
    render: (scope) => priceFormat(n, scope.row.offerPrice)
  },
  {
    prop: 'soldType',
    label: t('form.fields.soldType'),
    enum: numberSoldType(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'category',
    label: t('form.fields.category'),
    enum: numberCategory(),
    sortable: 'custom',
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'status',
    label: t('form.fields.status'),
    enum: numberStatus(),
    sortable: 'custom',
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'ownerId',
    tag: true,
    enum: NumberOwnerRequest,
    fieldNames: { label: 'label', value: 'value' },
    label: t('form.fields.owner'),
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'priceFrom',
    isShow: false,
    label: t('form.fields.priceFrom'),
    search: { el: 'input-number' }
  },
  {
    prop: 'priceTo',
    isShow: false,
    label: t('form.fields.priceTo'),
    search: { el: 'input-number' }
  },
  {
    prop: 'description',
    label: t('form.fields.description'),
    enum: numberRemark(),
    fieldNames: { label: 'label', value: 'value' }
  },
  { prop: 'operation', label: t('form.fields.operation'), width: 200 }
])

// 批量删除
const batchDelete = async (id) => {
  const x = proTable.value.tableData
    .filter((i) => {
      switch (userStore.userInfo.identify) {
        case 1:
          return ![2, 3].includes(i.status) && id.includes(i.id)
        case 2:
          return (
            i.ownerId === userStore.userInfo.id && ![2, 3].includes(i.status) && id.includes(i.id)
          )
        default:
          return false
      }
    })
    .map((i) => `${phoneNumberFormat(i.soldType === 2 ? i.afterDisplay : i.number)}`)
  await useHandleData(
    NumberDeleteRequest,
    { ids: id },
    t('common.confirmDelete', { username: `<br/>${x.join('<br/>')}` })
  )
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref(null)

const openDrawer = (title = '', row) => {
  dialog.value = true
  params.value.title = title
  params.value.isView = title === 'view'
  params.value.row = { ...row }
  params.value.getTableList = proTable.value?.getTableList
  params.value.enumMap = proTable.value?.enumMap
  params.value.api =
    title === 'create' ? NumberCreateRequest : title === 'edit' ? NumberUpdateRequest : undefined
}
</script>

<style scoped lang="scss"></style>
