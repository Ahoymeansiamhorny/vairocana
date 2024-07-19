<script setup>
import { markRaw, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { EMAIL, formConfig, MAX, SELECTION, ZOD_LITERAL, ZOD_STRING } from '@/config/validate'
import { toDate } from '@/utils/day'

const { t } = useI18n()

const props = defineProps(['visible', 'params'])

const visible = ref(props.visible)

const dialogProps = ref(props.params)

const emit = defineEmits(['update:visible'])

const close = () => emit('update:visible', false)

const handleClose = () => {
  if (dialogProps.value.title === 'view') {
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

const { defineField, handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      username: ZOD_STRING,
      status: zod.union(
        dialogProps.value.enumMap.get('status').map((i) => ZOD_LITERAL(i.value, SELECTION))
      ),
      remark: ZOD_STRING.max(100, MAX).optional(),
      email: ZOD_STRING.email(EMAIL)
    })
  ),
  initialValues: {
    username: dialogProps.value.row.username,
    status: dialogProps.value.row.status,
    remark: dialogProps.value.row.remark,
    email: dialogProps.value.row.email
  }
})

const reset = () => {
  if (dialogProps.value.title === 'create') {
    resetForm()
  } else {
    setFieldValue('username', dialogProps.value.row.username)
    setFieldValue('status', dialogProps.value.row.status)
    setFieldValue('remark', dialogProps.value.row.remark)
    setFieldValue('email', dialogProps.value.row.email)
  }
}

let [username, usernameProps] = defineField('username', formConfig())
let [status, statusProps] = defineField('status', formConfig())
let [remark, remarkProps] = defineField('remark', formConfig({ max: 100 }))
let [email, emailProps] = defineField('email', formConfig())

const onSubmit = handleSubmit((values) => {
  const param = { id: dialogProps.value.row.id, ...values }
  if (param.id === undefined) {
    delete param.id
  }
  dialogProps.value
    .api(param)
    .then(() => {
      const message = `${t(`form.action.${dialogProps.value.title}`, {
        target: dialogProps.value.row.username
      })} ${t('common.success')}`
      ElMessage.success({ message })
      dialogProps.value.getTableList()
      close()
    })
    .catch((e) => {
      console.log(e)
    })
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :append-to-body="true"
    :before-close="handleClose"
    width="65%"
    :title="t(`form.action.${dialogProps.title}`, { target: dialogProps.row?.username })"
  >
    <el-form
      label-position="left"
      label-width="auto"
      :disabled="dialogProps.isView"
      :hide-required-asterisk="dialogProps.isView"
      @submit="onSubmit"
    >
      <el-form-item :label="t('form.fields.username')" v-bind="usernameProps">
        <el-input class="w-100" v-model="username" readonly />
      </el-form-item>

      <el-form-item :label="t('form.fields.status')" v-bind="statusProps">
        <el-select v-model="status" class="w-100">
          <el-option
            v-for="item in dialogProps.enumMap.get('status')"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.email')" v-bind="emailProps">
        <el-input v-model="email" clearable />
      </el-form-item>

      <el-form-item :label="t('form.fields.remark')" v-bind="remarkProps">
        <el-input class="w-100" v-model="remark" />
      </el-form-item>

      <el-form-item
        v-if="dialogProps.title !== 'create'"
        :label="t('form.fields.createdAt')"
        prop="createdAt"
      >
        <el-input
          v-model="dialogProps.row.createdAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
      </el-form-item>

      <el-form-item v-if="!dialogProps.isView">
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

<style scoped lang="scss"></style>
