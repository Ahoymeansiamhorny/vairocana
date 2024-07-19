<script setup lang="jsx" name="productContributionReport">
import ProTable from '@/components/ProTable/index.vue'
import { reactive, ref } from 'vue'
import { ProductContributionReportRequest } from '@/api/report'
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
import { paymentType } from '@/utils/dict'

const { t, n } = useI18n()

const proTable = ref()

const initParam = reactive({
  // date: ['2023-06-01T00:00:00+08:00', '2024-07-01T23:59:59+08:00'], //today()
  date: thisMonth(), //today()
  sort: 1
})

const sortLogic = (col) => {
  const { order, prop } = col
  if (order === null) {
    initParam.sort = 1
  } else {
    const sort = {
      order_id: { descending: 1, ascending: 2 },
      number: { descending: 3, ascending: 4 },
      payment_type: { descending: 5, ascending: 6 },
      cost: { descending: 7, ascending: 8 },
      amount: { descending: 9, ascending: 10 },
      agent_comm: { descending: 11, ascending: 12 },
      master_comm: { descending: 13, ascending: 14 },
      company_comm: { descending: 15, ascending: 16 },
      owner: { descending: 17, ascending: 18 },
      settle_at: { descending: 19, ascending: 20 },
      agent: { descending: 21, ascending: 22 },
      master: { descending: 23, ascending: 24 }
    }
    initParam.sort = sort[prop][order]
  }
}

const getTableList = (params) => {
  return ProductContributionReportRequest(params)
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
    prop: 'number',
    label: t('form.fields.number'),
    search: { el: 'input' },
    sortable: 'custom',
    render: (scope) => phoneNumberFormat(scope.row.number)
  },
  {
    prop: 'order_id',
    label: t('form.fields.order_id'),
    search: { el: 'input' },
    sortable: 'custom',
    width: 180
  },
  {
    prop: 'settle_at',
    label: t('form.fields.settleAt'),
    sortable: 'custom',
    render: (scope) => toDate(scope.row.settle_at),
    width: 150
  },
  {
    prop: 'payment_type',
    label: t('form.fields.payment_type'),
    enum: paymentType(),
    sortable: 'custom',
    // search: { el: 'select', props: { filterable: true } },
    fieldNames: { label: 'label', value: 'value' }
  },
  {
    prop: 'amount',
    label: t('form.fields.transactionAmount'),
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.amount)
  },
  {
    prop: 'owner',
    label: t('form.fields.owner'),
    sortable: 'custom'
  },
  {
    prop: 'cost',
    label: t('form.fields.OfferPrice'),
    // search: { el: 'input' },
    sortable: 'custom',
    render: (scope) => priceFormat(n, scope.row.cost)
  },
  {
    prop: 'company_comm',
    label: t('form.fields.company_comm'),
    sortable: 'custom',
    render: (scope) => `${priceFormat(n, scope.row.company_comm)} (${scope.row.company_comm_rate}%)`
  },
  {
    prop: 'master',
    label: t('form.fields.master'),
    sortable: 'custom',
    render: (scope) => (scope.row.master_id > 0 ? scope.row.master : `-`)
  },
  {
    prop: 'master_comm',
    label: t('form.fields.master_comm'),
    sortable: 'custom',
    render: (scope) =>
      scope.row.master_id > 0
        ? `${priceFormat(n, scope.row.master_comm)} (${scope.row.master_comm_rate}%)`
        : `-`
  },
  {
    prop: 'agent',
    label: t('form.fields.agent'),
    sortable: 'custom',
    render: (scope) => (scope.row.agent_id > 0 ? scope.row.agent : `-`)
  },
  {
    prop: 'agent_comm',
    label: t('form.fields.agent_comm'),
    sortable: 'custom',
    render: (scope) =>
      scope.row.agent_id > 0
        ? `${priceFormat(n, scope.row.agent_comm)} (${scope.row.agent_comm_rate}%)`
        : `-`
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
      <template #tableHeader> {{ t('menu.productContributionReport') }} </template>
    </ProTable>
  </div>
</template>

<style scoped lang="scss"></style>
