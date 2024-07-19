<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!--      <Link style="width: 1.5em; height: 1.5em; margin-right: 8px; cursor: pointer" @click="href" />-->
      <!--      <el-button :icon="Link" round type="danger" @click="href" />-->
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" />
      <!--      <Fullscreen id="fullscreen" />-->
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import AssemblySize from './components/AssemblySize.vue'
import Language from './components/Language.vue'
import SearchMenu from './components/SearchMenu.vue'
import ThemeSetting from './components/ThemeSetting.vue'
import Message from './components/Message.vue'
// import Fullscreen from './components/Fullscreen.vue'
import Avatar from './components/Avatar.vue'
import { Link } from '@element-plus/icons-vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.userName)

const { t } = useI18n()
const { isSupported, copy } = useClipboard()

const href = () => {
  if (isSupported) {
    copy(userStore.userInfo.link)
    ElMessage({
      type: 'success',
      dangerouslyUseHTMLString: true,
      message: `${t('common.copySuccess')} <br/> ${userStore.userInfo.link}`
    })
  }
  // window.open(userStore.userInfo.link)
}
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
