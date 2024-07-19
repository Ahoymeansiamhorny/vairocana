import axios from 'axios'
import i18n from '@/languages'
import { useUserStore } from '@/stores/modules/user.js'
import { ElMessage } from 'element-plus'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/components/Loading/fullScreen'
import { ResultEnum } from '@/enums/httpEnum'
import { RefreshTokenRequest } from '@/api/auth/auth'
import router from '@/router'
import { LOGIN_URL } from '@/config'

const instance = axios.create({
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT,
  // 跨域时候允许携带凭证
  withCredentials: false
})

// Create a list to hold the request queue
const refreshAndRetryQueue = []

// Flag to prevent multiple token refresh requests
let isRefreshing = false

// Add global request interceptor
instance.interceptors.request.use(
  (config) => {
    showFullScreenLoading()
    const userStore = useUserStore()
    if (userStore.isAuth) {
      if (config.url.includes('refresh-token')) {
        config.headers.set('Authorization', `Bearer ${userStore.refreshToken}`)
      } else {
        config.headers.set('Authorization', `Bearer ${userStore.token}`)
      }
    }
    if (config.method.toUpperCase() === 'GET') {
      config.params = {
        // 让每个请求都携带一个不同的时间参数，防止浏览器缓存不发送请求
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }

    return config // Modify request config here, e.g., add headers
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add global response interceptor
instance.interceptors.response.use(
  (response) => {
    tryHideFullScreenLoading()
    const { data, config } = response // Modify response data here, if needed
    const { code, msg } = data
    if (code === 1000) {
      return data.data
    }

    const userStore = useUserStore()
    if (code === 100003) {
      if (config.url.includes('refresh-token')) {
        return Promise.reject(data)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshAndRetryQueue.push({
            config,
            resolve
          })
        })
      }

      isRefreshing = true
      const userStore = useUserStore()
      RefreshTokenRequest()
        .then((res) => {
          const { access_token, refresh_token } = res
          userStore.setRefreshToken(refresh_token)
          userStore.setToken(access_token)

          refreshAndRetryQueue.forEach(({ config, resolve }) => {
            resolve(instance(config))
          })
          refreshAndRetryQueue.length = 0
          isRefreshing = false
          return instance(config)
        })
        .catch(async () => {
          userStore.reset()
          await router.replace(LOGIN_URL)
          ElMessage.error(i18n.global.t(`api.${code}`, [msg]))
        })
    } else {
      ElMessage.error(i18n.global.t(`api.${code}`, [msg]))

      if ([100004, 100005, 100003].includes(code)) {
        userStore.reset()
        router.replace(LOGIN_URL).then((r) => r)
        return Promise.reject(data)
      }
      return Promise.reject(data)
    }
  },
  (err) => {
    tryHideFullScreenLoading()
    if (err && err.response) {
      const message = `${err.response.status} - ${i18n.global.t(`http.${err.response.status}`)}`
      ElMessage.error(message)
    } else {
      ElMessage.error(`${err.code} - ${err.message}`)
    }
    return Promise.reject(err)
  }
)

export default instance
