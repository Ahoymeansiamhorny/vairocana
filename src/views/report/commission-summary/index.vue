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
  thisMonth
} from '@/utils/day'
import {
  AgentCommissionReportRequest,
  MasterCommissionReportRequest,
  OwnerCostSummaryReport
} from '@/api/report'
import { priceFormat } from '@/utils/format'

const route = useRoute()

const { t, n } = useI18n()

const proTable = ref()

const label = () => {
  switch (route.name) {
    case 'masterCommissionSummaryList':
      return 'master'
    case 'agentCommissionSummaryList':
      return 'agent'
    case 'ownerCostSummaryList':
      return 'ownerId'
  }
}

const commlabel = () => {
  switch (route.name) {
    case 'masterCommissionSummaryList':
      return 'total_master_comm'
    case 'agentCommissionSummaryList':
      return 'total_agent_comm'
    case 'ownerCostSummaryList':
      return 'total_owner_cost'
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
    : OwnerCostSummaryReport(params)
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
    prop: 'count',
    label: t(`form.fields.count`)
  },
  {
    prop: 'comm',
    label: t(`form.fields.${commlabel()}`),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.comm)
  },
  {
    prop: 'bank_id',
    label: t('form.fields.bankId'),
    render: (scope) => {
      return (
        <>
          {scope.row.bank_id ? (
            // (<el-tag type="warning">{t(`bank.${scope.row.bank_id}`)}</el-tag>)
            <span>{t(`bank.${scope.row.bank_id}`)}</span>
          ) : (
            ''
          )}
        </>
      )
    }
  },
  {
    prop: 'bank_holder_name',
    label: t('form.fields.bankHolderName')
  },
  {
    prop: 'bank_number',
    label: t('form.fields.bankNumber')
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
