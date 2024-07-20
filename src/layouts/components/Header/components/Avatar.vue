<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <!-- <img src="@/assets/images/new_avatar.png" alt="avatar" /> -->
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>{{ $t('header.personalData') }}
        </el-dropdown-item>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>{{ $t('header.changePassword') }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup>
import { ref } from 'vue'
import { LOGIN_URL } from '@/config'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import InfoDialog from './InfoDialog.vue'
import PasswordDialog from './PasswordDialog.vue'
import { LogoutRequest } from '@/api/auth/auth'

const router = useRouter()

// 退出登录
const logout = () => {
  ElMessageBox.confirm('您是否確認退出登入?', '溫馨提示', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 1.執行登出登入介面
    LogoutRequest()
      .then(async () => {
        // 2.清除 Token
        const userStore = useUserStore()
        userStore.reset()

        // 3.重定向到登陸頁
        await router.replace(LOGIN_URL)
        ElMessage.success('退出登入成功！')
      })
      .catch(() => {})
  })
}
// 打开修改密码和个人信息弹窗
const infoRef = ref(null)
const passwordRef = ref(null)
const openDialog = (ref) => {
  if (ref === 'infoRef') infoRef.value?.openDialog()
  if (ref === 'passwordRef') passwordRef.value?.openDialog()
}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  background-color: #009688;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
