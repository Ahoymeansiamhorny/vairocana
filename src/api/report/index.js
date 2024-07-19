import http from '@/axios'

export const ProductContributionReportRequest = (params) =>
  http.post('rpt/report/product-contribution', params)
export const AgentCommissionReportRequest = (params) =>
  http.post('rpt/report/agent-commission-list', params)
export const MasterCommissionReportRequest = (params) =>
  http.post('rpt/report/master-commission-list', params)
export const OwnerCostReport = (params) => http.post('rpt/report/owner-sold-list', params)
export const OwnerCostSummaryReport = (params) => http.post('rpt/report/owner-sold-summary', params)
