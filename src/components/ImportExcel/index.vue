<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="Excel"
    :width="1250"
    class="excel-dialog"
  >
    <div class="main-box">
      <div class="card filter">
        <el-scrollbar style="height: calc(100% - 56px)">
          <el-form label-position="left" label-width="auto" @submit="onSubmit" @reset="resetForm()">
            <el-form-item :label="t('form.fields.ownerId')" v-bind="ownerIdProps" class="mb50">
              <el-select v-model="ownerId">
                <el-option
                  v-for="item in drawerProps.enumMap.get('ownerId')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('form.fields.display')" v-bind="displayProps" class="mb50">
              <el-select v-model="display">
                <el-option
                  v-for="item in drawerProps.enumMap.get('display')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('form.fields.number')" v-bind="numberProps" class="mb50">
              <el-select v-model="number" clearable>
                <el-option v-for="item in tableHeader" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('form.fields.price')" v-bind="priceProps" class="mb50">
              <el-select v-model="price" clearable>
                <el-option v-for="item in tableHeader" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('form.fields.description')" v-bind="descriptionProps">
              <el-select v-model="description" clearable>
                <el-option v-for="item in tableHeader" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button native-type="reset">{{ t('form.button.reset') }}</el-button>
              <el-button type="primary" native-type="submit">
                {{ t('form.button.confirm') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="table-box" style="height: 700px" v-loading="loadingT">
        <ProTable
          ref="proTable"
          :data="filterData"
          :columns="columns"
          :pagination="false"
          :tool-button="false"
        >
          <template #tableHeader>
            <el-upload
              ref="upload"
              class="upload-demo"
              :limit="excelLimit"
              :on-exceed="handleExceed"
              :before-upload="beforeExcelUpload"
              :on-remove="handleRemove"
              :http-request="handleClick"
            >
              <template #trigger>
                <el-button type="primary" :icon="UploadFilled">Select File</el-button>
              </template>

              <div class="el-upload">
                <el-button
                  class="ml3"
                  type="info"
                  :icon="Download"
                  tag="a"
                  :href="template"
                  download
                  :link="false"
                >
                  Download Template
                </el-button>

                <el-button class="ml3" type="danger" :icon="Share" @click="submit">
                  Upload To Server
                </el-button>
              </div>
            </el-upload>
          </template>
        </ProTable>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="ImportExcel" lang="jsx">
import { ref, nextTick, reactive } from 'vue'
import { Download, UploadFilled, Share } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import * as XLSX from 'xlsx/xlsx.mjs'
import { useI18n } from 'vue-i18n'
import { phoneCategory, phoneNumberFormat, priceFormat } from '@/utils/format'
import * as zod from 'zod'
import {
  IS_DIGIT,
  IS_DIGIT_REGEXP,
  MAX,
  MIN,
  SELECTION,
  ZOD_LITERAL,
  ZOD_NUMBER,
  ZOD_STRING,
  POSITIVE,
  formConfig
} from '@/config/validate'
import { NumberBulkRequest } from '@/api/product/product'
import ProTable from '@/components/ProTable/index.vue'
import { numberCategory } from '@/utils/dict'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

// const template = new URL('/src/assets/sample.xlsx', import.meta.url)
const template = new URL('/src/assets/vvip9numexcelupload.xlsx', import.meta.url)

// ProTable 实例
const proTable = ref()

const props = defineProps(['visible', 'params'])

const visible = ref(props.visible)

const drawerProps = ref(props.params)

const loadingT = ref(false)

const emit = defineEmits(['update:visible'])

const { t, n } = useI18n()
const close = () => emit('update:visible', false)

// 是否覆盖数据
// const isCover = ref(false)

// 最大文件上传数
const excelLimit = ref(1)

const rule = zod.object({
  id: ZOD_NUMBER,
  number: ZOD_STRING.regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT).min(10, MIN).max(11, MAX),
  status: zod.union(
    drawerProps.value.enumMap.get('status').map((i) => ZOD_LITERAL(i.value, SELECTION))
  ),
  category: zod.union(
    drawerProps.value.enumMap.get('category').map((i) => ZOD_LITERAL(i.value, SELECTION))
  ),
  price: ZOD_NUMBER.positive(POSITIVE),
  ownerId: zod.union(
    drawerProps.value.enumMap.get('ownerId').map((i) => ZOD_LITERAL(i.value, SELECTION))
  ),
  display: zod.union(
    drawerProps.value.enumMap.get('display').map((i) => ZOD_LITERAL(i.value, SELECTION))
  ),
  description: ZOD_STRING.max(100, MAX).optional()
})

const columns = reactive([
  { prop: 'id', label: '#', width: 80, sortable: true },
  {
    prop: 'number',
    label: t('form.fields.number'),
    render: (scope) => <span v-copy={scope.row.number}>{phoneNumberFormat(scope.row.number)}</span>
  },
  {
    prop: 'price',
    label: t('form.fields.price'),
    render: (scope) => (scope.row.error ? scope.row.price : priceFormat(n, scope.row.price))
  },
  {
    prop: 'category',
    label: t('form.fields.category'),
    enum: numberCategory(),
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => (
      <el-tag type="info">
        {scope.row.category ? t(`enum.numberCategory.${scope.row.category}`) : '---'}
      </el-tag>
    )
  },
  { prop: 'description', label: t('form.fields.description') },
  {
    prop: 'error',
    label: 'Error',
    render: (scope) => {
      return (
        <>
          {proTable.value && scope.row.error ? (
            <el-tag type="danger" size="large" style="white-space: normal">
              {scope.row.error}
            </el-tag>
          ) : (
            <span></span>
          )}
        </>
      )
    }
    // render: (scope) => (
    //   <el-tag type="danger" size="large" style="white-space: normal">
    //     {scope.row.error}
    //   </el-tag>
    // )
  }
])

const filterData = ref([])
const invalid = ref([])

const tableHeader = ref([])
const tableData = ref([])

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      ownerId: zod.union(
        drawerProps.value.enumMap.get('ownerId').map((i) => ZOD_LITERAL(i.value, SELECTION))
      ),
      display: zod.preprocess(
        (val) => (val ? Number(val) : null),
        zod.union([ZOD_LITERAL(1, SELECTION), ZOD_LITERAL(2, SELECTION)])
      ),
      number: ZOD_STRING,
      price: ZOD_STRING,
      description: ZOD_STRING.optional()
    })
  )
})

const onSubmit = handleSubmit(async (values) => {
  filterData.value = []
  invalid.value = []

  loadingT.value = true
  const x = []

  await new Promise((resolve) => {
    setTimeout(() => {
      for (const i of tableData.value) {
        const k = (i[values.number] || '').replace('-', '').replace(/\s+/g, '')
        const v = {
          id: i['__rowNum__'],
          number: k,
          price: i[values.price] || 0,
          description: `${i[values.description] || ''}`,
          category: phoneCategory(k),
          status: 1,
          display: display.value,
          ownerId: ownerId.value,
          error: ''
        }

        const idx = x.findIndex((xx) => xx.number === v.number)
        if (idx !== -1) {
          v.error = `Is duplicate`
          invalid.value.push(v)
          x[idx].error = `Is duplicate`
          invalid.value.push(x[idx])
          continue
        }

        const result = rule.safeParse(v)
        if (!result.success) {
          const err = result.error.issues?.[0]?.unionErrors?.[0].issues || result.error.issues
          for (const e of err) {
            if (e.message) {
              v.error = t(`validation.${e.message}`, {
                _field_: e.path?.[0] ? t(`form.fields.${e.path?.[0]}`) : '',
                max: e.maximum,
                min: e.maximum
              })
              invalid.value.push(v)
              break
            }
          }
        } else {
          console.log(result.data)
          x.push(result.data)
        }
      }
      if (invalid.value.length > 0) {
        filterData.value.push(...invalid.value)
      } else {
        filterData.value.push(...x)
      }
      loadingT.value = false
      resolve()
    }, 2000)
  })
  await nextTick()
  loadingT.value = false
})

let [ownerId, ownerIdProps] = defineField('ownerId', formConfig())
let [display, displayProps] = defineField('display', formConfig())
let [number, numberProps] = defineField('number', formConfig())
let [price, priceProps] = defineField('price', formConfig())
let [description, descriptionProps] = defineField('description', formConfig())

// 父组件传过来的参数
const parameter = ref({
  title: '',
  fileSize: 5,
  fileType: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
})

const submit = () => {
  if (tableData.value.length === 0) {
    return ElNotification({
      title: t('common.warn'),
      message: t('validation.UPLOAD'),
      type: 'warning',
      appendTo: '.excel-dialog'
    })
  }

  if (filterData.value.length === 0 || invalid.value.length > 0) {
    return ElNotification({
      title: t('common.warn'),
      message: t('common.uploadSelect'),
      type: 'warning',
      appendTo: '.excel-dialog'
    })
  }

  NumberBulkRequest({ data: filterData.value, ownerId: ownerId.value })
    .then(() => {
      ElMessage.success({ message: t('common.success') })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => e)
}

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file) => {
  const isExcel = parameter.value.fileType.includes(file.type)
  if (!isExcel)
    ElNotification({
      message: t('common.formatXls'), //'上传文件只能是 xls / xlsx 格式！',
      type: 'warning'
    })

  const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        message: t('common.uploadSize', { size: parameter.value.fileSize }),
        type: 'warning'
      })
    }, 0)
  return isExcel && fileSize
}

const handleClick = (e) => {
  const rawFile = e.file
  if (!rawFile) return
  upload(rawFile)
}

const upload = (rawFile) => {
  readerData(rawFile)
}

const readerData = (rawFile) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet)
      generateData({ header, results })
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

const getHeaderRow = (sheet) => {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

const generateData = ({ header, results }) => {
  if (results.length > 10000) {
    ElNotification({
      title: t('common.warn'),
      message: t('common.uploadLength'),
      type: 'warning'
    })
  } else {
    tableHeader.value = header
    tableData.value = results
  }
}

// 文件数超出提示
const handleExceed = () => {
  ElNotification({
    title: t('common.warn'),
    message: t('common.uploadExceed'),
    type: 'warning'
  })
}

const handleRemove = () => {
  resetForm()
  filterData.value = []
  invalid.value = []
  tableHeader.value = []
  tableData.value = []
  loadingT.value = false
}
</script>
<style lang="scss">
@import './index.scss';
</style>
