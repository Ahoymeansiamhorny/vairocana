<template>
  <el-dialog v-model="visible" :destroy-on-close="true" :before-close="handleClose" :width="dialogWidth"
    :title="t(`form.action.${drawerProps.title}`, { target: drawerProps.row.name })"
>
    <el-form ref="ruleFormRef" :model="personalForm" :rules="rules" label-width="auto" class="demo-ruleForm"
      :size="formSize" status-icon :disabled="drawerProps.title === 'view'"
>
      <el-form-item label="姓名" prop="name" ref="nameRef">
        <el-input v-model="personalForm.name" :disabled="drawerProps.title === 'edit'" />
      </el-form-item>
      <el-form-item label="性別">
        <el-radio-group v-model="personalForm.gender">
          <el-radio-button label="male">男</el-radio-button>
          <el-radio-button label="female">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日（西元）">
        <el-date-picker v-model="personalForm.birthday" type="date" placeholder="西元年月日" @change="handleDateChange" />
      </el-form-item>
      <el-form-item label="學歷">
        <el-input v-model="personalForm.education" />
      </el-form-item>
      <el-form-item label="專長">
        <el-input v-model="personalForm.expertise" />
      </el-form-item>
      <el-form-item label="職業">
        <el-input v-model="personalForm.occupation" />
      </el-form-item>
      <el-form-item label="中級班上課地點">
        <el-input v-model="personalForm.intermediateClassLocation" />
      </el-form-item>
      <el-form-item label="期別">
        <el-input v-model="personalForm.category" />
      </el-form-item>
      <el-form-item label="籍貫">
        <el-input v-model="personalForm.origin" />
      </el-form-item>
      <el-form-item label="初級班首次上課地點">
        <el-input v-model="personalForm.firstClassLocation" />
      </el-form-item>
      <el-form-item label="手機">
        <el-input v-model="personalForm.mobile" @input="personalForm.mobile=personalForm.mobile.replace(/[^0-9]/g,'')" />
      </el-form-item>
      <el-form-item label="通訊地址">
        <el-input v-model="personalForm.mailingAddress" />
      </el-form-item>
      <el-form-item label="戶籍地址">
        <el-input v-model="personalForm.residenceAddress" />
      </el-form-item>
      <el-form-item label="是否可入">
        <el-radio-group v-model.number="personalForm.entryAllowed">
          <el-radio-button label="2">是</el-radio-button>
          <el-radio-button label="1">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="不可以入原因" v-if="!personalForm.entryAllowed">
        <el-input v-model="personalForm.entryNotAllowedReason" type="textarea" placeholder="請填寫不可入原因" />
      </el-form-item>
      <el-form-item label="家人緊急聯絡人">
        <el-input v-model="personalForm.emergencyContactFamily" />
      </el-form-item>
      <el-form-item label="與家人緊急聯絡人關係">
        <el-input v-model="personalForm.relationshipWithEmergencyContact" />
      </el-form-item>
      <el-form-item label="家人緊急聯絡人電話">
        <el-input v-model="personalForm.emergencyContactFamilyPhone" @input="personalForm.emergencyContactFamilyPhone=personalForm.emergencyContactFamilyPhone.replace(/[^0-9]/g,'')" />
      </el-form-item>
      <el-form-item label="禪友緊急聯絡人（介紹人）">
        <el-input v-model="personalForm.emergencyContactReferrer" />
      </el-form-item>
      <el-form-item label="禪友（介紹人）中級班期別">
        <el-input v-model="personalForm.referrerIntermediateClassSession" />
      </el-form-item>
      <el-form-item label="禪友緊急聯絡人電話">
        <el-input v-model="personalForm.emergencyContactReferrerPhone" @input="personalForm.emergencyContactReferrerPhone=personalForm.emergencyContactReferrerPhone.replace(/[^0-9]/g,'')" />
      </el-form-item>
      <el-form-item label="修行心得">
        <el-input type="textarea" v-model="personalForm.meditationExperience" rows="3" />
      </el-form-item>
      <el-form-item class="center">
        <el-button v-if="drawerProps.title === 'create'" type="primary" style="margin: 0 auto" @click="submitForm">建立</el-button>
        <el-button v-else type="primary" style="margin: 0 auto" @click="editForm">編輯</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { markRaw, ref, computed } from 'vue'
import { ElForm, ElInput, ElDatePicker, ElButton, ElRadioGroup, ElRadioButton, ElMessageBox, ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { IntermediateCreateRequest, IntermediateUpdateRequest } from '@/api/form/form'

const props = defineProps(['visible', 'params'])
const drawerProps = ref(props.params)
const visible = ref(props.visible)
const emit = defineEmits(['update:visible'])
const close = () => emit('update:visible', false)
const { t } = useI18n()
const dialogWidth = computed(() => window.innerWidth < 576 ? '95%' : '65%')
const formSize = ref('default')
const personalForm = ref({
  name: "",  // 姓名
  gender: "",  // 性別
  birthday: "",  // 生日（格式：YYYY-MM-DD）
  education: "",  // 學歷
  expertise: "",  // 專長
  occupation: "",  // 職業
  intermediateClassLocation: "",  // 中級班上課地點
  category: "",  // 期別
  origin: "",  // 籍貫
  firstClassLocation: "",  // 初級班首次上課地點
  mobile: "",  // 手機號碼
  mailingAddress: "",  // 通訊地址
  residenceAddress: "",  // 戶籍地址
  emergencyContactFamily: "",  // 家人緊急聯絡人
  relationshipWithEmergencyContact: "",  // 與家人緊急聯絡人關係
  emergencyContactFamilyPhone: "",  // 家人緊急聯絡人電話
  emergencyContactReferrer: "",  // 禪友緊急聯絡人（介紹人）
  referrerIntermediateClassSession: "",  // 禪友（介紹人）中級班期別
  emergencyContactReferrerPhone: "",  // 禪友緊急聯絡人電話
  meditationExperience: "",  // 修行心得
  entryAllowed: 0,  // 是否可以入
  entryNotAllowedReason: ""  // 不可以入的原因
})
const rules = ref({
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }]
})
if (drawerProps.value.title !== 'create') {

personalForm.value = drawerProps.value.row
}
const ruleFormRef = ref(null)
const nameRef = ref(null)

const handleDateChange = (value) => {
  if (value instanceof Date) {
    value = value.toISOString()
  }
  personalForm.value.birthday = value.split('T')[0]
}

const submitForm = async () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 如果表单数据有效，则执行提交操作
      console.log('Form Data:',  personalForm.value);
      IntermediateCreateRequest(personalForm.value)
        .then(() => {
          const message = `${t(`form.action.${drawerProps.value.title}`, { target: drawerProps.value.row.username })} ${t('common.success')}`;
          ElMessage.success({ message });
          drawerProps.value.getTableList();
          close();
        })
        .catch((e) => e);
    } else {
      // 如果数据无效，滚动到第一个错误字段
      scrollToErrorField(fields);
    }
  });
}

const editForm = async () => {
  console.log('Form Data:', personalForm.value)
  IntermediateUpdateRequest(personalForm.value)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, { target: drawerProps.value.row.username })} ${t('common.success')}`
      ElMessage.success({ message })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => e)
}

const handleClose = () => {
  if (drawerProps.value.title === 'view') {
    return close()
  }
  ElMessageBox.confirm(t('common.dialogDrawerClose'), '', {
    confirmButtonText: 'OK',
    type: 'warning',
    icon: markRaw(WarningFilled),
    center: true
  })
    .then(() => {
      close()
    })
    .catch(() => {})
}

const scrollToErrorField = (fields) => {
  if (fields.name) {
    const element = nameRef.value.$el;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-form-item__content {
  display: flex;
  align-items:center;
}

::v-deep .center .el-form-item__content {
  margin: 0 auto;
}

::v-deep .el-form-item__label-wrap {
  margin-left: 0 !important;
}

::v-deep .el-form-item {
  flex-direction: column;
}

::v-deep .el-date-editor.el-input {
  width: 100%;
}
</style>
