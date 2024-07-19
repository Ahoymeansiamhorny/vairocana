<template>
  <div class="table-box" v-auth="['roleList']">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="true"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button
          type="primary"
          :icon="CirclePlus"
          @click="openDrawer('create')"
          v-auth="['roleCreate']"
        >
          {{ t('form.action.create') }}
        </el-button>
      </template>

      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('view', scope.row)">
          {{ t('form.action.view') }}
        </el-button>
        <!--          :disabled="scope.row.id === 1 || scope.row.id === userStore.userInfo.id"-->
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('edit', scope.row)"
          v-auth="['roleCreate']"
        >
          {{ t('form.action.edit') }}
        </el-button>

        <el-button
          type="primary"
          link
          :icon="Delete"
          @click="deleteAccount(scope.row)"
          v-auth="['roleDelete']"
        >
          {{ t('form.action.delete') }}
        </el-button>
      </template>
    </ProTable>
    <Drawer ref="drawerRef" v-if="dialog" v-model:visible="dialog" v-model:params="params" />
  </div>
</template>

<script setup name="roleManage" lang="jsx">
import { ref, reactive, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, EditPen, Delete, CirclePlus, WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import ProTable from '@/components/ProTable/index.vue'
import { toDate } from '@/utils/day'
import Drawer from '@/views/admin/roleManage/components/drawer.vue'
import { useUserStore } from '@/stores/modules/user'
import { adminIdentify } from '@/utils/dict'
import { CreateRequest, DeleteRequest, UpdateRequest, ListRequest } from '@/api/role/role'
import { PermissionRequest } from '@/api/selection/selection'

const userStore = useUserStore()
// ProTable 实例
const proTable = ref()

const { t } = useI18n()

const getTableList = (params) => {
  return ListRequest(params)
}

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
}

const columns = reactive([
  { prop: 'id', label: '#', width: 50 },
  {
    prop: 'name',
    label: t('form.fields.name')
  },
  {
    prop: 'creator',
    label: t('form.fields.creator'),
    width: 120
  },
  { prop: 'description', label: t('form.fields.description'), width: 150 },
  {
    prop: 'assign',
    label: t('form.fields.identify'),
    width: 150,
    enum: adminIdentify().filter((i) => i.value >= userStore.userInfo.identify),
    fieldNames: { label: 'label', value: 'value' },
    search: { el: 'select-v2' }
  },
  {
    prop: 'createdAt',
    label: t('form.fields.createdAt'),
    render: (scope) => {
      return toDate(scope.row.createdAt)
    }
  },
  {
    isShow: false,
    prop: 'permission',
    enum: PermissionRequest,
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'modifiedAt',
    label: t('form.fields.modifiedAt'),
    render: (scope) => {
      return toDate(scope.row.modifiedAt)
    }
  },
  { prop: 'operation', label: t('form.fields.operation'), fixed: 'right', width: 250 }
])

function deleteAccount({ id, name }) {
  ElMessageBox.confirm(t('common.confirmDelete', { username: name }), '', {
    confirmButtonText: 'OK',
    type: 'warning',
    icon: markRaw(WarningFilled),
    center: true
  })
    .then(() => {
      DeleteRequest({ id })
        .then(() => {
          const message = `${t(`form.action.delete`, {
            target: name
          })} ${t('common.success')}`
          ElMessage.success({ message })
          proTable.value?.getTableList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref(null)
const dialog = ref(false)
const params = ref({
  row: {},
  api: void 0,
  getTableList: void 0,
  enumMap: new Map(),
  isView: false,
  title: 'view'
})

const openDrawer = (title = '', row) => {
  dialog.value = true

  params.value.title = title
  params.value.isView = title === 'view'
  params.value.row = { ...row }
  params.value.getTableList = proTable.value?.getTableList
  params.value.enumMap = proTable.value?.enumMap
  params.value.api =
    title === 'create' ? CreateRequest : title === 'edit' ? UpdateRequest : undefined
}
</script>
