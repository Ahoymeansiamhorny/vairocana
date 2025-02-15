import { defineStore } from 'pinia'
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from '@/utils'
import { AuthMenuListApi } from '@/api/auth/auth'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // 按钮权限列表
    authButtonList: [],
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: ''
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: (state) => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: (state) => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: (state) => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: (state) => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    reset() {
      this.authButtonList = []
      this.authMenuList = []
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      const response = await AuthMenuListApi()
        .then((res) => [res])
        .catch((e) => [null, e])
      if (response[0]) {
        this.authMenuList = response[0]
        this.authButtonList = this.flatMenuListGet.map((i) => i.meta.permission).flat()
      } else {
        this.authMenuList = []
        this.authButtonList = []
      }
    },
    // Set RouteName
    async setRouteName(name) {
      this.routeName = name
    }
  },
  persist: false
})
