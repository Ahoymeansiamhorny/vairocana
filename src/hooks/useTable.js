import { reactive, computed, toRefs, markRaw } from 'vue'
import { object } from 'zod'
import { ElMessageBox } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import il8n from '@/languages'

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * @param {Function} requestError 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = (api, initParam, isPageable, dataCallBack, requestError, rule) => {
  const state = reactive({
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: initParam?.pageSize || 50,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: { ...initParam },
    // 初始化默认的查询参数
    searchInitParam: { ...initParam },
    // 总参数(包含分页和查询参数)
    totalParam: {}
  })

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      }
    },
    set: (newVal) => {
      console.log('我是分页更新之后的值', newVal)
    }
  })

  const beforeGetTableList = async (param) => {
    return new Promise((resolve, reject) => {
      if (Object.keys(rule).length === 0) {
        return resolve()
      }

      const data = object(rule).safeParse(param)
      if (data.success) {
        return resolve()
      }

      let messageCode = 'api.100002'
      const condition = {}
      if (data?.error?.issues?.[0]) {
        const err = data.error.issues?.[0]
        const { message, path } = err
        messageCode = `validation.${message}`
        if (path?.[0]) {
          condition._field_ = il8n.global.t(`form.fields.${path[0]}`)
        }
      }
      ElMessageBox.alert(il8n.global.t(messageCode, condition), 'Warning', {
        confirmButtonText: 'OK',
        type: 'warning',
        icon: markRaw(WarningFilled)
      })
      return reject()
    })
  }

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    if (!api) return

    const tmp = {
      ...initParam,
      ...state.totalParam
    }

    // 先把初始化参数和分页参数放到总参数里面
    Object.assign(tmp, isPageable ? pageParam.value : {})
    const param = { ...tmp }

    const valid = await beforeGetTableList(param)
      .then(() => true)
      .catch(() => false)

    if (!valid) {
      return
    }
    try {
      let data = await api(param)
      dataCallBack && (data = dataCallBack(data))
      state.tableData = isPageable ? data.list : data

      // document.querySelector('tbody').scrollIntoView({
      //   top: 0,
      //   behavior: 'smooth'
      // })
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isPageable) {
        const { pageNum, pageSize, total } = data
        updatePageable({
          pageNum: pageNum || pageParam.value.pageNum,
          pageSize: pageSize || pageParam.value.pageSize,
          total
        })
      }
    } catch (error) {
      requestError && requestError(error)
    }
  }

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam = {}
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      if (Array.isArray(state.searchParam[key])) {
        if (state.searchParam[key].length === 0) {
          delete state.searchParam[key]
        } else {
          nowSearchParam[key] = state.searchParam[key]
        }
      } else if (
        state.searchParam[key] ||
        state.searchParam[key] === false ||
        state.searchParam[key] === 0
      ) {
        // 某些情况下参数为 false/0 也应该携带参数
        nowSearchParam[key] = state.searchParam[key]
      } else {
        delete state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
  }

  /**
   * @description 更新分页信息
   * @param {Object} pageable 后台返回的分页数据
   * @return void
   * */
  const updatePageable = (pageable) => {
    Object.assign(state.pageable, pageable)
  }

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam }
    updatedTotalParam()
    getTableList()
  }

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val) => {
    state.pageable.pageNum = 1
    state.pageable.pageSize = val
    getTableList()
  }

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val) => {
    state.pageable.pageNum = val
    getTableList()
  }

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam
  }
}
