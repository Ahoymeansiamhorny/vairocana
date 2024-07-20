<template>
  <div class="theme-setting">
    <!-- <i :class="'iconfont icon-zhuti'" class="toolBar-icon" @click="openDrawer"></i> -->
    <el-icon :style="{ fontSize: '22px', height: '20px' }" @click="openDrawer"><Orange /></el-icon>
  </div>
</template>

<script setup>
import mittBus from '@/utils/mittBus'
const openDrawer = () => {
  mittBus.emit('openThemeDrawer')
}
</script>
<style scoped lang="scss">
  .theme-setting {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>