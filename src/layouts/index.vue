<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup name="layout">
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
import ThemeDrawer from './components/ThemeDrawer/index.vue'
import LayoutVertical from './LayoutVertical/index.vue'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'

const LayoutComponents = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns
}

const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>

<style scoped lang="scss">
.layout {
  // min-width: 600px;
}
</style>
