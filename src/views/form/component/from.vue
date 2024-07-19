<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="handleClose"
    :width="dialogWidth"
    :title="t(`form.action.${drawerProps.title}`, { target: drawerProps.row.name })"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px; padding: 0 15px; margin: 0 auto"
      :model="personalForm"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
      :disabled="drawerProps.title === 'view'"
    >
      <el-form-item label="姓名">
        <el-input v-model="personalForm.name" />
      </el-form-item>
      <el-form-item label="性別">
        <el-radio-group v-model="personalForm.gender">
          <el-radio-button label="male">男</el-radio-button>
          <el-radio-button label="female">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="personalForm.birthday"
          type="date"
          placeholder="西元年月日"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item label="學歷">
        <el-input v-model="personalForm.education" />
      </el-form-item>
      <el-form-item label="科系">
        <el-input v-model="personalForm.major" />
      </el-form-item>
      <el-form-item label="職業">
        <el-input v-model="personalForm.occupation" />
      </el-form-item>
      <el-form-item label="手機">
        <el-input v-model="personalForm.mobilePhone" />
      </el-form-item>
      <el-form-item label="室內電話">
        <el-input v-model="personalForm.homePhone" />
      </el-form-item>
      <el-form-item label="初級班講堂名稱">
        <el-input v-model="personalForm.seminarName" />
      </el-form-item>
      <el-form-item label="初級班講堂期數">
        <el-input v-model="personalForm.seminarSession" />
      </el-form-item>
      <el-form-item label="家人緊急聯絡人">
        <el-input v-model="personalForm.emergencyContactFamily" />
      </el-form-item>
      <el-form-item label="家人緊急聯絡人手機">
        <el-input v-model="personalForm.emergencyContactFamilyMobile" />
      </el-form-item>
      <el-form-item label="家人緊急聯絡人市內電話（公司或住宅）">
        <el-input v-model="personalForm.emergencyContactFamilyPhone" />
      </el-form-item>
      <el-form-item label="禪友緊急聯絡人（介紹人）">
        <el-input v-model="personalForm.emergencyContactFriend" />
      </el-form-item>
      <el-form-item label="禪友緊急聯絡人室內電話（住家或公司）">
        <el-input v-model="personalForm.emergencyContactFriendPhone" />
      </el-form-item>
      <el-form-item label="禪友緊急聯絡人手機">
        <el-input v-model="personalForm.emergencyContactFriendMobile" />
      </el-form-item>
      <el-form-item label="是否曾參加禪七修行活動">
        <el-radio-group v-model.number="personalForm.attendedZenRetreat">
          <el-radio-button label="2">是</el-radio-button>
          <el-radio-button label="1">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="曾參加禪七修行地點">
        <el-input v-model="personalForm.zenRetreatLocation" />
      </el-form-item>
      <el-form-item label="是否曾參加佛七修行活動">
        <el-radio-group v-model.number="personalForm.attendedBuddhistRetreat">
          <el-radio-button label="2">是</el-radio-button>
          <el-radio-button label="1">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="曾參加佛七修行地點">
        <el-input v-model="personalForm.buddhistEventLocation" />
      </el-form-item>
      <el-form-item label="到課紀錄">
        <el-checkbox-group v-model="personalForm.classRecords">
          <el-checkbox label="1" name="type"> 1 </el-checkbox>
          <el-checkbox label="2" name="type"> 2 </el-checkbox>
          <el-checkbox label="3" name="type"> 3 </el-checkbox>
          <el-checkbox label="4" name="type"> 4 </el-checkbox>
          <el-checkbox label="5" name="type"> 5 </el-checkbox>
          <el-checkbox label="6" name="type"> 6 </el-checkbox>
          <el-checkbox label="7" name="type"> 7 </el-checkbox>
          <el-checkbox label="8" name="type"> 8 </el-checkbox>
          <el-checkbox label="9" name="type"> 9 </el-checkbox>
          <el-checkbox label="10" name="type"> 10 </el-checkbox>
          <el-checkbox label="11" name="type"> 11 </el-checkbox>
          <el-checkbox label="12" name="type"> 12 </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="目前血壓">
        <el-input v-model="personalForm.currentBloodPressure" />
      </el-form-item>
      <el-form-item label="目前狀況勾選">
        <el-checkbox-group v-model="personalForm.currentConditions">
          <el-checkbox label="打呼" name="type"> 打呼 </el-checkbox>
          <el-checkbox label="失眠" name="type"> 失眠 </el-checkbox>
          <el-checkbox label="當週好朋友來" name="type"> 當週好朋友來 </el-checkbox>
          <el-checkbox label="感冒" name="type"> 感冒 </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="目前病痛">
        <el-checkbox-group v-model="personalForm.currentIllnesses">
          <el-checkbox label="心臟病" name="illness">心臟病</el-checkbox>
          <el-checkbox label="心律不整" name="illness">心律不整</el-checkbox>
          <el-checkbox label="糖尿病" name="illness">糖尿病</el-checkbox>
          <el-checkbox label="肝病" name="illness">肝病</el-checkbox>
          <el-checkbox label="腎臟病" name="illness">腎臟病</el-checkbox>
          <el-checkbox label="憂鬱症" name="illness">憂鬱症</el-checkbox>
          <el-checkbox label="躁鬱症" name="illness">躁鬱症</el-checkbox>
          <el-checkbox label="目前有長腫瘤" name="illness">目前有長腫瘤</el-checkbox>
          <el-checkbox label="胃病" name="illness">胃病</el-checkbox>
          <el-checkbox label="胃潰瘍" name="illness">胃潰瘍</el-checkbox>
          <el-checkbox label="甲狀腺異常" name="illness">甲狀腺異常</el-checkbox>
          <el-checkbox label="肺結核" name="illness">肺結核</el-checkbox>
          <el-checkbox label="兩年曾開刀" name="illness">兩年曾開刀</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="以下勾選喜歡吃或是經常吃食品">
        <el-checkbox-group v-model="personalForm.preferredFood">
          <el-checkbox label="米漿" name="food">米漿</el-checkbox>
          <el-checkbox label="山藥" name="food">山藥</el-checkbox>
          <el-checkbox label="龍眼" name="food">龍眼</el-checkbox>
          <el-checkbox label="荔枝" name="food">荔枝</el-checkbox>
          <el-checkbox label="榴槤" name="food">榴槤</el-checkbox>
          <el-checkbox label="酪梨" name="food">酪梨</el-checkbox>
          <el-checkbox label="花生" name="food">花生</el-checkbox>
          <el-checkbox label="各式堅果" name="food">各式堅果</el-checkbox>
          <el-checkbox label="五穀飯" name="food">五穀飯</el-checkbox>
          <el-checkbox label="芝麻" name="food">芝麻</el-checkbox>
          <el-checkbox label="花粉" name="food">花粉</el-checkbox>
          <el-checkbox label="蜂膠" name="food">蜂膠</el-checkbox>
          <el-checkbox label="酵母" name="food">酵母</el-checkbox>
          <el-checkbox label="糙米飯" name="food">糙米飯</el-checkbox>
          <el-checkbox label="紅棗" name="food">紅棗</el-checkbox>
          <el-checkbox label="蛋糕" name="food">蛋糕</el-checkbox>
          <el-checkbox label="巧克力" name="food">巧克力</el-checkbox>
          <el-checkbox label="乳酪" name="food">乳酪</el-checkbox>
          <el-checkbox label="多種穀類" name="food">多種穀類</el-checkbox>
          <el-checkbox label="大豆卵磷脂" name="food">大豆卵磷脂</el-checkbox>
          <el-checkbox label="四物湯" name="food">四物湯</el-checkbox>
          <el-checkbox label="枸杞" name="food">枸杞</el-checkbox>
          <el-checkbox label="當歸" name="food">當歸</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="維他命">
        <el-input v-model="personalForm.vitamin" />
      </el-form-item>
      <el-form-item label="維他命多久吃一次">
        <el-input v-model="personalForm.vitaminFrequency" />
      </el-form-item>
      <el-form-item label="健康食品">
        <el-input v-model="personalForm.healthSupplements" />
      </el-form-item>
      <el-form-item label="健康食品多久多久吃一次">
        <el-input v-model="personalForm.healthSupplementFrequency" />
      </el-form-item>
      <el-form-item label="其他請詳填名稱和食用頻率">
        <el-input v-model="personalForm.otherSupplementsDetail" type="textarea" />
      </el-form-item>
      <el-form-item label="是否服用藥物">
        <el-radio-group v-model.number="personalForm.takingMedication">
          <el-radio-button label="2">是</el-radio-button>
          <el-radio-button label="1">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服用西藥名稱">
        <el-input v-model="personalForm.westernMedicineName" />
      </el-form-item>
      <el-form-item label="服用西藥藥品用途">
        <el-input v-model="personalForm.westernMedicinePurpose" type="textarea" />
      </el-form-item>
      <el-form-item label="服用西藥藥品方法">
        <el-input v-model="personalForm.westernMedicineMethod" type="textarea" />
      </el-form-item>
      <el-form-item label="服用中藥藥品名稱">
        <el-input v-model="personalForm.chineseMedicineName" />
      </el-form-item>
      <el-form-item label="服用中藥藥品用途">
        <el-input v-model="personalForm.chineseMedicinePurpose" type="textarea" />
      </el-form-item>
      <el-form-item label="服用中藥藥品方法">
        <el-input v-model="personalForm.chineseMedicineMethod" type="textarea" />
      </el-form-item>
      <el-form-item class="center">
        <el-button v-if="drawerProps.title === 'create' " type="primary" style="margin: 0 auto" @click="submitForm"> 建立 </el-button>
        <el-button v-else type="primary" style="margin: 0 auto" @click="editForm"> 編輯 </el-button>

        <!-- <el-button @click="resetForm">清除</el-button> -->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { markRaw, ref, computed } from 'vue'
import {
  ElForm,
  ElCheckbox,
  ElInput,
  ElDatePicker,
  ElCheckboxGroup,
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { CreateRequest, UpdateRequest } from '@/api/form/form'
import { WarningFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const props = defineProps(['visible', 'params'])

const drawerProps = ref(props.params)

const visible = ref(props.visible)

const emit = defineEmits(['update:visible'])

const close = () => emit('update:visible', false)

const { t } = useI18n()
const dialogWidth = computed(() => {
  return window.innerWidth < 576 ? '95%' : '65%'
})
console.log(drawerProps.value.row);
const personalForm = ref({
  name: '',
  gender: '',
  birthday: '',
  education: '',
  major: '',
  occupation: '',
  mobilePhone: '',
  homePhone: '',
  seminarName: '',
  seminarSession: '',
  emergencyContactFamily: '',
  emergencyContactFamilyMobile: '',
  emergencyContactFamilyPhone: '',
  emergencyContactFriend: '',
  emergencyContactFriendPhone: '',
  emergencyContactFriendMobile: '',
  attendedZenRetreat: 1,
  zenRetreatLocation: '',
  attendedBuddhistRetreat: 1,
  buddhistEventLocation: '',
  classRecords: [],
  currentBloodPressure: '',
  currentConditions: [],
  currentIllnesses: [],
  preferredFood: [],
  vitamin: '',
  vitaminFrequency: '',
  healthSupplements: '',
  healthSupplementFrequency: '',
  otherSupplementsDetail: '',
  takingMedication: 1,
  westernMedicineName: '',
  westernMedicinePurpose: '',
  westernMedicineMethod: '',
  chineseMedicineName: '',
  chineseMedicinePurpose: '',
  chineseMedicineMethod: ''
})
if (drawerProps.value.title !== 'create') {

personalForm.value = drawerProps.value.row
}

const ruleFormRef = ref(null)
const formSize = ref('default')

const handleDateChange = (value) => {
  if (value instanceof Date) {
    value = value.toISOString()
  }
  const dateOnly = value.split('T')[0]
  personalForm.value.birthday = dateOnly
}

const submitForm = async () => {
  console.log('Form Data:', personalForm)
  CreateRequest(personalForm.value)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, {
        target: drawerProps.value.row.username
      })} ${t('common.success')}`
      ElMessage.success({ message })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => e)
}
const editForm = async () => {
  console.log('Form Data:', personalForm)
  UpdateRequest(personalForm.value)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, {
        target: drawerProps.value.row.username
      })} ${t('common.success')}`
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
</script>

<style scoped lang="scss">
::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
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
