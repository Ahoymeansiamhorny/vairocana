<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :append-to-body="true"
    :before-close="handleClose"
    width="65%"
    :title="t(`form.action.${drawerProps.title}`, { target: drawerProps.row?.afterDisplay })"
  >
    <el-form
      label-position="left"
      label-width="auto"
      :disabled="drawerProps.isView"
      :hide-required-asterisk="drawerProps.isView"
      @submit="onSubmit"
    >
      <el-form-item
        v-if="drawerProps.title === 'create'"
        :label="t('form.fields.number')"
        v-bind="numberProps"
      >
        <el-input class="w-100" v-model="number" @change="detach" />
      </el-form-item>

      <el-form-item v-else :label="t('form.fields.number')">
        <el-input readonly class="w-100" v-model="drawerProps.row.afterDisplay" />
      </el-form-item>

      <el-form-item :label="t('form.fields.ownerId')" v-bind="ownerIdProps">
        <el-select v-model="ownerId" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('ownerId')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.price')" v-bind="priceProps">
        <el-input-number v-model="price" :min="200" />
      </el-form-item>

      <el-form-item :label="t('form.fields.display')" v-bind="displayProps">
        <el-radio-group v-model="display">
          <el-radio-button
            v-for="item in drawerProps.enumMap.get('display')"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="t('form.fields.status')" v-bind="statusProps">
        <el-select v-model="status" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('status')"
            :key="item.value"
            :label="item.label"
            :disabled="[2, 3].includes(item.value)"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.category')" v-bind="categoryProps">
        <el-select v-model="category" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('category')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.description')" v-bind="descriptionProps">
        <el-select v-model="description" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('description')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'create'"
        :label="t('form.fields.createdAt')"
        prop="createdAt"
      >
        <el-input
          v-model="drawerProps.row.createdAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
      </el-form-item>

      <el-form-item v-if="drawerProps.title !== 'create'" label="#ID" prop="id">
        <el-input v-model="drawerProps.row.id" disabled />
      </el-form-item>

      <el-form-item v-if="!drawerProps.isView">
        <el-button native-type="button" @click="reset">{{ t('form.button.reset') }}</el-button>
        <el-button
          type="primary"
          native-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ t('form.button.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup name="numberDrawer">
import { markRaw, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toDate } from '@/utils/day'
import { useI18n } from 'vue-i18n'
import { WarningFilled } from '@element-plus/icons-vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import {
  MIN,
  MAX,
  formConfig,
  ZOD_NUMBER,
  ZOD_STRING,
  ZOD_LITERAL,
  SELECTION,
  POSITIVE,
  IS_PHONE_REGEXP,
  IS_PHONE
} from '@/config/validate'
import { useUserStore } from '@/stores/modules/user'
import { phoneCategory } from '@/utils/format'
import { numberCategory } from '@/utils/dict'

const props = defineProps(['visible', 'params'])

const visible = ref(props.visible)

const drawerProps = ref(props.params)

const { t } = useI18n()

const emit = defineEmits(['update:visible'])

const close = () => emit('update:visible', false)

const userStore = useUserStore()

if (userStore.userInfo.identify === 3) {
  close()
}

const { defineField, handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      number: ZOD_STRING.regex(new RegExp(IS_PHONE_REGEXP), IS_PHONE),
      status: zod.union(
        drawerProps.value.enumMap.get('status').map((i) => ZOD_LITERAL(i.value, SELECTION))
      ),
      category: zod.union(
        drawerProps.value.enumMap.get('category').map((i) => ZOD_LITERAL(i.value, SELECTION))
      ),
      price: ZOD_NUMBER.positive(POSITIVE).min(200, MIN),
      ownerId: zod.union(
        drawerProps.value.enumMap.get('ownerId').map((i) => ZOD_LITERAL(i.value, SELECTION))
      ),
      display: zod.preprocess(
        (val) => (val ? Number(val) : null),
        zod.union([ZOD_LITERAL(1, SELECTION), ZOD_LITERAL(2, SELECTION)])
      ),
      description: ZOD_STRING.max(100, MAX).optional()
    })
  ),
  initialValues: {
    number: drawerProps.value.row.number,
    status: drawerProps.value.row.status || 1,
    category: drawerProps.value.row.category,
    price: drawerProps.value.row.price || 200,
    display: drawerProps.value.row.display || 1,
    description: drawerProps.value.row.description || '',
    ownerId:
      drawerProps.value.row.ownerId ||
      (userStore.userInfo.identify === 2 && drawerProps.value.enumMap.get('ownerId').length > 0)
        ? drawerProps.value.enumMap.get('ownerId')[0].value
        : null
  }
})

const reset = () => {
  if (drawerProps.value.title === 'create') {
    resetForm()
  } else {
    setFieldValue('number', drawerProps.value.row.number)
    setFieldValue('status', drawerProps.value.row.status)
    setFieldValue('category', drawerProps.value.row.category)
    setFieldValue('price', drawerProps.value.row.price)
    setFieldValue('display', drawerProps.value.row.display)
    setFieldValue('description', drawerProps.value.row.description)
    setFieldValue('ownerId', drawerProps.value.row.ownerId)
  }
}

let [number, numberProps] = defineField('number', formConfig({ min: 10, max: 11 }))
let [ownerId, ownerIdProps] = defineField('ownerId', formConfig())
let [price, priceProps] = defineField('price', formConfig({ min: 200 }))
let [category, categoryProps] = defineField('category', formConfig())
let [status, statusProps] = defineField('status', formConfig())
let [description, descriptionProps] = defineField('description', formConfig({ max: 100 }))
let [display, displayProps] = defineField('display', formConfig())
//
const onSubmit = handleSubmit((values) => {
  const param = { id: drawerProps.value.row.id, ...values }
  if (param.id === undefined) {
    delete param.id
  }
  drawerProps.value
    .api(param)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, {
        target: drawerProps.value.row.name
      })} ${t('common.success')}`
      ElMessage.success({ message })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => {
      console.log(e)
    })
})

const detach = (n) => {
  if (n && n.length >= 10) {
    const value = phoneCategory(n)
    const idx = numberCategory().findIndex((i) => value === i.value)
    if (idx !== -1) {
      setFieldValue('category', value)
      return true
    }
  }
  setFieldValue('category', null)
}

const handleClose = () => {
  if (drawerProps.value.title === 'view') {
    resetForm()
    return close()
  }
  ElMessageBox.confirm(t('common.dialogDrawerClose'), '', {
    confirmButtonText: 'OK',
    type: 'warning',
    icon: markRaw(WarningFilled),
    center: true
  })
    .then(() => {
      resetForm()
      return close()
    })
    .catch(() => {})
}
</script>
