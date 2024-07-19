<template>
  <div class="table-box" v-auth="['agentList', 'agentDirectList']">
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
        <div style="display: flex; margin-bottom: 5px">
          <span v-if="userStore.userInfo.identify === 2" style="color: red">
            Available: {{ key }} Pin Keys
          </span>
        </div>
        <div style="display: flex; align-items: baseline">
          <el-button
            v-auth="['agentCreate']"
            v-if="[1, 2].includes(userStore.userInfo.identify)"
            type="primary"
            :icon="CirclePlus"
            @click="openDrawer('create')"
          >
            {{ t('form.action.create') }}
          </el-button>
        </div>
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
          v-auth="['agentUpdate']"
          v-if="scope.row.id !== userStore.userInfo.id"
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('edit', scope.row)"
        >
          {{ t('form.action.edit') }}
        </el-button>

        <el-button
          v-if="scope.row.id !== userStore.userInfo.id"
          type="primary"
          v-auth="['agentDelete']"
          link
          :icon="Delete"
          @click="deleteAccount(scope.row)"
        >
          {{ t('form.action.delete') }}
        </el-button>
      </template>
    </ProTable>

    <UserDrawer v-if="dialog" v-model:visible="dialog" v-model:params="params" ref="drawerRef" />
  </div>
</template>

<script setup name="agentAccountManage" lang="jsx">
import { ref, reactive, markRaw, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, EditPen, CirclePlus, Delete, WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import ProTable from '@/components/ProTable/index.vue'
import { adminIdentify, adminStatus, bankList } from '@/utils/dict'
import { toDate } from '@/utils/day'
import UserDrawer from '@/views/agent/accountManage/components/UserDrawer.vue'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import * as zod from 'zod'
import { ACCOUNT_RULE, USERNAME_REGEXP } from '@/config/validate'
import {
  CreateRequest,
  ListRequest,
  UpdateRequest,
  DeleteRequest,
  ListDirectRequest
} from '@/api/agent/agent'
import { AgentRoleRequest } from '@/api/selection/selection'

const userStore = useUserStore()
const authStore = useAuthStore()

const key = computed(() => userStore.userInfo.key)
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

watch(
  () => dialog.value,
  (n) => {
    if (!n) {
      userStore
        .getUserInfo()
        .then(() => {})
        .catch(() => {})
    }
  }
)

const getTableList = (params) => {
  if (
    authStore.authButtonListGet.includes('agentDirectList') &&
    authStore.authButtonListGet.includes('agentList')
  ) {
    return ListRequest(params)
  }

  if (authStore.authButtonListGet.includes('agentDirectList')) {
    return ListDirectRequest(params)
  }

  if (authStore.authButtonListGet.includes('agentList')) {
    return ListRequest(params)
  }
  return ListDirectRequest(params)
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
    prop: 'link',
    label: '',
    render: (scope) => (
      <span>
        <Link style="width: 1.5em; height: 1.5em;" v-copy={scope.row.link} />
      </span>
    ),
    width: 60
  },
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
  // {
  //   prop: 'whatapps',
  //   label: t('form.fields.whatapps'),
  //   render: (scope) => <span v-copy={scope.row.whatapps}>{scope.row.whatapps}</span>
  // },
  // {
  //   prop: 'email',
  //   label: t('form.fields.email'),
  //   render: (scope) => <span v-copy={scope.row.email}>{scope.row.email}</span>
  // },
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
    prop: 'rate',
    label: t('form.fields.rate'),
    render: (scope) => <span>{scope.row.rate}%</span>
  },
  {
    prop: 'roleIds',
    label: t('form.fields.roleIds'),
    enum: AgentRoleRequest,
    isShow: false
  },
  {
    prop: 'bankId',
    label: t('form.fields.bankId'),
    enum: bankList(),
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      return (
        <>
          {scope.row.bankId ? (
            <p style="display:grid;gap:5px;">
              <el-tag type="warning">{t(`bank.${scope.row.bankId}`)}</el-tag>
              <el-tag v-copy={scope.row.bankHolderName} type="warning">
                {scope.row.bankHolderName}
              </el-tag>
              <el-tag v-copy={scope.row.bankNumber} type="warning">
                {scope.row.bankNumber}
              </el-tag>
            </p>
          ) : (
            ''
          )}
        </>
      )
    }
  },
  { prop: 'description', label: t('form.fields.description') },
  {
    prop: 'identify',
    label: t('form.fields.identify'),
    enum: adminIdentify().filter((i) => i.value > userStore.userInfo.identify),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' },
    width: 135,
    render: (scope) => {
      return (
        <>
          {scope.row.identify ? (
            <el-tag type={adminIdentify().find((i) => i.value === scope.row.identify)?.tagType}>
              {t(adminIdentify().find((i) => i.value === scope.row.identify)?.label)}{' '}
              {scope.row.identify === 2 ? `(${scope.row.key} Key)` : ``}
            </el-tag>
          ) : (
            '---'
          )}
        </>
      )
    }
  },
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
  params.value.api =
    title === 'create' ? CreateRequest : title === 'edit' ? UpdateRequest : undefined
  params.value.getTableList = proTable.value?.getTableList
  params.value.enumMap = proTable.value?.enumMap
}
</script>
