import http from '@/axios'

export const uploadFile = (data) => {
  return http({
    url: '/tools/upload',
    method: 'post',
    data,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}
