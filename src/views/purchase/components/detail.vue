<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { phoneNumberFormat, priceFormat } from '@/utils/format'
import { numberSoldType, paymentType, purchaseStatus, tunnelType } from '@/utils/dict'
import { toDate } from '@/utils/day'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import {
  formConfig,
  IS_DIGIT,
  IS_DIGIT_REGEXP,
  MAX,
  LENGTH,
  REQUIRED,
  SELECTION,
  UPLOAD,
  ZOD_LITERAL,
  ZOD_STRING,
  EMAIL
} from '@/config/validate'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import { uploadFile } from '@/api/tools/tools'
import { PurchaseCompleted, PurchaseUpdateRegisterDocument } from '@/api/purchase/purchase'

const props = defineProps(['visible', 'params'])

const emit = defineEmits(['update:visible'])

const authStore = useAuthStore()

const readOnly = ref(!authStore.authButtonListGet.includes('purchaseUpdateRegisterDocument'))
const purchaseCompleted = ref(!authStore.authButtonListGet.includes('purchaseCompleted'))

const { t, n } = useI18n()

const visible = ref(props.visible)

const dialogProps = ref(props.params)

const userStore = useUserStore()

const close = () => emit('update:visible', false)

const findLabel = (list, item) => {
  const idx = list.findIndex((x) => x.value === item)
  if (idx === -1) {
    return '-'
  }
  return t(`${list[idx].label}`)
}

const activeName = ref(dialogProps.value.tab)

const displayRule = (displayType, masterId, agentId) => {
  switch (displayType) {
    case 1: // Company Comm
      if (userStore.userInfo.identify === 1) {
        return true
      }
      break
    case 2: // MasterComm OwnerComm
      if (masterId === 0) {
        return false
      }
      if (userStore.userInfo.identify === 1) {
        return true
      } else if (userStore.userInfo.identify === 2 && userStore.userInfo.id === masterId) {
        return true
      }
      break
    case 3: // Agent Comm
      if (agentId === 0) {
        return false
      }
      if (userStore.userInfo.identify === 1) {
        return true
      } else if (userStore.userInfo.identify === 2 && userStore.userInfo.id === masterId) {
        return true
      } else if (userStore.userInfo.identify === 3 && userStore.userInfo.id === agentId) {
        return true
      }
      break
  }
  return false
}

const processingDoc = useForm({
  validationSchema: toTypedSchema(
    zod.object({
      delivery_proof: ZOD_STRING.optional(),
      owner_transfer_proof: ZOD_STRING.min(1, REQUIRED),
      bill_receipt_document: ZOD_STRING.min(1, REQUIRED)
    })
  ),
  initialValues: {
    delivery_proof: dialogProps.value.row?.processing_doc?.delivery_proof || undefined,
    owner_transfer_proof: dialogProps.value.row?.processing_doc?.owner_transfer_proof || undefined,
    bill_receipt_document: dialogProps.value.row?.processing_doc?.bill_receipt_document || undefined
  }
})

const [delivery_proof, delivery_proofProps] = processingDoc.defineField(
  'delivery_proof',
  formConfig()
)
const [owner_transfer_proof, owner_transfer_proofProps] = processingDoc.defineField(
  'owner_transfer_proof',
  formConfig()
)

const [bill_receipt_document, bill_receipt_documentProps] = processingDoc.defineField(
  'bill_receipt_document',
  formConfig()
)

// delivery_proof
// owner_transfer_proof

const { defineField, handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    zod
      .object({
        inv_name: ZOD_STRING.min(1, REQUIRED),
        contract_number: ZOD_STRING.max(15, MAX).regex(new RegExp(IS_DIGIT_REGEXP), IS_DIGIT),
        email: ZOD_STRING.email(EMAIL),
        inv_address: ZOD_STRING.min(1, REQUIRED),
        inv_address2: ZOD_STRING.min(1, REQUIRED),
        inv_postcode: ZOD_STRING.min(1, REQUIRED).length(5, LENGTH),
        inv_state: zod.number(),
        del_follow_inv: zod.number(),
        // .transform((val) => (val ? 1 : 2)),
        del_address: ZOD_STRING.min(1, REQUIRED),
        del_address2: ZOD_STRING.min(1, REQUIRED),
        del_postcode: ZOD_STRING.min(1, REQUIRED).length(5, LENGTH),
        del_state: zod.number(),
        upload_type: zod.preprocess(
          (val) => (val ? Number(val) : null),
          zod.union([ZOD_LITERAL(1, SELECTION), ZOD_LITERAL(2, SELECTION)])
        ),
        ic_front: ZOD_STRING.optional(),
        ic_rear: ZOD_STRING.optional(),
        passport: ZOD_STRING.optional()
      })
      .refine(
        ({ passport, upload_type }) => {
          if (upload_type === 1) {
            return true
          }
          return !!passport
        },
        { message: UPLOAD, path: ['passport'] }
      )
      .refine(
        ({ ic_front, upload_type }) => {
          if (upload_type === 2) {
            return true
          }
          return !!ic_front
        },
        { message: UPLOAD, path: ['ic_front'] }
      )
      .refine(
        ({ ic_rear, upload_type }) => {
          if (upload_type === 2) {
            return true
          }
          return !!ic_rear
        },
        { message: UPLOAD, path: ['ic_rear'] }
      )
  ),
  initialValues: {
    inv_name: dialogProps.value.row?.customer_info?.inv_name || '',
    contract_number: dialogProps.value.row?.customer_info?.contract_number || '',
    email: dialogProps.value.row?.customer_info?.email || '',
    inv_address: dialogProps.value.row?.customer_info?.inv_address || '',
    inv_address2: dialogProps.value.row?.customer_info?.inv_address2 || '',
    inv_postcode: dialogProps.value.row?.customer_info?.inv_postcode || '',
    inv_state: dialogProps.value.row?.customer_info?.inv_state || 1,
    del_follow_inv: dialogProps.value.row?.customer_info?.del_follow_inv || 2,
    del_address: dialogProps.value.row?.customer_info?.del_address || '',
    del_address2: dialogProps.value.row?.customer_info?.del_address2 || '',
    del_postcode: dialogProps.value.row?.customer_info?.del_postcode || '',
    del_state: dialogProps.value.row?.customer_info?.del_state || 1,
    upload_type: dialogProps.value.row?.customer_info?.upload_type || 1,
    ic_front: dialogProps.value.row?.customer_info?.ic_front || undefined,
    ic_rear: dialogProps.value.row?.customer_info?.ic_rear || undefined,
    passport: dialogProps.value.row?.customer_info?.passport || undefined
  }
})

const reset = () => {
  const IF = ic_front.value
  const IR = ic_rear.value
  const PS = passport.value
  resetForm()

  setFieldValue('ic_front', IF)
  setFieldValue('ic_rear', IR)
  setFieldValue('passport', PS)
  initPic()
}

const resetProcessingDoc = () => {
  const DP = delivery_proof.value
  const OTP = owner_transfer_proof.value
  const BRD = bill_receipt_document.value
  processingDoc.resetForm()
  setFieldValue('delivery_proof', DP)
  setFieldValue('owner_transfer_proof', OTP)
  setFieldValue('bill_receipt_document', BRD)
}

const [inv_name, inv_nameProps] = defineField('inv_name', formConfig())
const [contract_number, contract_numberProps] = defineField(
  'contract_number',
  formConfig({ min: 10, max: 11 })
)
const [email, emailProps] = defineField('email', formConfig())
const [inv_address, inv_addressProps] = defineField('inv_address', formConfig())
const [inv_address2, inv_address2Props] = defineField('inv_address2', formConfig())
const [inv_postcode, inv_postcodeProps] = defineField('inv_postcode', formConfig({ length: 5 }))
const [inv_state, inv_stateProps] = defineField('inv_state', formConfig())
const [del_follow_inv, del_follow_invProps] = defineField('del_follow_inv', formConfig())
const [del_address, del_addressProps] = defineField('del_address', formConfig())
const [del_address2, del_address2Props] = defineField('del_address2', formConfig())
const [del_postcode, del_postcodeProps] = defineField('del_postcode', formConfig({ length: 5 }))
const [del_state, del_stateProps] = defineField('del_state', formConfig())
const [upload_type, upload_typeProps] = defineField('upload_type', formConfig())
const [ic_front, ic_frontProps] = defineField('ic_front', formConfig())
const [ic_rear, ic_rearProps] = defineField('ic_rear', formConfig())
const [passport, passportProps] = defineField('passport', formConfig())

const onSubmit = handleSubmit((values) => {
  values.order_id = dialogProps.value.row.purchase.order_id
  PurchaseUpdateRegisterDocument(values).then(() => {
    const message = `${t(`form.action.confirm`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
})

const processingDocOnSubmit = processingDoc.handleSubmit((values) => {
  values.order_id = dialogProps.value.row.purchase.order_id

  // console.log(values)

  PurchaseCompleted(values).then(() => {
    const message = `${t(`form.action.confirm`, {
      target: dialogProps.value.row.purchase.order_id
    })} ${t('common.success')}`
    ElMessage.success({ message })
    dialogProps.value.getTableList()
    close()
  })
})

watch(del_follow_inv, (n) => {
  if (n === 1) {
    setFieldValue('del_address', inv_address.value)
    setFieldValue('del_address2', inv_address2.value)
    setFieldValue('del_postcode', inv_postcode.value)
    setFieldValue('del_state', inv_state.value)
  }
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const fileListDev = ref([])
const handleRemoveDev = (file, files) => {
  fileListDev.value = files
}

const fileListOwner = ref([])
const handleRemoveOwner = (file, files) => {
  fileListOwner.value = files
}

const fileListBillReceipt = ref([])
const handleRemoveBillReceipt = (file, files) => {
  fileListBillReceipt.value = files
}

const fileListIcFront = ref([])
const handleRemoveFront = (file, files) => {
  fileListIcFront.value = files
}

const fileListIcRear = ref([])
const handleRemoveRear = (file, files) => {
  fileListIcRear.value = files
}

const fileListPassport = ref([])
const handleRemovePassport = (file, files) => {
  fileListPassport.value = files
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.error(
    `The limit is 1, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const initPic = () => {
  if (upload_type.value === 1) {
    if (ic_front.value) {
      fileListIcFront.value = [
        {
          name: 'ic_front',
          url: `${dialogProps.value.row?.customer_info?.media_path}${ic_front.value}`
        }
      ]
    }
    if (ic_rear.value) {
      fileListIcRear.value = [
        {
          name: 'ic_rear',
          url: `${dialogProps.value.row?.customer_info?.media_path}${ic_rear.value}`
        }
      ]
    }
  } else if (upload_type.value === 2 && passport.value) {
    fileListPassport.value = [
      {
        name: 'passport',
        url: `${dialogProps.value.row?.customer_info?.media_path}${passport.value}`
      }
    ]
  }
}
const initProcessingPic = () => {
  if (delivery_proof.value) {
    fileListDev.value = [
      {
        name: 'delivery_proof',
        url: `${dialogProps.value.row?.processing_doc?.media_path}${delivery_proof.value}`
      }
    ]
  }
  if (owner_transfer_proof.value) {
    fileListOwner.value = [
      {
        name: 'owner_transfer_proof',
        url: `${dialogProps.value.row?.processing_doc?.media_path}${owner_transfer_proof.value}`
      }
    ]
  }
  if (bill_receipt_document.value) {
    fileListBillReceipt.value = [
      {
        name: 'bill_receipt_document',
        url: `${dialogProps.value.row?.processing_doc?.media_path}${bill_receipt_document.value}`
      }
    ]
  }
}

initPic()
initProcessingPic()

const handleUploadDev = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    processingDoc.setFieldValue('delivery_proof', media)
  })
}

const handleUploadOwner = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    processingDoc.setFieldValue('owner_transfer_proof', media)
  })
}

const handleUploadBillReceipt = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    processingDoc.setFieldValue('bill_receipt_document', media)
  })
}

const handleUploadFront = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    setFieldValue('ic_front', media)
  })
}

const handleUploadRear = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    setFieldValue('ic_rear', media)
  })
}

const handleUploadPassport = (file) => {
  const formBody = new FormData()
  formBody.append('file', file.file)
  uploadFile(formBody).then((response) => {
    const { media } = response
    setFieldValue('passport', media)
  })
}

const purchasesInformation = reactive([
  {
    label: t('form.fields.order_id'),
    value: dialogProps.value.row.purchase.order_id
  },
  {
    label: t('form.fields.number'),
    value: phoneNumberFormat(dialogProps.value.row.purchase.number)
  },
  {
    label: t('form.fields.soldType'),
    value: findLabel(numberSoldType(), dialogProps.value.row.purchase.sold_type)
  },
  {
    label: t('form.fields.tunnel_id'),
    value: findLabel(tunnelType(), dialogProps.value.row.purchase.tunnel_id)
  },
  {
    label: t('form.fields.transactionAmount'),
    value: priceFormat(n, dialogProps.value.row.purchase.amount)
  },
  {
    label: t('form.fields.price'),
    value: priceFormat(n, dialogProps.value.row.purchase.price)
  },
  {
    label: t('form.fields.payment_type'),
    value: findLabel(paymentType(), dialogProps.value.row.purchase.payment_type)
  },
  {
    label: t('form.fields.status'),
    value: findLabel(purchaseStatus(), dialogProps.value.row.purchase.status)
  },
  {
    label: t('form.fields.createdAt'),
    value: toDate(dialogProps.value.row.purchase.created_at)
  },
  {
    label: t('form.fields.settleAt'),
    value: toDate(dialogProps.value.row.purchase.settle_at)
  }
])
</script>

<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="close"
    width="65%"
    :title="dialogProps.row.purchase.order_id"
  >
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane :label="t('common.PurchasesInformation')" name="first">
        <el-descriptions class="margin-top" :column="3" size="large" border>
          <el-descriptions-item v-for="(item, key) in purchasesInformation" :key="key">
            <template #label>
              <div class="cell-item">
                {{ item.label }}
              </div>
            </template>
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="mt20" :column="2" size="large" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.member') }}
              </div>
            </template>
            {{ dialogProps.row.purchase.member_account }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.member_mobile') }}
              </div>
            </template>
            {{ dialogProps.row.purchase.member_mobile }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="mt20" :column="3" size="large" border>
          <el-descriptions-item v-if="displayRule(2, dialogProps.row.purchase.owner_id, null)">
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.owner') }}
              </div>
            </template>
            {{ dialogProps.row.purchase.owner }}
          </el-descriptions-item>
          <el-descriptions-item v-if="displayRule(2, dialogProps.row.purchase.owner_id, null)">
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.owner_cost') }}
              </div>
            </template>
            {{ priceFormat(n, dialogProps.row.purchase.cost) }}
          </el-descriptions-item>
          <el-descriptions-item v-if="displayRule(1, null, null)">
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.company_comm') }}
              </div>
            </template>
            {{ priceFormat(n, dialogProps.row.purchase.company_comm) }} ({{
              dialogProps.row.purchase.company_comm_rate
            }}
            %)
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="mt20" :column="3" size="large" border>
          <el-descriptions-item v-if="displayRule(2, dialogProps.row.purchase.master_id, null)">
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.master') }}
              </div>
            </template>
            {{ dialogProps.row.purchase.master }}
          </el-descriptions-item>
          <el-descriptions-item v-if="displayRule(2, dialogProps.row.purchase.master_id, null)">
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.master_comm') }}
              </div>
            </template>
            {{ priceFormat(n, dialogProps.row.purchase.master_comm) }} ({{
              dialogProps.row.purchase.master_comm_rate
            }}
            %)
          </el-descriptions-item>
          <el-descriptions-item
            v-if="
              displayRule(3, dialogProps.row.purchase.master_id, dialogProps.row.purchase.agent_id)
            "
          >
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.agent') }}
              </div>
            </template>
            {{ dialogProps.row.purchase.agent }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="
              displayRule(3, dialogProps.row.purchase.master_id, dialogProps.row.purchase.agent_id)
            "
          >
            <template #label>
              <div class="cell-item">
                {{ t('form.fields.agent_comm') }}
              </div>
            </template>
            {{ priceFormat(n, dialogProps.row.purchase.agent_comm) }} ({{
              dialogProps.row.purchase.agent_comm_rate
            }}
            %)
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane
        v-if="dialogProps.row.purchase.payment_type !== 2"
        :label="t('common.CustomerInformation')"
        name="second"
      >
        <el-form
          :disabled="readOnly"
          label-position="left"
          label-width="150px"
          :hide-required-asterisk="readOnly"
          @submit="onSubmit"
        >
          <el-form-item :label="t('form.fields.inv_name')" v-bind="inv_nameProps">
            <el-input v-model="inv_name" />
          </el-form-item>

          <el-form-item :label="t('form.fields.contract_number')" v-bind="contract_numberProps">
            <el-input v-model.trim="contract_number" />
          </el-form-item>

          <el-form-item :label="t('form.fields.email')" v-bind="emailProps">
            <el-input v-model.trim="email" />
          </el-form-item>

          <el-form-item :label="t('form.fields.inv_address')" v-bind="inv_addressProps">
            <el-input v-model.trim="inv_address" />
          </el-form-item>

          <el-form-item :label="t('form.fields.inv_address2')" v-bind="inv_address2Props">
            <el-input v-model.trim="inv_address2" />
          </el-form-item>

          <el-form-item :label="t('form.fields.inv_postcode')" v-bind="inv_postcodeProps">
            <el-input v-model.trim="inv_postcode" />
          </el-form-item>

          <el-form-item :label="t('form.fields.inv_state')" v-bind="inv_stateProps">
            <el-select v-model="inv_state" class="w-100">
              <el-option
                v-for="item in dialogProps.enumMap.get('state')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('form.fields.del_follow_inv')" v-bind="del_follow_invProps">
            <el-checkbox v-model="del_follow_inv" :true-label="1" :false-label="2" size="large" />
          </el-form-item>

          <el-form-item :label="t('form.fields.del_address')" v-bind="del_addressProps">
            <el-input v-model.trim="del_address" />
          </el-form-item>

          <el-form-item :label="t('form.fields.del_address2')" v-bind="del_address2Props">
            <el-input v-model.trim="del_address2" />
          </el-form-item>

          <el-form-item :label="t('form.fields.del_postcode')" v-bind="del_postcodeProps">
            <el-input v-model.trim="del_postcode" />
          </el-form-item>

          <el-form-item :label="t('form.fields.del_state')" v-bind="del_stateProps">
            <el-select v-model="del_state" class="w-100">
              <el-option
                v-for="item in dialogProps.enumMap.get('state')"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('form.fields.upload_type')" v-bind="upload_typeProps">
            <el-radio-group v-model="upload_type">
              <el-radio-button
                v-for="item in dialogProps.enumMap.get('memberDoc')"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="upload_type === 1"
            :label="t('form.fields.ic_front')"
            v-bind="ic_frontProps"
          >
            <el-upload
              :http-request="handleUploadFront"
              :disabled="readOnly"
              list-type="picture-card"
              v-model:file-list="fileListIcFront"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveFront"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item
            v-if="upload_type === 1"
            :label="t('form.fields.ic_rear')"
            v-bind="ic_rearProps"
          >
            <el-upload
              :http-request="handleUploadRear"
              :disabled="readOnly"
              v-model:file-list="fileListIcRear"
              list-type="picture-card"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveRear"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item
            :label="t('form.fields.passport')"
            v-bind="passportProps"
            v-if="upload_type === 2"
          >
            <el-upload
              :http-request="handleUploadPassport"
              :disabled="readOnly"
              v-model:file-list="fileListPassport"
              list-type="picture-card"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemovePassport"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="[2].includes(dialogProps.row.purchase.status)"
              native-type="button"
              @click="reset"
              >{{ t('form.button.reset') }}
            </el-button>
            <el-button
              v-if="!readOnly && [2].includes(dialogProps.row.purchase.status)"
              type="primary"
              native-type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ t('form.button.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-if="dialogProps.row.customer_info"
        :label="t('common.ProcessingDocument')"
        name="third"
      >
        <el-form
          :disabled="purchaseCompleted"
          label-position="left"
          label-width="150px"
          :hide-required-asterisk="purchaseCompleted"
          @submit="processingDocOnSubmit"
        >
          <el-form-item
            :label="t('form.fields.owner_transfer_proof')"
            v-bind="owner_transfer_proofProps"
          >
            <el-upload
              :http-request="handleUploadOwner"
              :disabled="readOnly"
              list-type="picture-card"
              v-model:file-list="fileListOwner"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveOwner"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item
            :label="t('form.fields.bill_receipt_document')"
            v-bind="bill_receipt_documentProps"
          >
            <el-upload
              :http-request="handleUploadBillReceipt"
              :disabled="readOnly"
              list-type="picture-card"
              v-model:file-list="fileListBillReceipt"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveBillReceipt"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item :label="t('form.fields.delivery_proof')" v-bind="delivery_proofProps">
            <el-upload
              :http-request="handleUploadDev"
              :disabled="readOnly"
              list-type="picture-card"
              v-model:file-list="fileListDev"
              :limit="1"
              :on-exceed="handleExceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveDev"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="[2].includes(dialogProps.row.purchase.status)"
              native-type="button"
              @click="resetProcessingDoc"
              >{{ t('form.button.reset') }}
            </el-button>
            <el-button
              v-if="!readOnly && [2].includes(dialogProps.row.purchase.status)"
              v-auth="['purchaseCompleted']"
              type="primary"
              native-type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ t('form.button.confirm') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible">
      <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
