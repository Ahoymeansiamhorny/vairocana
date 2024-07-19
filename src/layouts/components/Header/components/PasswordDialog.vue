<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('header.changePassword')"
    width="700px"
    draggable
    :before-close="handleClose"
  >
    <el-form label-position="left" label-width="auto">
      <el-form-item class="mb30" :label="t('form.fields.password')" v-bind="passwordProps">
        <el-input v-model="password" />
      </el-form-item>

      <el-form-item class="mb30" :label="t('form.fields.newPassword')" v-bind="newPasswordProps">
        <el-input v-model="newPassword" />
      </el-form-item>

      <el-form-item
        class="mb30"
        :label="t('form.fields.confirmPassword')"
        v-bind="confirmPasswordProps"
      >
        <el-input v-model="confirmPassword" />
      </el-form-item>

      <div class="flx-center">
        <el-button :disabled="isSubmitting" type="primary" @click="onSubmit">{{
          t('form.button.submit')
        }}</el-button>
        <el-button @click="closeDialog">{{ t('form.button.cancel') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { LOGIN_URL } from '@/config'
import * as zod from 'zod'
import {
  CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME,
  PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME,
  PASSWORD_REGEXP,
  PASSWORD_RULE,
  formConfig,
  ZOD_STRING
} from '@/config/validate'
import { useForm } from 'vee-validate'
import { ChangePasswordRequest } from '@/api/auth/auth'

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

const dialogVisible = ref(false)
const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  resetForm()
  dialogVisible.value = false
}

const same = ({ newPassword, password }) => newPassword !== password

const schema = zod
  .object({
    password: ZOD_STRING.regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE),
    newPassword: ZOD_STRING.regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE),
    confirmPassword: ZOD_STRING.regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE)
  })
  .refine(same, {
    message: PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME,
    path: ['password']
  })
  .refine(same, {
    message: PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME,
    path: ['newPassword']
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME,
    path: ['newPassword']
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME,
    path: ['confirmPassword']
  })

const { defineField, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    password: '',
    newPassword: '',
    confirmPassword: ''
  }
})

const handleClose = (done) => {
  resetForm()
  done()
}

const [password, passwordProps] = defineField('password', formConfig())
const [newPassword, newPasswordProps] = defineField('newPassword', formConfig())
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', formConfig())

const onSubmit = handleSubmit((values) => {
  // console.log(values)
  ChangePasswordRequest(values)
    .then(async () => {
      ElMessage.success({ message: t('common.resetPassword') })
      userStore.reset()
      await router.replace(LOGIN_URL) // 3.重定向到登陆页
    })
    .catch((e) => e)
})

defineExpose({ openDialog })
</script>
