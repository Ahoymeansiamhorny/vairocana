/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import { ElMessage } from 'element-plus'
import i18n from '@/languages'

const copy = {
  mounted(el, binding) {
    el.copyData = binding.value
    el.addEventListener('click', handleClick)
  },
  updated(el, binding) {
    el.copyData = binding.value
  },
  beforeUnmount(el) {
    el.removeEventListener('click', el.__handleClick__)
  }
}

async function handleClick() {
  try {
    await navigator.clipboard.writeText(this.copyData)
  } catch (err) {
    console.error('复制操作不被支持或失败: ', err)
  }
  ElMessage({
    type: 'success',
    dangerouslyUseHTMLString: true,
    message: `${i18n.global.t('common.copySuccess')} <br/> ${this.copyData}`
  })
}

export default copy
