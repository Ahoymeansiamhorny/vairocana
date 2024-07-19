import http from '@/axios'

export const LoginLogRequest = (params) => http.post('member/log/login', params)

export const MemberListRequest = (params) => http.post('member/list', params)

export const MemberUpdateRequest = (params) => http.post('member/update', params)

export const MemberUpdateStatusRequest = (params) => http.post('/member/update/status', params)
