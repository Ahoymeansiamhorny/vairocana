<script setup>
import { ref } from 'vue'
import { PurchaseCompleted } from '@/api/purchase/purchase'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps(['visible', 'params'])

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)

const dialogProps = ref(props.params)

const { t, n } = useI18n()

import { priceFormat } from '@/utils/format'
import { toDate } from '@/utils/day'

const dialogInfo = {
  amount: priceFormat(n, dialogProps.value.row.purchase.amount),
  createdAt: toDate(dialogProps.value.row.purchase.created_at)
}

const close = () => emit('update:visible', false)

const completeOrder = (row) => {
  PurchaseCompleted({ order_id: row.order_id }).then(() => {
    const message = `${t(`form.action.completed`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
}

const title = t('form.titles.completed') + ' ' + dialogProps.value.row.purchase.order_id
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
    <el-form label-position="left" label-width="auto" disabled>
      <el-form-item :label="t('form.fields.number')">
        <el-input v-model="dialogProps.row.purchase.number" />
      </el-form-item>

      <el-form-item :label="t('form.fields.transactionAmount')">
        <el-input v-model="dialogInfo.amount" />
      </el-form-item>

      <el-form-item :label="t('form.fields.createdAt')">
        <el-input v-model="dialogInfo.createdAt" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-auth="['purchaseCompleted']"
          type="primary"
          @click="completeOrder(dialogProps.row.purchase)"
        >
          {{ t('form.action.completed') }}
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
</style>
