<script setup>
import { ref } from 'vue'
import { Money } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { toDate } from '@/utils/day'

const { t } = useI18n()

const props = defineProps(['visible', 'params'])

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)

const dialogProps = ref(props.params)

// console.log(dialogProps.value.row)
const detail = dialogProps.value.row.json !== '' ? JSON.parse(dialogProps.value.row.json) : null
// console.log(detail)

const close = () => emit('update:visible', false)

console.log(detail)
</script>

<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :before-close="close" width="65%">
    <el-descriptions
      class="margin-top"
      :title="dialogProps.row.reference_id + ' (' + dialogProps.row.order_id + ')'"
      v-if="dialogProps.row.json !== ''"
      :column="0"
      size="large"
      border
    >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8">
              <money />
            </el-icon>
            {{ t('form.fields.transactionAmount') }}
          </div>
        </template>
        {{ detail.currency }} {{ (detail.amount / 100).toFixed(2) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8">
              <money />
            </el-icon>
            {{ t('form.fields.date') }}
          </div>
        </template>
        {{ toDate(detail.created_at) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8"> </el-icon>
            {{ t('form.fields.status') }}
          </div>
        </template>
        {{ t(`curlec.status.${detail.status}`) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8"> </el-icon>
            {{ t('form.fields.description') }}
          </div>
        </template>
        {{ detail.description }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8">
              <user />
            </el-icon>
            {{ t('form.fields.customerName') }}
          </div>
        </template>
        {{ detail.customer.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8">
              <iphone />
            </el-icon>
            {{ t('form.fields.contact') }}
          </div>
        </template>
        {{ detail.customer.contact }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8"> </el-icon>
            Email
          </div>
        </template>
        {{ detail.customer.email }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detail.payments != null && detail.payments.length > 0">
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8"> </el-icon>
            {{ t('form.fields.payment_method') }}
          </div>
        </template>
        {{ t(`curlec.method.${detail.payments[0].method}`) }}
      </el-descriptions-item>
      <el-descriptions-item v-if="detail.payments != null && detail.payments.length > 0">
        <template #label>
          <div class="cell-item">
            <el-icon class="mr8"> </el-icon>
            {{ t('form.fields.payment_id') }}
          </div>
        </template>
        {{ detail.payments[0].payment_id }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
