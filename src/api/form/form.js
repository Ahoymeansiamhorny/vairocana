import http from '@/axios'

export const ListRequest = (params) => http.post('form/list', params)
export const CreateRequest = (params) => http.post('form/create', params)
export const UpdateRequest = (params) => http.post('form/update', params)
export const DeleteRequest = (params) => http.post('form/delete', params)

export const IntermediateListRequest = (params) => http.post('form/intermediate/list', params)
export const IntermediateCreateRequest = (params) => http.post('form/intermediate/create', params)
export const IntermediateUpdateRequest = (params) => http.post('form/intermediate/update', params)
export const IntermediateDeleteRequest = (params) => http.post('form/intermediate/delete', params)
