import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/modules/auth'
import { UserInfoRequest } from '@/api/auth/auth'

const DEFAULT_USER = () => ({
  id: 0,
  userName: '',
  nickname: '',
  whatApps: '',
  mobile: '',
  email: '',
  identify: 0,
  link: '',
  key: 0
})

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: '',
    refreshToken: '',
    userInfo: DEFAULT_USER()
  }),
  getters: {
    isAuth: (state) => state.token && state.refreshToken
  },
  actions: {
    reset() {
      this.token = ''
      this.refreshToken = ''
      this.userInfo = DEFAULT_USER()

      const authStore = useAuthStore()
      authStore.reset()
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        UserInfoRequest()
          .then((res) => {
            const { userName, nickname, id, whatapps, mobile, email, identify, link, key } = res
            this.setUserInfo({
              id,
              userName,
              nickname,
              whatapps,
              identify,
              mobile,
              email,
              link,
              key
            })
            return resolve(true)
          })
          .catch((e) => reject(e))
      })
    },
    // Set Token
    setToken(token) {
      this.token = token
    },
    setRefreshToken(token) {
      this.refreshToken = token
    },
    // Set setUserInfo
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    }
  }
})
