import http from '@/axios'

export const PurchaseListRequest = (params) => http.post('/fnn/purchase/list', params)

export const PurchaseDetailRequest = (params) => http.post('/fnn/purchase/detail', params)

export const PurchaseConfirmRequest = (params) => http.post('/fnn/purchase/confirm', params)

export const PurchaseCancelRequest = (params) => http.post('/fnn/purchase/cancel', params)

export const PurchaseDirectCreateCashSettlementOrderRequest = (params) =>
  http.post('/fnn/purchase/direct-new-cash-settlement', params)

export const PurchaseUpdateRegisterDocument = (params) =>
  http.post('/fnn/purchase/update-doc', params)

export const PurchaseRefundRequest = (params) => http.post('/fnn/purchase/refund', params)

export const PurchaseCompleted = (params) => http.post('/fnn/purchase/completed', params)

export const PurchaseChangeNumberRequest = (params) =>
  http.post('/fnn/purchase/change-number', params)
