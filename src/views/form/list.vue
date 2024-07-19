<template>
  <div class="table-box" v-auth="['managerList', 'managerDirectList']">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
      :pagination="true"
      :rule="rule"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button
          v-auth="['managerCreate']"
          type="primary"
          :icon="CirclePlus"
          @click="openDrawer('create')"
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
        <el-button
          v-auth="['managerUpdate']"
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('edit', scope.row)"
          :disabled="scope.row.id === userStore.userInfo.id"
        >
          {{ t('form.action.edit') }}
        </el-button>

        <el-button
          v-auth="['managerDelete']"
          type="primary"
          link
          :icon="Delete"
          @click="deleteAccount(scope.row)"
          :disabled="scope.row.id === userStore.userInfo.id"
        >
          {{ t('form.action.delete') }}
        </el-button>
      </template>
    </ProTable>

    <UserDrawer ref="drawerRef" v-if="dialog" v-model:visible="dialog" v-model:params="params" />
  </div>
</template>

<script setup name="accountManage" lang="jsx">
import { ref, reactive, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, EditPen, CirclePlus, Delete, WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import ProTable from '@/components/ProTable/index.vue'
import { adminStatus } from '@/utils/dict'
import { toDate } from '@/utils/day'
import UserDrawer from '@/views/form/component/from.vue'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import * as zod from 'zod'
import { ACCOUNT_RULE, USERNAME_REGEXP } from '@/config/validate'
import { CreateRequest, ListRequest, UpdateRequest, DeleteRequest } from '@/api/form/form'
import { RoleRequest } from '@/api/selection/selection'

const userStore = useUserStore()
const authStore = useAuthStore()
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

const { t } = useI18n()

const getTableList = (params) => {
  if (
    authStore.authButtonListGet.includes('managerDirectList') &&
    authStore.authButtonListGet.includes('managerList')
  ) {
    return ListRequest(params)
  }

  if (authStore.authButtonListGet.includes('managerDirectList')) {
    return ListDirectRequest(params)
  }

  if (authStore.authButtonListGet.includes('managerList')) {
    return ListRequest(params)
  }
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

const sortTable = () => {
  ElMessage.success('修改列表排序成功')
}

function deleteAccount({ id, username }) {
  ElMessageBox.confirm(t('common.confirmDelete', { username }), '', {
    confirmButtonText: 'OK',
    type: 'warning',
    icon: markRaw(WarningFilled),
    center: true
  })
    .then(() => {
      DeleteRequest({ id })
        .then(() => {
          const message = `${t(`form.action.delete`, {
            target: username
          })} ${t('common.success')}`
          ElMessage.success({ message })
          proTable.value?.getTableList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}

const rule = {
  username: zod.string().regex(new RegExp(USERNAME_REGEXP), ACCOUNT_RULE).optional()
}
const columns = reactive([
  // { type: 'expand', label: '' },
  { prop: 'id', label: '#', width: 50 },
  {
    prop: 'username',
    label: t('form.fields.username'),
    search: { el: 'input' },
    render: (scope) => <span v-copy={scope.row.username}>{scope.row.username}</span>,
    width: 120
  },
  { prop: 'nickname', label: t('form.fields.nickname') },
  {
    prop: 'mobile',
    label: t('form.fields.mobile'),
    render: (scope) => <span v-copy={scope.row.mobile}>{scope.row.mobile}</span>
  },
  {
    prop: 'whatapps',
    label: t('form.fields.whatapps'),
    render: (scope) => <span v-copy={scope.row.whatapps}>{scope.row.whatapps}</span>
  },
  {
    prop: 'email',
    label: t('form.fields.email'),
    render: (scope) => <span v-copy={scope.row.email}>{scope.row.email}</span>
  },
  {
    prop: 'status',
    label: t('form.fields.status'),
    enum: adminStatus(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      return (
        <el-tag type={scope.row.status === 1 ? 'success' : 'danger'}>
          {scope.row.status ? t(`enum.adminStatus.${scope.row.status}`) : '---'}
        </el-tag>
      )
    },
    width: 100
  },
  {
    prop: 'roleIds',
    label: t('form.fields.roleIds'),
    enum: RoleRequest,
    search: { el: 'select-v2', props: { filterable: true, multiple: true } },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      const row = []
      for (const i of scope.row.roleIds) {
        const idx = proTable.value?.enumMap.get('roleIds').findIndex((o) => i === o.value)
        if (idx !== -1) {
          row.push(<el-tag type="info">{proTable.value?.enumMap.get('roleIds')[idx].label}</el-tag>)
          row.push(<br />)
        }
      }
      return row
    }
  },
  { prop: 'description', label: t('form.fields.description') },
  {
    prop: 'createdAt',
    label: t('form.fields.createdAt'),
    render: (scope) => toDate(scope.row.createdAt)
  },
  { prop: 'operation', label: t('form.fields.operation'), fixed: 'right', width: 100 }
])

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
    title === 'create' ? CreateRequest : title === 'edit' ? UpdateRequest : undefined
}
</script>
