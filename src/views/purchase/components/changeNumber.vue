<script setup>
import { reactive, ref } from 'vue'
import { PurchaseChangeNumberRequest } from '@/api/purchase/purchase'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps(['visible', 'params'])

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)

const dialogProps = ref(props.params)

const { t } = useI18n()

// Form data as a reactive object
const dialogInfo = reactive({
  new_phone_id: null,
  new_phone_number: ''
})

// const new_phone_id = ref(null)
// const new_phone_number = ref('')

// console.log(dialogProps.value.row)

const close = () => emit('update:visible', false)

const changeNumber = (row) => {
  const params = {
    order_id: row.order_id,
    // new_phone_id: new_phone_id.value,
    // new_phone_number: new_phone_number.value
    new_phone_id: dialogInfo.new_phone_id,
    new_phone_number: dialogInfo.new_phone_number
  }
  PurchaseChangeNumberRequest(params).then(() => {
    // console.log(res, '<<<< res')
    const message = `${t(`form.action.confirm`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
}

const title =
  t('form.titles.changeNumberConfirmation') + ' - ' + dialogProps.value.row.purchase.order_id
</script>

<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="close"
    width="35%"
    style="max-width: 480px"
    :close-on-click-modal="false"
    :title="title"
  >
    <el-form label-position="left" label-width="auto">
      <el-form-item :label="t('form.fields.number')">
        <el-input v-model="dialogProps.row.purchase.number" disabled />
      </el-form-item>

      <el-form-item :label="t('form.fields.new_product_id')">
        <el-input v-model.number="dialogInfo.new_phone_id" />
      </el-form-item>

      <el-form-item :label="t('form.fields.new_number')">
        <el-input v-model="dialogInfo.new_phone_number" />
      </el-form-item>

      <p class="warning-text">{{ $t('form.titles.changeNumberReminder') }}</p>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-auth="['purchaseChangeNumber']"
          type="primary"
          @click="changeNumber(dialogProps.row.purchase)"
        >
          {{ t('form.action.changeNumber') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
.warning-text {
  margin-top: 10px;
  font-weight: bold;
  color: red;
}
</style>
