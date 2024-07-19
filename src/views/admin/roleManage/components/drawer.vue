<template>
  <el-dialog
    v-model="visible"
    :destroy-on-close="true"
    :before-close="handleClose"
    width="65%"
    :title="t(`form.action.${drawerProps.title}`, { target: drawerProps.row.username })"
  >
    <el-form
      label-position="left"
      label-width="auto"
      :disabled="drawerProps.isView"
      @submit="onSubmit"
    >
      <el-form-item :label="t('form.fields.identify')" v-bind="assignProps">
        <el-select v-model="assign">
          <el-option
            v-for="item in drawerProps.enumMap
              .get('assign')
              .filter((i) => i.value >= userStore.userInfo.identify)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('form.fields.name')" v-bind="nameProps">
        <el-input v-model="name" />
      </el-form-item>

      <el-form-item :label="t('form.fields.description')" v-bind="descriptionProps">
        <el-input v-model="description" />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title === 'view'"
        :label="t('form.fields.creator')"
        prop="creator"
      >
        <el-input v-model="drawerProps.row.creator" />
      </el-form-item>

      <el-form-item :label="t('form.fields.permission')" v-bind="permissionProps">
        <el-tree
          ref="treeRef"
          :data="tree"
          show-checkbox
          :default-checked-keys="permission"
          node-key="id"
          @check="currentChange"
          default-expand-all
          :props="{
            children: 'children',
            label: 'label'
          }"
        />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'create'"
        :label="t('form.fields.createdAt')"
        prop="createdAt"
      >
        <el-input
          v-model="drawerProps.row.createdAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
      </el-form-item>

      <el-form-item
        v-if="drawerProps.title !== 'create'"
        :label="t('form.fields.modifiedAt')"
        prop="modifiedAt"
      >
        <el-input
          v-model="drawerProps.row.modifiedAt"
          :formatter="toDate"
          :parser="toDate"
          disabled
        />
      </el-form-item>

      <el-form-item v-if="!drawerProps.isView">
        <el-button @click="reset" native-type="button">{{ t('form.button.reset') }}</el-button>
        <el-button
          type="primary"
          native-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          >{{ t('form.button.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup name="roleDrawer">
import { markRaw, ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toDate } from '@/utils/day'
import { useI18n } from 'vue-i18n'
import { WarningFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useUserStore } from '@/stores/modules/user'
import * as zod from 'zod'
import { formConfig, MAX, REQUIRED, ZOD_NUMBER, ZOD_STRING } from '@/config/validate'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps(['visible', 'params'])
const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)
const drawerProps = ref(props.params)

const close = () => emit('update:visible', false)

const userStore = useUserStore()

const authStore = useAuthStore()

const { t } = useI18n()

const treeRef = ref()

const p = drawerProps.value.row?.permission || [1]

nextTick(() => {
  treeRef.value.setCheckedKeys(p, false)
})

const tree = computed(() => {
  const x = []
  for (const i of authStore.authMenuList) {
    x.push(walkTree(i, {}))
  }
  return x
})

function currentChange() {
  if (!selected.value.includes(1)) {
    treeRef.value.setCheckedKeys([1, ...selected.value], false)
  }
  permission.value = selected.value
}

const selected = computed(() =>
  treeRef.value.getCheckedKeys(false).filter((i) => Number.isInteger(i))
)

const schema = zod.object({
  assign: ZOD_NUMBER.positive(REQUIRED),
  name: ZOD_STRING.max(20, MAX),
  description: ZOD_STRING.max(100, MAX).optional(),
  permission: ZOD_NUMBER.array()
})

const { defineField, handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    assign: drawerProps.value.row.assign,
    name: drawerProps.value.row.name,
    permission: drawerProps.value.title !== 'create' ? drawerProps.value.row?.permission : [1],
    description: drawerProps.value.row.description
  }
})

const reset = () => {
  if (drawerProps.value.title === 'create') {
    resetForm()
  } else {
    setFieldValue('description', drawerProps.value.row.description)
    setFieldValue('name', drawerProps.value.row.name)
    setFieldValue('assign', drawerProps.value.row.assign)
    setFieldValue('permission', drawerProps.value.row.permission)
  }
}

let [assign, assignProps] = defineField('assign', formConfig())
let [name, nameProps] = defineField('name', formConfig({ max: 20 }))
let [permission, permissionProps] = defineField('permission', formConfig())
let [description, descriptionProps] = defineField('description', formConfig({ max: 100 }))

const onSubmit = handleSubmit((values) => {
  const param = { id: drawerProps.value.row.id, ...values }
  if (param.id === undefined) {
    delete param.id
  }
  drawerProps.value
    .api(param)
    .then(() => {
      const message = `${t(`form.action.${drawerProps.value.title}`, {
        target: drawerProps.value.row.name
      })} ${t('common.success')}`
      ElMessage.success({ message })
      drawerProps.value.getTableList()
      close()
    })
    .catch((e) => {
      console.log(e)
    })
})

const handleClose = () => {
  if (drawerProps.value.title === 'view') {
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

const walkTree = (tree, target) => {
  target.label = t(`menu.${tree.name}`)
  target.children = []
  if (tree.children && tree.children.length > 0) {
    for (const i of tree.children) {
      target.children.push(walkTree(i, {}))
    }
  } else {
    if (Array.isArray(tree?.meta?.permission)) {
      for (const i of tree.meta.permission) {
        const item = drawerProps.value.enumMap.get('permission').find((o) => o.label === i)
        if (item) {
          target.children.push({
            id: item.value,
            label: t(`permission.${item.label}`) //item.label + '==='
          })
        }
      }
    }
  }
  return target
}
</script>
