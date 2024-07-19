<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup name="TableColumn" lang="jsx">
import { inject, ref, useSlots } from 'vue'
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from '@/utils'

defineProps({
  column: Object
})

const slots = useSlots()

const enumMap = inject('enumMap', ref(new Map()))

// 渲染表格数据
const renderCellData = (item, scope) => {
  const val = handleRowAccordingToProp(scope.row, item.prop)
  if (enumMap.value.get(item.prop) && item.isFilterEnum) {
    if (Array.isArray(val)) {
      return formatValue(
        val.map((i) => filterEnum(i, enumMap.value.get(item.prop), item.fieldNames))
      )
    } else {
      return filterEnum(
        handleRowAccordingToProp(scope.row, item.prop),
        enumMap.value.get(item.prop),
        item.fieldNames
      )
    }
  }
  return formatValue(val)
}

// 获取 tag 类型
const getTagType = (item, scope) => {
  return filterEnum(
    handleRowAccordingToProp(scope.row, item.prop),
    enumMap.value.get(item.prop),
    item.fieldNames,
    'tag'
  )
}

const RenderTableColumn = (item) => {
  return (
    <>
      ,
      {item.isShow && (
        <el-table-column
          {...item}
          min-width="125"
          align={item.align ?? 'center'}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== 'operation'}
        >
          {{
            default: (scope) => {
              if (item._children) return item._children.map((child) => RenderTableColumn(child))
              if (item.render) return item.render(scope)
              if (slots[handleProp(item.prop)]) return slots[handleProp(item.prop)](scope)
              if (item.tag)
                return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>
              return renderCellData(item, scope)
            },
            header: (scope) => {
              if (item.headerRender) return item.headerRender(scope)
              if (slots[`${handleProp(item.prop)}Header`])
                return slots[`${handleProp(item.prop)}Header`](scope)
              return item.label
            }
          }}
        </el-table-column>
      )}
    </>
  )
}
</script>
