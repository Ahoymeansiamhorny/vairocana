<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="handleClose"
    width="65%"
    :title="t(`form.action.${drawerProps.title}`, { target: drawerProps.row.username })"
  >
    <el-form
      label-position="left"
      label-width="auto"
      :disabled="drawerProps.isView"
      :hide-required-asterisk="drawerProps.isView"
      @submit="onSubmit"
    >
      <el-form-item :label="t('form.fields.identify')" v-bind="identifyProps">
        <el-select v-model="identify" :disabled="drawerProps.title !== 'create'" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('identify')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.expired')" v-bind="expiredProps">
        <el-date-picker
          class="w-100"
          v-model="expired"
          type="date"
          placeholder="Pick a day"
          :value-format="DATE_TIME_VALUE_FORMAT"
          :format="DATE_TIME_FORMAT"
        />
      </el-form-item>

      <el-form-item :label="t('form.fields.username')" v-bind="usernameProps">
        <el-input v-model="username" :disabled="drawerProps.title !== 'create'" />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'view'"
        :label="t('form.fields.password')"
        v-bind="passwordProps"
      >
        <el-input v-model="password" />
      </el-form-item>

      <el-form-item :label="t('form.fields.status')" v-bind="statusProps">
        <el-select v-model="status" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('status')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.nickname')" v-bind="nicknameProps">
        <el-input v-model="nickname" />
      </el-form-item>

      <el-form-item :label="t('form.fields.email')" v-bind="emailProps">
        <el-input v-model="email" clearable />
      </el-form-item>

      <el-form-item :label="t('form.fields.mobile')" v-bind="mobileProps">
        <el-input v-model="mobile" placeholder="" clearable />
      </el-form-item>

      <el-form-item :label="t('form.fields.whatapps')" v-bind="whatappsProps">
        <el-input v-model="whatapps" />
      </el-form-item>

      <el-form-item :label="t('form.fields.rate')" v-bind="rateProps">
        <el-input-number
          v-model="rate"
          :precision="0"
          :step="1"
          class="w-100"
          :min="10"
          :max="rateMax"
        />
      </el-form-item>

      <el-form-item v-if="identify === 2" label="Key" v-bind="keyProps">
        <el-input-number v-model="key" :min="0" :step="1" :precision="0" class="w-100" />
      </el-form-item>

      <el-form-item :label="t('form.fields.role')" v-bind="roleIdsProps">
        <el-select multiple v-model="roleIds" clearable class="w-100">
          <el-option
            v-for="item in role"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.bankId')" v-bind="bankIdProps">
        <el-select v-model="bankId" class="w-100">
          <el-option
            v-for="item in drawerProps.enumMap.get('bankId')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.bankNumber')" v-bind="bankNumberProps">
        <el-input v-model="bankNumber" placeholder="" clearable />
      </el-form-item>

      <el-form-item :label="t('form.fields.bankHolderName')" v-bind="bankHolderNameProps">
        <el-input v-model="bankHolderName" placeholder="" clearable />
      </el-form-item>

      <el-form-item :label="t('form.fields.description')" v-bind="descriptionProps">
        <el-input v-model="description" placeholder="" clearable />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'create'"
        :label="t('form.fields.createdAt')"
        prop="createdAt"
      >
        <el-input
          :model-value="drawerProps.row.createdAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'create'"
        :label="t('form.fields.modifiedAt')"
        prop="modifiedAt"
      >
        <el-input
          :model-value="drawerProps.row.modifiedAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
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

<script setup name="AgentDrawer">
import { markRaw, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { DATE_TIME_FORMAT, DATE_TIME_VALUE_FORMAT, toDate } from '@/utils/day'
import { useI18n } from 'vue-i18n'
import { WarningFilled } from '@element-plus/icons-vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import {
  ACCOUNT_RULE,
  EMAIL,
  formConfig,
  IS_DIGIT,
  IS_DIGIT_REGEXP,
  MAX,
  MIN,
  PASSWORD_REGEXP,
  PASSWORD_RULE,
  SELECTION,
  USERNAME_REGEXP,
  ZOD_DATE,
  ZOD_LITERAL,
  ZOD_NUMBER,
  ZOD_STRING
} from '@/config/validate'
import * as zod from 'zod'
import { useUserStore } from '@/stores/modules/user'

const props = defineProps(['visible', 'params'])

const visible = ref(props.visible)

const drawerProps = ref(props.params)

const emit = defineEmits(['update:visible'])

const userStore = useUserStore()
const close = () => emit('update:visible', false)

if (userStore.userInfo.identify === 3) {
  close()
}

if (drawerProps.value.title === 'create') {
  if (userStore.userInfo.identify === 2) {
    // master identify
    drawerProps.value.row.identify = 3
  } else {
    // company identify
    drawerProps.value.row.identify = 2
  }
}

const role = ref([])
switch (drawerProps.value.title) {
  case 'view':
  case 'edit':
  case 'create':
    // console.log(drawerProps.value.enumMap.get('roleIds'))
    // console.log(drawerProps.value.row.identify)
    role.value = drawerProps.value.enumMap
      .get('roleIds')
      .filter((i) => i.assign === drawerProps.value.row.identify)
    break
}

const rateMax = ref(
  // drawerProps.value.title === 'edit' ? (drawerProps.value.row.identify === 2 ? 20 : 15) : 15
  drawerProps.value.row.identify === 2 ? 20 : 15
)

const defaultRate = ref(
  drawerProps.value.title === 'create' ? (drawerProps.value.row.identify === 2 ? 20 : 10) : 0
)

const { t } = useI18n()
const { defineField, handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      username: ZOD_STRING.regex(new RegExp(USERNAME_REGEXP), ACCOUNT_RULE),
      password:
        drawerProps.value.title === 'create'
          ? ZOD_STRING.regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE)
          : ZOD_STRING.regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE).optional(),
      status: zod.union([ZOD_LITERAL(1, SELECTION), ZOD_LITERAL(2, SELECTION)]),
      identify: zod.union([ZOD_LITERAL(2, SELECTION), ZOD_LITERAL(3, SELECTION)]),
      roleIds: ZOD_NUMBER.array().nonempty(SELECTION),
      mobile: ZOD_STRING.min(10, MIN).max(15, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
      whatapps: ZOD_STRING.min(10, MIN).max(15, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
      email: ZOD_STRING.email(EMAIL),
      description: ZOD_STRING.max(100, MAX).optional(),
      nickname: ZOD_STRING.max(20, MAX),
      bankId: ZOD_NUMBER.int(),
      key: ZOD_NUMBER.int().optional(),
      rate: ZOD_NUMBER.int(),
      bankNumber: ZOD_STRING.max(20, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
      bankHolderName: ZOD_STRING.max(100, MAX),
      expired: zod.preprocess((data) => data || undefined, ZOD_DATE.optional())
    })
  ),
  initialValues: {
    username: drawerProps.value.row.username,
    password: drawerProps.value.row.password,
    status: drawerProps.value.row.status || 1,
    identify: drawerProps.value.row.identify,
    roleIds: drawerProps.value.row.roleIds || [],
    mobile: drawerProps.value.row.mobile,
    whatapps: drawerProps.value.row.whatapps,
    email: drawerProps.value.row.email,
    description: drawerProps.value.row.description,
    nickname: drawerProps.value.row.nickname,
    bankId: drawerProps.value.row.bankId,
    key: drawerProps.value.row.key,
    rate: drawerProps.value.row.rate || defaultRate.value, // rateMax.value
    bankNumber: drawerProps.value.row.bankNumber,
    bankHolderName: drawerProps.value.row.bankHolderName,
    expired: drawerProps.value.row.expired
      ? toDate(drawerProps.value.row.expired, DATE_TIME_VALUE_FORMAT)
      : undefined
  }
})

const reset = () => {
  if (drawerProps.value.title === 'create') {
    resetForm()
  } else {
    setFieldValue('expired', toDate(drawerProps.value.row.expired, DATE_TIME_VALUE_FORMAT))
    setFieldValue('identify', drawerProps.value.row.identify)
    setFieldValue('username', drawerProps.value.row.username)
    setFieldValue('password', drawerProps.value.row.password)
    setFieldValue('roleIds', drawerProps.value.row.roleIds)
    setFieldValue('status', drawerProps.value.row.status)
    setFieldValue('mobile', drawerProps.value.row.mobile)
    setFieldValue('description', drawerProps.value.row.description)
    setFieldValue('nickname', drawerProps.value.row.nickname)
    setFieldValue('email', drawerProps.value.row.email)
    setFieldValue('whatapps', drawerProps.value.row.whatapps)
    setFieldValue('rate', drawerProps.value.row.rate)
    setFieldValue('bankId', drawerProps.value.row.bankId)
    setFieldValue('bankNumber', drawerProps.value.row.bankNumber)
    setFieldValue('bankHolderName', drawerProps.value.row.bankHolderName)
    setFieldValue('key', drawerProps.value.row.key)
  }
}

// toDate

const [expired, expiredProps] = defineField('expired', formConfig())
const [identify, identifyProps] = defineField('identify', formConfig())
const [username, usernameProps] = defineField('username', formConfig())
const [password, passwordProps] = defineField('password', formConfig())
const [roleIds, roleIdsProps] = defineField('roleIds', formConfig())
const [status, statusProps] = defineField('status', formConfig())
const [mobile, mobileProps] = defineField('mobile', formConfig({ max: 15, min: 10 }))
const [description, descriptionProps] = defineField('description', formConfig({ max: 100 }))
const [nickname, nicknameProps] = defineField('nickname', formConfig({ max: 20 }))
const [email, emailProps] = defineField('email', formConfig())
const [whatapps, whatappsProps] = defineField('whatapps', formConfig({ max: 15, min: 10 }))
const [rate, rateProps] = defineField('rate', formConfig())
const [bankId, bankIdProps] = defineField('bankId', formConfig())
const [bankNumber, bankNumberProps] = defineField('bankNumber', formConfig({ max: 20 }))
const [bankHolderName, bankHolderNameProps] = defineField(
  'bankHolderName',
  formConfig({ max: 100 })
)
const [key, keyProps] = defineField('key', formConfig())

watch(
  () => identify.value,
  (n) => {
    if (drawerProps.value.title === 'create') {
      role.value = drawerProps.value.enumMap.get('roleIds').filter((i) => i.assign === n)
      setFieldValue('roleIds', role.value.length > 0 ? [role.value[0].value] : [])
      setFieldValue('key', undefined)
      rateMax.value = identify.value === 2 ? 20 : 15
      defaultRate.value = identify.value === 2 ? 20 : 10
      setFieldValue('rate', defaultRate.value)
    } else {
      rateMax.value = identify.value === 2 ? 20 : 15
    }
  }
)

watch(
  () => password.value,
  (n) => {
    if (drawerProps.value.title === 'edit') {
      if (n === '') {
        setFieldValue('password', undefined)
      }
    }
  }
)

const onSubmit = handleSubmit((values) => {
  const param = { id: drawerProps.value.row.id, ...values }
  if (param.password === undefined) {
    delete param.password
  }

  if (param.id === undefined) {
    delete param.id
  }
  drawerProps.value
    .api(param)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, {
        target: drawerProps.value.row.username
      })} ${t('common.success')}`
      ElMessage.success({ message })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => {
      console.log(e, 'err')
    })
})
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
