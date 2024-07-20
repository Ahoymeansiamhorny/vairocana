<!-- 📚📚📚 Pro-Table 文档: https://juejin.cn/post/7166068828202336263 -->
<template>
  <!-- 查询表单 -->
  <SearchForm
    v-show="isShowSearch"
    :search="_search"
    :reset="_reset"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-col="searchCol"
  />
  <!-- 表格主体 -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot
          name="tableHeader"
          :selected-list="selectedList"
          :selected-list-ids="selectedListIds"
          :is-selected="isSelected"
        />
      </div>
      <div v-if="toolButton" class="header-button-ri">
        <slot name="toolButton">
          <el-button
            v-if="showToolButton('refresh')"
            :icon="Refresh"
            circle
            @click="getTableList"
          />
          <el-button
            v-if="showToolButton('setting') && columns.length"
            :icon="Operation"
            circle
            @click="openColSetting"
          />
          <el-button
            v-if="showToolButton('search') && searchColumns?.length"
            :icon="Search"
            circle
            @click="isShowSearch = !isShowSearch"
          />
        </slot>
      </div>
    </div>

    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="processTableData"
      :border="border"
      :row-key="rowKey"
      @sort-change="_sortLogic"
      @selection-change="selectionChange"
      style="text-align: left;"
    >
      <!-- 默认插槽 -->
      <slot />

      <template v-for="item in tableColumns" :key="item">
        <el-table-column
          min-width="125"
          v-if="item.type && columnTypes.includes(item.type)"
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type === 'selection'"
        >
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type === 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope" />
            </template>
            <!-- radio -->
            <el-radio v-if="item.type === 'radio'" v-model="radio" :label="scope.row[rowKey]">
              <i></i>
            </el-radio>
            <!-- sort -->
            <el-tag v-if="item.type === 'sort'" class="move">
              <el-icon> <DCaret /></el-icon>
            </el-tag>
          </template>
        </el-table-column>

        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>

      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>

      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>{{ t('common.noData') }}</div>
          </slot>
        </div>
      </template>
    </el-table>

    <slot name="pagination">
      <Pagination
        v-if="pagination"
        :pageable="pageable"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      />
    </slot>
  </div>
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script setup name="ProTable">
import { ref, watch, provide, onMounted, computed, reactive } from 'vue'
import { useTable } from '@/hooks/useTable'
import { useSelection } from '@/hooks/useSelection'
import { useI18n } from 'vue-i18n'
import { Refresh, Operation, Search } from '@element-plus/icons-vue'
import { handleProp } from '@/utils'
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from './components/Pagination.vue'
import ColSetting from './components/ColSetting.vue'
import TableColumn from './components/TableColumn.vue'

const props = defineProps({
  title: String, // 表格标题 ==> 非必传
  data: Array, // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi: Function, // 请求表格数据的 api ==> 非必传
  requestError: Function, // 表格 api 请求错误监听 ==> 非必传
  dataCallback: Function, // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  columns: Object, // 列配置项  ==> 必传
  requestAuto: { type: Boolean, default: true }, // 是否自动执行请求 api ==> 非必传（默认为true）
  pagination: { type: Boolean, default: true }, // 是否需要分页组件 ==> 非必传（默认为true）
  initParam: Object, // 初始化请求参数 ==> 非必传（默认为{}）
  rule: { type: Object, default: () => ({}) }, // 表单请求参数规则
  border: { type: Boolean, default: true }, // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton: { type: [Boolean, String], default: true }, // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey: { type: String, default: 'id' }, // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol: { type: Object, default: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }) } // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
})

const { t } = useI18n()
// table 实例
const tableRef = ref()

// column 列类型
const columnTypes = ['selection', 'radio', 'index', 'expand', 'sort']

// 是否显示搜索模块
const isShowSearch = ref(true)

// 控制 ToolButton 显示
const showToolButton = (key) => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton
}

// 单选值
const radio = ref('')

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey)

// 表格操作 Hooks
const {
  tableData,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange
} = useTable(
  props.requestApi,
  props.initParam,
  props.pagination,
  props.dataCallback,
  props.requestError,
  props.rule
)

const clearSelection = () => tableRef.value?.clearSelection()

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  props.requestAuto && getTableList()
  props.data && (pageable.value.total = props.data.length)
})

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value
  if (!props.pagination) return props.data
  return props.data.slice(
    (pageable.value.pageNum - 1) * pageable.value.pageSize,
    pageable.value.pageSize * pageable.value.pageNum
  )
})

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true })

const tableColumns = reactive(props.columns)

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns))

const enumMap = ref(new Map())
const setEnumMap = async (item) => {
  if (!item.enum) return

  // 如果当前 enumMap 存在相同的值 return
  if (
    enumMap.value.has(item.prop) &&
    (typeof item.enum === 'function' || enumMap.value.get(item.prop) === item.enum)
  ) {
    return
  }
  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof item.enum !== 'function') {
    return enumMap.value.set(
      item.prop,
      item.enum.map(({ value, label }) => ({ value, label: t(label) }))
    )
  }
  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(item.prop, [])

  //  当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const data = await item.enum()
  enumMap.value.set(item.prop, data)
}

provide('enumMap', enumMap)

const flatColumnsFunc = (columns, flatArr = []) => {
  columns.forEach(async (col) => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true
    col.isFilterEnum = col.isFilterEnum ?? true

    // 设置 enumMap
    await setEnumMap(col)
  })
  return flatArr.filter((item) => !item._children?.length)
}

const searchColumns = computed(() => {
  return flatColumns.value
    .filter((item) => item.search?.el || item.search?.render)
    .sort((a, b) => a.search.order - b.search.order)
})

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value.forEach((column, index) => {
  column.search.order = column.search?.order ?? index + 2
  const key = column.search?.key ?? handleProp(column.prop)
  const defaultValue = column.search?.defaultValue
  if (defaultValue !== undefined && defaultValue !== null) {
    searchInitParam.value[key] = defaultValue
    searchParam.value[key] = defaultValue
  }
})

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref()
const colSetting = tableColumns?.filter((item) => {
  const { type, prop, isShow } = item
  return !columnTypes.includes(type) && prop !== 'operation' && isShow
})
const openColSetting = () => colRef.value.openColSetting()

const emit = defineEmits(['search', 'reset', 'dargSort', 'sortLogic'])
const _search = () => {
  search()
  emit('search')
}

const _sortLogic = (param) => {
  emit('sortLogic', param)
}

const _reset = () => {
  reset()
  emit('reset')
}

// const dragSort = () => {
// const tbody = document.querySelector('.el-table__body-wrapper tbody')
// Sortable.create(tbody, {
//   handle: '.move',
//   animation: 300,
//   onEnd({ newIndex, oldIndex }) {
//     const [removedItem] = processTableData.value.splice(oldIndex, 1)
//     processTableData.value.splice(newIndex, 0, removedItem)
//     emit('dargSort', { newIndex, oldIndex })
//   }
// })
// }

// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: processTableData,
  radio,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds
})
</script>

<style scoped lang="scss">
::v-deep .el-table .cell{
  text-align: left;
  .el-button+.el-button {
    margin: 0;
  }
}
</style>