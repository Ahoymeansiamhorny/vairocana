<script setup>
import { ref } from 'vue'
import { PurchaseCancelRequest, PurchaseConfirmRequest } from '@/api/purchase/purchase'
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

const confirmOrder = (row) => {
  PurchaseConfirmRequest({ order_id: row.order_id }).then(() => {
    const message = `${t(`form.action.confirm`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
}

const cancelOrder = (row) => {
  PurchaseCancelRequest({ order_id: row.order_id }).then(() => {
    const message = `${t(`form.action.reject`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
}

const title = t('form.titles.confirmCancel') + ' ' + dialogProps.value.row.purchase.order_id
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
    <el-image
      style="width: 100%"
      :src="dialogProps.row.purchase.upload_doc"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="[dialogProps.row.purchase.upload_doc]"
      :initial-index="4"
      fit="cover"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-auth="['purchaseConfirm']"
          type="primary"
          @click="confirmOrder(dialogProps.row.purchase)"
        >
          {{ t('form.action.confirm') }}
        </el-button>

        <el-button
          v-auth="['purchaseCancel']"
          type="danger"
          @click="cancelOrder(dialogProps.row.purchase)"
        >
          {{ t('form.action.reject') }}
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
