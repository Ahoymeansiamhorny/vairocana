import http from '@/axios'
export const CreateRequest = (params) => http.post('role/create', params)
export const DeleteRequest = (params) => http.post('role/delete', params)
export const UpdateRequest = (params) => http.post('role/update', params)
export const ListRequest = (params) => http.post('role/list', params)
