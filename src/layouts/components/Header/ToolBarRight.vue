<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!--      <Link style="width: 1.5em; height: 1.5em; margin-right: 8px; cursor: pointer" @click="href" />-->
      <!--      <el-button :icon="Link" round type="danger" @click="href" />-->
      <AssemblySize style="display: none" id="assemblySize" />
      <Language style="display: none" id="language" />
      <SearchMenu style="display: none" id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message style="display: none" id="message" />
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

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.userName)
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
