import http from '@/axios'

export const LoginLogRequest = (params) => http.post('manager/log/login', params)

export const ListRequest = (params) => http.post('manager/list', params)
export const ListDirectRequest = (params) => http.post('manager/list/direct', params)
export const CreateRequest = (params) => http.post('manager/create', params)
export const UpdateRequest = (params) => http.post('manager/update', params)
export const DeleteRequest = (params) => http.post('manager/delete', params)
