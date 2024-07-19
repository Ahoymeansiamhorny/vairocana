<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('header.personalData')"
    width="500px"
    draggable
    :before-close="handleClose"
  >
    <el-form label-position="left" label-width="auto">
      <el-form-item :label="t('form.fields.username')">
        <el-input v-model="userStore.userInfo.userName" disabled />
      </el-form-item>

      <el-form-item :label="t('form.fields.nickname')">
        <el-input v-model="userStore.userInfo.nickname" disabled />
      </el-form-item>

      <el-form-item :label="t('form.fields.mobile')" v-bind="mobileProps">
        <el-input v-model="mobile" />
      </el-form-item>

      <el-form-item :label="t('form.fields.whatapps')" v-bind="whatappsProps">
        <el-input v-model="whatapps" />
      </el-form-item>

      <el-form-item :label="t('form.fields.email')" v-bind="emailProps">
        <el-input v-model="email" />
      </el-form-item>

      <div class="flx-center">
        <el-button
          type="primary"
          @click="onSubmit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          native-type="submit"
          >{{ t('form.button.submit') }}
        </el-button>

        <el-button @click="closeDialog" native-type="button">{{
          t('form.button.cancel')
        }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import * as zod from 'zod'
import { EMAIL, formConfig, IS_DIGIT, IS_DIGIT_REGEXP, MAX, ZOD_STRING } from '@/config/validate'
import { useForm } from 'vee-validate'
import { UserInfoUpdateRequest } from '@/api/auth/auth'

const userStore = useUserStore()
const { t } = useI18n()

const max = 15

const schema = zod.object({
  mobile: ZOD_STRING.max(max, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
  whatapps: ZOD_STRING.max(max, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
  email: ZOD_STRING.email(EMAIL)
})

const { defineField, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {}
})

const [mobile, mobileProps] = defineField('mobile', formConfig({ max }))
const [whatapps, whatappsProps] = defineField('whatapps', formConfig({ max }))
const [email, emailProps] = defineField('email', formConfig())

const onSubmit = handleSubmit((values) => {
  // console.log(values)

  UserInfoUpdateRequest(values)
    .then(() => {
      userStore.getUserInfo().then(() => {
        const message = `${t(`form.action.edit`)} ${t('common.success')}`
        ElMessage.success({ message })
        closeDialog()
      })
    })
    .catch((e) => e)
})

const dialogVisible = ref(false)

const rf = () => {
  resetForm({
    values: {
      mobile: userStore.userInfo.mobile || '',
      whatapps: userStore.userInfo.whatapps || '',
      email: userStore.userInfo.email || ''
    }
  })
}
const openDialog = () => {
  rf()
  dialogVisible.value = true
}

const closeDialog = () => {
  rf()
  dialogVisible.value = false
}

const handleClose = (done) => {
  resetForm()
  done()
}

defineExpose({ openDialog })
</script>
