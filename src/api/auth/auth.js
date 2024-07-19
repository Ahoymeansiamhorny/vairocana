import http from '@/axios'
export const LoginRequest = (params) => http.post('auth/login', params)

export const UserInfoRequest = () => http.get('auth/info')

export const UserInfoUpdateRequest = (params) => http.post('auth/info', params)

export const AuthMenuListApi = () => http.get(`/auth/menu`)

export const ChangePasswordRequest = (params) => http.post(`/auth/password-reset`, params)

export const LogoutRequest = () => http.get(`/auth/logout`)

export const RefreshTokenRequest = () => http.get('/auth/refresh-token')
