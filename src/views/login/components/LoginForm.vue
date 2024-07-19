<template>
  <el-form ref="loginFormRef" @submit="onSubmit" @reset="resetForm()" size="large">
    <el-form-item v-bind="usernameProps">
      <el-input v-model="username" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-bind="passwordProps">
      <el-input
        v-model="password"
        type="password"
        placeholder="密码：123456"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <div class="login-btn">
        <el-button :icon="CircleClose" round size="large" @click="resetForm" native-type="button">
          重置
        </el-button>
        <el-button
          :icon="UserFilled"
          round
          size="large"
          type="primary"
          native-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          登录
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { HOME_URL } from '@/config'
import { getTimeState } from '@/utils'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useTabsStore } from '@/stores/modules/tabs'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import {
  PASSWORD_RULE,
  ACCOUNT_RULE,
  formConfig,
  PASSWORD_ACCOUNT_CANNOT_BE_SAME,
  USERNAME_REGEXP,
  PASSWORD_REGEXP
} from '@/config/validate/index.js'
import * as zod from 'zod'
import { LoginRequest } from '@/api/auth/auth'

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

const refineRule = ({ username, password }) => username !== password
const schema = zod
  .object({
    username: zod.string().regex(new RegExp(USERNAME_REGEXP), ACCOUNT_RULE),
    password: zod.string().regex(new RegExp(PASSWORD_REGEXP), PASSWORD_RULE)
  })
  .refine(refineRule, { message: PASSWORD_ACCOUNT_CANNOT_BE_SAME, path: ['username'] })
  .refine(refineRule, { message: PASSWORD_ACCOUNT_CANNOT_BE_SAME, path: ['password'] })

const { defineField, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    // username: 'admin001',
    // password: 'Abcd1234'
  }
})

const [username, usernameProps] = defineField('username', formConfig())
const [password, passwordProps] = defineField('password', formConfig())

const onSubmit = handleSubmit((values) => {
  console.log(values)
  LoginRequest(values)
    .then((data) => {
      const { access_token, refresh_token } = data

      userStore.setRefreshToken(refresh_token)
      userStore.setToken(access_token)

      // 2.添加动态路由
      initDynamicRouter().then(() => {
        tabsStore.setTabs([])
        keepAliveStore.setKeepAliveName([])
        ElNotification({
          title: getTimeState(),
          message: 'Welcome',
          type: 'success',
          duration: 3000
        })
        router.push(HOME_URL)
      })
    })
    .catch((e) => {
      console.log(e)
    })
})
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
