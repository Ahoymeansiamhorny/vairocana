import { ElMessageBox, ElMessage } from 'element-plus'
import i18n from '@/languages'
/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const useHandleData = (api, params = {}, message = '', confirmType = 'warning') => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, '', {
      dangerouslyUseHTMLString: true,
      confirmButtonText: i18n.global.t('form.elMessageTitle.confirmButtonText'),
      cancelButtonText: i18n.global.t('form.elMessageTitle.cancelButtonText'),
      type: confirmType,
      draggable: true,
      center: true
    })
      .then(async () => {
        api(params)
          .then(() => {
            ElMessage({
              type: 'success',
              message: i18n.global.t('common.operationSuccess')
            })
            return resolve(true)
          })
          .catch((e) => reject(e))
      })
      .catch(() => resolve(true))
  })
}
