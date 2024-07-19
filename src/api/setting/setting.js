import http from '@/axios'

export const SettingRequest = () => http.post('setting/list')

export const SettingUpdateRequest = (params) => http.post('setting/update', params)
