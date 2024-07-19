<template>
  <!-- 列设置 -->
  <el-drawer v-model="drawerVisible" :title="t('common.colSetting')" size="450px">
    <div class="table-main">
      <el-table
        :data="colSetting"
        :border="true"
        row-key="prop"
        default-expand-all
        :tree-props="{ children: '_children' }"
      >
        <el-table-column prop="label" align="center" :label="t('common.name')" />
        <el-table-column v-slot="scope" prop="isShow" align="center" :label="t('common.show')">
          <el-switch v-model="scope.row.isShow"></el-switch>
        </el-table-column>
        <!--        <el-table-column v-slot="scope" prop="sortable" align="center" :label="t('common.sort')">-->
        <!--          <el-switch v-model="scope.row.sortable"></el-switch>-->
        <!--        </el-table-column>-->
        <template #empty>
          <div class="table-empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>{{ t('common.colSettingNone') }}</div>
          </div>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup name="ColSetting">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  colSetting: Object
})

const drawerVisible = ref(false)

const openColSetting = () => (drawerVisible.value = true)

defineExpose({
  openColSetting
})
</script>

<style scoped lang="scss">
.cursor-move {
  cursor: move;
}
</style>
