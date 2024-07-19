import http from '@/axios'

export const NumberListRequest = (params) => http.post('/number/list', params)
export const NumberUpdateRequest = (params) => http.post('/number/update', params)
export const NumberUpdateStatusRequest = (params) => http.post('/number/update/status', params)
export const NumberUpdateCategoryRequest = (params) => http.post('/number/update/category', params)
export const NumberCreateRequest = (params) => http.post('/number/create', params)
export const NumberBulkRequest = (params) => http.post('/number/bulk', params)
export const NumberDeleteRequest = (params) => http.post('/number/delete', params)
