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
    >
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDialog('view', scope.row)">
          {{ t('form.action.view') }}
        </el-button>
        <el-button
          v-auth="['memberUpdate']"
          type="primary"
          link
          :icon="EditPen"
          @click="openDialog('edit', scope.row)"
        >
          {{ t('form.action.edit') }}
        </el-button>
      </template>
    </ProTable>

    <Dialog ref="dialogRef" v-if="dialog" v-model:visible="dialog" v-model:params="params" />
  </div>
</template>

<script setup lang="jsx" name="memberList">
import ProTable from '@/components/ProTable/index.vue'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MemberListRequest,
  MemberUpdateRequest,
  MemberUpdateStatusRequest
} from '@/api/member/member'
import { adminStatus } from '@/utils/dict'
import { toDate } from '@/utils/day'
import { EditPen, View } from '@element-plus/icons-vue'
import Dialog from '@/views/member/account/components/dialog.vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useHandleData } from '@/hooks/useHandleData'

const { t } = useI18n()

const proTable = ref()

const authStore = useAuthStore()

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
  return MemberListRequest(params)
}

const dataCallback = (data) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
}

const sortLogic = (col) => {
  const { order, prop } = col
  if (order === null) {
    initParam.sort = 1
  } else {
    const sort = {
      id: { descending: 1, ascending: 2 },
      status: { descending: 3, ascending: 4 },
      createdAt: { descending: 5, ascending: 6 }
    }
    initParam.sort = sort[prop][order]
  }
}

const initParam = reactive({})

const columns = reactive([
  { prop: 'id', label: '#', width: 80, sortable: 'custom' },
  {
    prop: 'username',
    label: t('form.fields.username'),
    search: { el: 'input' },
    render: (scope) => <span v-copy={scope.row.username}>{scope.row.username}</span>
  },
  {
    prop: 'email',
    label: t('form.fields.email'),
    search: { el: 'input' },
    render: (scope) => <span v-copy={scope.row.email}>{scope.row.email}</span>
  },
  {
    prop: 'status',
    sortable: 'custom',
    label: t('form.fields.status'),
    enum: adminStatus(),
    search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      return (
        <>
          {proTable.value && authStore.authButtonListGet.includes('memberUpdateStatus') ? (
            <el-select model-value={scope.row.status}>
              {adminStatus().map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  onClick={() => changeStatus(scope.row, item.value)}
                  label={t(`enum.numberStatus.${item.value}`)}
                />
              ))}
            </el-select>
          ) : (
            // <el-tag type={scope.row.status ? 'success' : 'danger'}>
            <el-tag type={searchTagType(adminStatus(), scope.row.status)}>
              {scope.row.status ? t(`enum.numberStatus.${scope.row.status}`) : '---'}
            </el-tag>
          )}
        </>
      )
    }
  },
  { prop: 'remark', label: t('form.fields.remark') },
  {
    prop: 'createdAt',
    sortable: 'custom',
    label: t('form.fields.createdAt'),
    render: (scope) => toDate(scope.row.createdAt)
  },
  { prop: 'operation', label: t('form.fields.operation'), fixed: 'right' }
])

const changeStatus = async (row, status) => {
  await useHandleData(
    MemberUpdateStatusRequest,
    {
      id: row.id,
      status
    },
    t(`common.changeStatus`, { name: row.number })
  )
  proTable.value?.getTableList()
}

function searchTagType(item, status) {
  return item.find((i) => i.value === status).tagType
}

const openDialog = (title = '', row) => {
  dialog.value = true
  params.value.title = title
  params.value.isView = title === 'view'
  params.value.row = { ...row }
  params.value.getTableList = proTable.value?.getTableList
  params.value.enumMap = proTable.value?.enumMap
  params.value.api = MemberUpdateRequest
}
</script>

<style scoped lang="scss"></style>
