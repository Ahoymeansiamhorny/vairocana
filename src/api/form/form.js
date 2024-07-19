import http from '@/axios'

export const ListRequest = (params) => http.post('form/list', params)
export const CreateRequest = (params) => http.post('form/create', params)
export const UpdateRequest = (params) => http.post('form/update', params)
export const DeleteRequest = (params) => http.post('form/delete', params)
