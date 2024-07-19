<script setup>
import { SettingRequest, SettingUpdateRequest } from '@/api/setting/setting'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { formConfig, MIN_VALUE, MAX_VALUE, ZOD_STRING, MAX, URL } from '@/config/validate'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const { defineField, handleSubmit, resetForm, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      COMPANY_COMM_RATE: zod.number().min(0, MIN_VALUE).max(30, MAX_VALUE),
      MASTER_DEFAULT_COMM_RATE: zod.number().min(0, MIN_VALUE).max(20, MAX_VALUE),
      AGENT_DEFAULT_COMM_RATE: zod.number().min(0, MIN_VALUE).max(15, MAX_VALUE),
      FRONT_WEBSITE_LINK: ZOD_STRING.url(URL),
      CMS_WEBSITE_LINK: ZOD_STRING.url(URL),
      WHATSAPP: ZOD_STRING.max(100, MAX).optional(),
      FACEBOOK: ZOD_STRING.max(100, MAX).optional(),
      INSTAGRAM: ZOD_STRING.max(100, MAX).optional(),
      CUSTOMER_LIVE_CHAT: ZOD_STRING.max(100, MAX).optional(),
      MIN_BOOKING_PERCENT: zod.number().min(0, MIN_VALUE).max(100, MIN_VALUE),
      MASTER_DEFAULT_AGENT_KEYS: zod.number().min(0, MIN_VALUE).max(100, MIN_VALUE),
      LOCK_NUMBER_DURING_TRANSACTION: zod.number().min(0, MIN_VALUE).max(100, MIN_VALUE),
      LOCK_NUMBER_PERIOD_DAYS: zod.number().min(0, MIN_VALUE),
      COMPANY_WHATSAPP_L1: ZOD_STRING.max(100, MAX).optional(),
      COMPANY_WHATSAPP_L2: ZOD_STRING.max(100, MAX).optional(),
      COMPANY_WHATSAPP_L3: ZOD_STRING.max(100, MAX).optional(),
      MIN_NUMBER_PRICE: zod.number().min(0, MIN_VALUE),
      MAX_THIRD_PARTY_TRANSFER_LIMIT: zod.number().min(0, MIN_VALUE),
      EXISTING_OPEN_PURCHASE_ORDER: zod.number().min(0, MIN_VALUE)
    })
  ),
  initialValues: {}
})

let [FRONT_WEBSITE_LINK, FRONT_WEBSITE_LINK_PROP] = defineField('FRONT_WEBSITE_LINK', formConfig())

let [CMS_WEBSITE_LINK, CMS_WEBSITE_LINK_PROP] = defineField('CMS_WEBSITE_LINK', formConfig())

let [MASTER_DEFAULT_COMM_RATE, MASTER_DEFAULT_COMM_RATE_PROP] = defineField(
  'MASTER_DEFAULT_COMM_RATE',
  formConfig({ min: 0, max: 20 })
)

let [COMPANY_COMM_RATE, COMPANY_COMM_RATE_PROP] = defineField(
  'COMPANY_COMM_RATE',
  formConfig({ min: 0, max: 30 })
)

let [AGENT_DEFAULT_COMM_RATE, AGENT_DEFAULT_COMM_RATE_PROP] = defineField(
  'AGENT_DEFAULT_COMM_RATE',
  formConfig({ min: 0, max: 15 })
)

let [WHATSAPP, WHATSAPP_PROP] = defineField('WHATSAPP', formConfig({ max: 100 }))

let [FACEBOOK, FACEBOOK_PROP] = defineField('FACEBOOK', formConfig({ max: 100 }))

let [INSTAGRAM, INSTAGRAM_PROP] = defineField('INSTAGRAM', formConfig({ max: 100 }))

let [CUSTOMER_LIVE_CHAT, CUSTOMER_LIVE_CHAT_PROP] = defineField(
  'CUSTOMER_LIVE_CHAT',
  formConfig({ max: 100 })
)

let [MIN_BOOKING_PERCENT, MIN_BOOKING_PERCENT_PROP] = defineField(
  'MIN_BOOKING_PERCENT',
  formConfig({ min: 0, max: 100 })
)
let [LOCK_NUMBER_PERIOD_DAYS, LOCK_NUMBER_PERIOD_DAYS_PROP] = defineField(
  'LOCK_NUMBER_PERIOD_DAYS',
  formConfig({ min: 0 })
)

let [MASTER_DEFAULT_AGENT_KEYS, MASTER_DEFAULT_AGENT_KEYS_PROP] = defineField(
  'MASTER_DEFAULT_AGENT_KEYS',
  formConfig({ min: 0 })
)

let [LOCK_NUMBER_DURING_TRANSACTION, LOCK_NUMBER_DURING_TRANSACTION_PROP] = defineField(
  'LOCK_NUMBER_DURING_TRANSACTION',
  formConfig({ min: 0 })
)

let [COMPANY_WHATSAPP_L1, COMPANY_WHATSAPP_L1_PROP] = defineField(
  'COMPANY_WHATSAPP_L1',
  formConfig({ max: 100 })
)
let [COMPANY_WHATSAPP_L2, COMPANY_WHATSAPP_L2_PROP] = defineField(
  'COMPANY_WHATSAPP_L2',
  formConfig({ max: 100 })
)
let [COMPANY_WHATSAPP_L3, COMPANY_WHATSAPP_L3_PROP] = defineField(
  'COMPANY_WHATSAPP_L3',
  formConfig({ max: 100 })
)

let [MIN_NUMBER_PRICE, MIN_NUMBER_PRICE_PROP] = defineField(
  'MIN_NUMBER_PRICE',
  formConfig({ min: 0 })
)

let [MAX_THIRD_PARTY_TRANSFER_LIMIT, MAX_THIRD_PARTY_TRANSFER_LIMIT_PROP] = defineField(
  'MAX_THIRD_PARTY_TRANSFER_LIMIT',
  formConfig({ min: 0 })
)

let [EXISTING_OPEN_PURCHASE_ORDER, EXISTING_OPEN_PURCHASE_ORDER_PROP] = defineField(
  'EXISTING_OPEN_PURCHASE_ORDER',
  formConfig({ min: 0 })
)

const reset = () => {
  resetForm()
  getList()
}

const getList = () => {
  SettingRequest().then((res) => {
    setValues(res)
  })
}

const onSubmit = handleSubmit((values) => {
  SettingUpdateRequest(values).then(() => {
    const message = `${t(`form.action.edit`)} ${t('common.success')}`
    ElMessage.success({ message })
    reset()
  })
})

getList()
</script>

<template>
  <div class="card content-box">
    <el-form label-width="auto" @submit="onSubmit">
      <el-form-item :label="t('form.fields.FRONT_WEBSITE_LINK')" v-bind="FRONT_WEBSITE_LINK_PROP">
        <el-input v-model="FRONT_WEBSITE_LINK" />
      </el-form-item>

      <el-form-item :label="t('form.fields.CMS_WEBSITE_LINK')" v-bind="CMS_WEBSITE_LINK_PROP">
        <el-input v-model="CMS_WEBSITE_LINK" />
      </el-form-item>

      <el-form-item :label="t('form.fields.COMPANY_COMM_RATE')" v-bind="COMPANY_COMM_RATE_PROP">
        <el-input-number :min="0" :max="30" v-model="COMPANY_COMM_RATE" />
        <span style="color: red">&nbsp;%</span>
      </el-form-item>

      <el-form-item
        :label="t('form.fields.MASTER_DEFAULT_COMM_RATE')"
        v-bind="MASTER_DEFAULT_COMM_RATE_PROP"
      >
        <el-input-number :min="0" :max="20" v-model="MASTER_DEFAULT_COMM_RATE" />
        <span style="color: red">&nbsp;%</span>
      </el-form-item>

      <el-form-item
        :label="t('form.fields.AGENT_DEFAULT_COMM_RATE')"
        v-bind="AGENT_DEFAULT_COMM_RATE_PROP"
      >
        <el-input-number :min="0" :max="15" v-model="AGENT_DEFAULT_COMM_RATE" />
        <span style="color: red">&nbsp;%</span>
      </el-form-item>

      <el-form-item :label="t('form.fields.whatapps')" v-bind="WHATSAPP_PROP">
        <el-input v-model="WHATSAPP" />
      </el-form-item>

      <el-form-item :label="t('form.fields.FACEBOOK')" v-bind="FACEBOOK_PROP">
        <el-input v-model="FACEBOOK" />
      </el-form-item>

      <el-form-item :label="t('form.fields.INSTAGRAM')" v-bind="INSTAGRAM_PROP">
        <el-input v-model="INSTAGRAM" />
      </el-form-item>

      <el-form-item :label="t('form.fields.CUSTOMER_LIVE_CHAT')" v-bind="CUSTOMER_LIVE_CHAT_PROP">
        <el-input v-model="CUSTOMER_LIVE_CHAT" />
      </el-form-item>

      <el-form-item :label="t('form.fields.MIN_BOOKING_PERCENT')" v-bind="MIN_BOOKING_PERCENT_PROP">
        <el-input-number :min="0" :max="100" v-model="MIN_BOOKING_PERCENT" />
        <span style="color: red">&nbsp;%</span>
      </el-form-item>

      <el-form-item
        :label="t('form.fields.LOCK_NUMBER_PERIOD_DAYS')"
        v-bind="LOCK_NUMBER_PERIOD_DAYS_PROP"
      >
        <el-input-number :min="0" v-model="LOCK_NUMBER_PERIOD_DAYS" />
        <span style="color: red">&nbsp;Day</span>
      </el-form-item>

      <el-form-item
        :label="t('form.fields.MASTER_DEFAULT_AGENT_KEYS')"
        v-bind="MASTER_DEFAULT_AGENT_KEYS_PROP"
      >
        <el-input-number :min="0" v-model="MASTER_DEFAULT_AGENT_KEYS" />
      </el-form-item>

      <el-form-item
        :label="t('form.fields.LOCK_NUMBER_DURING_TRANSACTION')"
        v-bind="LOCK_NUMBER_DURING_TRANSACTION_PROP"
      >
        <el-input-number :min="0" v-model="LOCK_NUMBER_DURING_TRANSACTION" />
        <span style="color: red">&nbsp;Minutes</span>
      </el-form-item>

      <el-form-item :label="t('form.fields.COMPANY_WHATSAPP_L1')" v-bind="COMPANY_WHATSAPP_L1_PROP">
        <el-input v-model="COMPANY_WHATSAPP_L1" />
      </el-form-item>

      <el-form-item :label="t('form.fields.COMPANY_WHATSAPP_L2')" v-bind="COMPANY_WHATSAPP_L2_PROP">
        <el-input v-model="COMPANY_WHATSAPP_L2" />
      </el-form-item>

      <el-form-item :label="t('form.fields.COMPANY_WHATSAPP_L3')" v-bind="COMPANY_WHATSAPP_L3_PROP">
        <el-input v-model="COMPANY_WHATSAPP_L3" />
      </el-form-item>

      <el-form-item :label="t('form.fields.MIN_NUMBER_PRICE')" v-bind="MIN_NUMBER_PRICE_PROP">
        <el-input-number :min="0" v-model="MIN_NUMBER_PRICE" />
      </el-form-item>

      <el-form-item
        :label="t('form.fields.EXISTING_OPEN_PURCHASE_ORDER')"
        v-bind="EXISTING_OPEN_PURCHASE_ORDER_PROP"
      >
        <el-input-number :min="0" v-model="EXISTING_OPEN_PURCHASE_ORDER" />
      </el-form-item>

      <el-form-item
        :label="t('form.fields.MAX_THIRD_PARTY_TRANSFER_LIMIT')"
        v-bind="MAX_THIRD_PARTY_TRANSFER_LIMIT_PROP"
      >
        <el-input-number :min="0" v-model="MAX_THIRD_PARTY_TRANSFER_LIMIT" />
      </el-form-item>
      <el-form-item>
        <el-button native-type="button" @click="reset">{{ t('form.button.reset') }}</el-button>
        <el-button
          type="primary"
          native-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ t('form.button.update') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
