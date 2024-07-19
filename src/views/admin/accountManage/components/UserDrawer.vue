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
        <el-select v-model="status">
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

      <el-form-item :label="t('form.fields.role')" v-bind="roleIdsProps">
        <el-select multiple v-model="roleIds" clearable>
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        <el-button native-type="button" @click="reset">
          {{ t('form.button.reset') }}
        </el-button>
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

<script setup name="UserDrawer">
import { markRaw, ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { toDate } from '@/utils/day'
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
  ZOD_LITERAL,
  ZOD_NUMBER,
  ZOD_STRING
} from '@/config/validate'
import * as zod from 'zod'

const props = defineProps(['visible', 'params'])

const visible = ref(props.visible)

const drawerProps = ref(props.params)

const emit = defineEmits(['update:visible'])

const close = () => emit('update:visible', false)

let roles = ref(drawerProps.value.enumMap.get('roleIds'))

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
      roleIds: ZOD_NUMBER.array().nonempty(SELECTION),
      mobile: ZOD_STRING.min(10, MIN).max(15, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
      whatapps: ZOD_STRING.min(10, MIN).max(15, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
      email: ZOD_STRING.email(EMAIL),
      description: ZOD_STRING.max(100, MAX).optional(),
      nickname: ZOD_STRING.max(20, MAX)
    })
  ),
  initialValues: {
    username: drawerProps.value.row.username || '',
    roleIds: drawerProps.value.row.roleIds || [],
    status: drawerProps.value.row.status || 1,
    mobile: drawerProps.value.row.mobile || '',
    description: drawerProps.value.row.description || '',
    nickname: drawerProps.value.row.nickname || '',
    email: drawerProps.value.row.email || '',
    whatapps: drawerProps.value.row.whatapps || ''
  }
})

const reset = () => {
  if (drawerProps.value.title === 'create') {
    resetForm()
  } else {
    setFieldValue('username', drawerProps.value.row.username)
    setFieldValue('password', drawerProps.value.row.password)
    setFieldValue('roleIds', drawerProps.value.row.roleIds)
    setFieldValue('status', drawerProps.value.row.status)
    setFieldValue('mobile', drawerProps.value.row.mobile)
    setFieldValue('description', drawerProps.value.row.description)
    setFieldValue('nickname', drawerProps.value.row.nickname)
    setFieldValue('email', drawerProps.value.row.email)
    setFieldValue('whatapps', drawerProps.value.row.whatapps)
  }
}

let [username, usernameProps] = defineField('username', formConfig())
let [password, passwordProps] = defineField('password', formConfig())
let [roleIds, roleIdsProps] = defineField('roleIds', formConfig())
let [status, statusProps] = defineField('status', formConfig())
let [mobile, mobileProps] = defineField('mobile', formConfig({ max: 15, min: 10 }))
let [description, descriptionProps] = defineField('description', formConfig({ max: 100 }))
let [nickname, nicknameProps] = defineField('nickname', formConfig({ max: 20 }))
let [email, emailProps] = defineField('email', formConfig())
let [whatapps, whatappsProps] = defineField('whatapps', formConfig({ max: 15, min: 10 }))

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
      close()
    })
    .catch(() => {})
}
</script>
