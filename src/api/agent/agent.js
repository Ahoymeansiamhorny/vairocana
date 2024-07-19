import http from '@/axios'

export const LoginLogRequest = (params) => http.post('agent/log/login', params)
export const ListRequest = (params) => http.post('agent/list', params)
export const ListDirectRequest = (params) => http.post('agent/list/direct', params)
export const CreateRequest = (params) => http.post('agent/create', params)
export const UpdateRequest = (params) => http.post('agent/update', params)
export const DeleteRequest = (params) => http.post('agent/delete', params)
