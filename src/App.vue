<script setup>
import { RouterView } from 'vue-router'
import { onMounted, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'
import { useTheme } from '@/hooks/useTheme'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useGlobalStore } from '@/stores/modules/global'

const globalStore = useGlobalStore()
// init theme
const { initTheme } = useTheme()
initTheme()

// init language
const i18n = useI18n()
onMounted(() => {
  i18n.locale.value = 'zh' //globalStore.language ?? getBrowserLang()
  globalStore.setGlobalState('language', 'zh')
})

// element language
const locale = computed(() => {
  if (globalStore.language === 'zh') return zhCn
  if (globalStore.language === 'en') return en
  return getBrowserLang() === 'zh' ? zhCn : en
})
// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize)

// element button config
const buttonConfig = reactive({ autoInsertSpace: false })
</script>

<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <RouterView />
  </el-config-provider>
</template>
