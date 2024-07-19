<template>
  <div class="table-box" v-auth="['managerLoginLog']">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="true"
      :rule="rule"
      :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
    ></ProTable>
  </div>
</template>

<script setup name="adminLoginLog">
import ProTable from '@/components/ProTable/index.vue'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DATE_TIME_FORMAT,
  DATE_TIME_VALUE_FORMAT,
  dateShortcuts,
  defaultTime,
  toDate,
  today
} from '@/utils/day'
import * as uap from 'ua-parser-js'
import { LoginLogRequest } from '@/api/manager/manager'

const { t } = useI18n()
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
  date: today()
})

const p = (x) => {
  const v = []
  for (const key in x) {
    if (typeof x[key] === 'string' && x[key]) {
      v.push(x[key])
    }
  }
  return v.join(' ')
}

const columns = reactive([
  { type: 'index', label: '#' },
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
  { prop: 'username', label: t('form.fields.username'), search: { el: 'input' }, width: 100 },
  { prop: 'ip', label: t('form.fields.ip'), search: { el: 'input' } },
  { prop: 'city', label: t('form.fields.city') },
  { prop: 'regionName', label: t('form.fields.regionName') },
  { prop: 'country', label: t('form.fields.country') },
  {
    prop: 'ua',
    label: t('form.fields.browser'),
    render: (score) => p(new uap.UAParser(score.row.ua).getBrowser())
  },
  {
    prop: 'ua',
    label: t('form.fields.device'),
    render: (score) => p(new uap.UAParser(score.row.ua).getDevice()) || score.row.ua
  },
  {
    prop: 'ua',
    label: t('form.fields.os'),
    render: (score) => p(new uap.UAParser(score.row.ua).getOS())
  },
  {
    prop: 'createdAt',
    label: t('form.fields.loginAt'),
    width: 210,
    render: (scope) => toDate(scope.row.createdAt)
  }
])

const getTableList = (params) => {
  return LoginLogRequest(params)
}
const dataCallback = (data) => ({
  list: data.list,
  total: data.total,
  pageNum: data.pageNum,
  pageSize: data.pageSize
})

const rule = {}
</script>

<style scoped lang="scss"></style>
