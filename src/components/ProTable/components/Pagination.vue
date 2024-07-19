<template>
  <!-- 分页组件 -->
  <el-pagination
    :small="isMobile"
    :background="true"
    :pager-count="isMobile ? 5 : 7"
    :current-page="pageable.pageNum"
    :page-size="pageable.pageSize"
    :page-sizes="[50, 200, 100, 500]"
    :total="pageable.total"
    :layout="isMobile ? 'prev, pager, next,jumper' : 'total, sizes, prev, pager, next, jumper'"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup name="Pagination">
import { computed } from 'vue'

defineProps({
  pageable: {
    type: Object,
    default: () => ({ pageNum: 1, pageSize: 50, total: 0 })
  },
  handleSizeChange: Function,
  handleCurrentChange: Function
})

const isMobile = computed(() =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
)
</script>
