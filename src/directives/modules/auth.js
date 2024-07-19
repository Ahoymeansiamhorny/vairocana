/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from '@/stores/modules/auth'

const auth = {
  mounted(el, binding) {
    const { value } = binding
    if (value && value instanceof Array && value.length > 0) {
      const authStore = useAuthStore()

      const permission = value
      const permissionAct = authStore.authButtonListGet
      const hasPermission = permissionAct.some((p) => {
        return permission.includes(p)
      })
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}

export default auth
