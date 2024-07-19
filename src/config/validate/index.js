import il8n from '@/languages'
import * as zod from 'zod'
const field = (label) => il8n.global.t(`form.fields.${label}`)
export const formConfig = (condition = {}) => ({
  props(state) {
    condition._field_ = field(state.path)
    return {
      validateEvent: false,
      required: state.required,
      error: state.errors[0] ? il8n.global.t(`validation.${state.errors[0]}`, condition) : ''
    }
  },
  validateOnBlur: true, // Validates when `blur` event is emitted from the element/component
  validateOnChange: true, // Validates when `change` event is emitted from the element/component
  validateOnInput: false, // Validates when `input` event is emitted from the element/component
  validateOnModelUpdate: true // Validates when the returned model value changes
})

export const USERNAME_REGEXP = '^(?=.*\\d)(?=.*[a-zA-Z]).{8,20}$'
export const PASSWORD_REGEXP = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$'
export const IS_DIGIT_REGEXP = /^\d+$/
export const IS_PHONE_REGEXP = '^01[0-9]{1}-[0-9]{7,8}$|^01[0-9]{8,9}$'

export const POSITIVE = 'POSITIVE'
export const UPLOAD = 'UPLOAD'
export const IS_DIGIT = 'IS_DIGIT'
export const IS_PHONE = 'IS_PHONE'
export const IS_NUMBER = 'IS_NUMBER'
export const SELECTION = 'SELECTION'
export const ONE_OF = 'ONE_OF'
export const URL = 'URL'
export const REQUIRED = 'REQUIRED'
export const LENGTH = 'LENGTH'
export const MAX = 'MAX'
export const MAX_VALUE = 'MAX_VALUE'
export const MIN = 'MIN'
export const MIN_VALUE = 'MIN_VALUE'
export const EMAIL = 'EMAIL'
export const PASSWORD_RULE = 'PASSWORD_RULE'
export const ACCOUNT_RULE = 'ACCOUNT_RULE'
export const DATE_FORMAT_ERROR = 'DATE_FORMAT_ERROR'
export const PASSWORD_ACCOUNT_CANNOT_BE_SAME = 'PASSWORD_ACCOUNT_CANNOT_BE_SAME'

export const PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME = 'PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME'
export const CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME = 'CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME'

export const ZOD_STRING = zod.string({
  required_error: REQUIRED
})

export const ZOD_DATE = zod.string({
  required_error: REQUIRED,
  invalid_type_error: DATE_FORMAT_ERROR
})

export const ZOD_ARRAY = zod.array({
  required_error: REQUIRED
})

export const ZOD_NUMBER = zod.number({
  required_error: REQUIRED,
  invalid_type_error: IS_NUMBER
})

export const ZOD_LITERAL = (val, message) =>
  zod.literal(val, {
    errorMap: () => ({ message })
  })
