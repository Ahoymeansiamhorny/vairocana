import http from '@/axios'

export const RoleRequest = () => http.get('selection/admin/role')
export const AgentRoleRequest = () => http.get('selection/agent/role')
export const NumberOwnerRequest = () => http.get('selection/number/owner')
export const PermissionRequest = () => http.get('selection/permission')
