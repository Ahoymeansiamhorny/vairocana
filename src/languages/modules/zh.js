export default {
  home: {
    welcome: '欢迎使用'
  },
  tabs: {
    refresh: '刷新',
    maximize: '最大化',
    closeCurrent: '关闭当前',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeOther: '关闭其它',
    closeAll: '关闭所有'
  },
  enum: {
    adminStatus: {
      1: '启用',
      2: '停用'
    },
    numberStatus: {
      1: '启用',
      2: '保留',
      3: '卖出',
      4: '停用'
    }
  },
  common: {
    success: 'Success',
    dialogDrawerClose: 'You still have unsaved data, proceed?',
    showMore: '展开',
    showLess: '合并',
    colSetting: '列设置',
    colSettingNone: '暂无可配置列',
    name: '名称',
    show: '显示',
    sort: '排序',
    noData: '暂无数据'
  },
  form: {
    placeholder: {
      select: '请选择',
      enter: '请输入',
      startTime: '开始时间',
      endTime: '结束时间'
    },
    action: {
      search: '搜索',
      reset: '重置',
      edit: '编辑 {target}',
      create: '新增 {target}',
      view: '查看 {target}',
      resetPassword: '重置密码',
      delete: '删除'
    },
    elMessageTitle: {
      editUser: 'Update User Success',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    },
    button: {
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    rule: {
      // "_default": "The {field} is not valid",
      // "alpha": "The {field} field may only contain alphabetic characters",
      // "alpha_num": "The {field} field may only contain alpha-numeric characters",
      // "alpha_dash": "The {field} field may contain alpha-numeric characters as well as dashes and underscores",
      // "alpha_spaces": "The {field} field may only contain alphabetic characters as well as spaces",
      // "between": "The {field} field must be between 0:{min} and 1:{max}",
      // "confirmed": "The {field} field confirmation does not match",
      // "digits": "The {field} field must be numeric and exactly contain 0:{length} digits",
      // "dimensions": "The {field} field must be 0:{width} pixels by 1:{height} pixels",
      email: 'The {field} field must be a valid email',
      // "not_one_of": "The {field} field is not a valid value",
      // "ext": "The {field} field is not a valid file",
      // "image": "The {field} field must be an image",
      // "integer": "The {field} field must be an integer",
      // "length": "The {field} field must be 0:{length} long",
      // "max_value": "The {field} field must be 0:{max} or less",
      max: 'The {field} field may not be greater than {max} characters',
      // "mimes": "The {field} field must have a valid file type",
      // "min_value": "The {field} field must be 0:{min} or more",
      // "min": "The {field} field must be at least 0:{length} characters",
      // "numeric": "The {field} field may only contain numeric characters",
      // "one_of": "The {field} field is not a valid value",
      // "regex": "The {field} field format is invalid",
      // required_if: 'The {field} field is required'
      required: 'The {field} field is required'
      // "size": "The {field} field size must be less than 0:{size}KB",
      // "url": "The {field} field is not a valid URL"
    },
    fields: {
      username: '账号',
      email: 'Email',
      nickname: '昵称',
      status: '状态',
      description: '备注',
      mobile: '手机号码',
      role: '角色',
      roleIds: '角色',
      createdAt: '创建时间',
      modifiedAt: '编辑时间',
      operation: '操作',
      whatapps: 'WhatApps',
      rate: '抽成',
      bankId: '銀行',
      bankNumber: '银行户口号码',
      bankHolderName: '银行户口名',
      parentAcc: '上级',
      key: 'Key',
      assign: '身份',
      ownerId: '拥有者',
      MASTER_DEFAULT_COMM_RATE: '大总代预设抽成百分比',
      COMPANY_COMM_RATE: '公司预设抽成百分比',
      AGENT_DEFAULT_COMM_RATE: '代理预设抽成百分比',
      WHATSAPP: 'Whatapps',
      FACEBOOK: 'Facebook',
      INSTAGRAM: 'Instagram',
      CUSTOMER_LIVE_CHAT: '客服链接',
      MIN_BOOKING_PERCENT: '最低预购的百分比',
      MASTER_DEFAULT_AGENT_KEYS: 'Master 预设拥有开代理的密钥数量',
      LOCK_NUMBER_DURING_TRANSACTION: '交易锁定时间(当顾客进行交易中)',
      LOCK_NUMBER_PERIOD_DAYS: '付款预定后可锁定号码(天数)',
      COMPANY_WHATSAPP_L1: '公司Whatsapp1(接受系统订单) ',
      COMPANY_WHATSAPP_L2: '公司Whatsapp2(接受系统订单)',
      COMPANY_WHATSAPP_L3: '公司Whatsapp3(接受系统订单)',
      MIN_NUMBER_PRICE: '最低上架号码价钱',
      EXISTING_OPEN_PURCHASE_ORDER: '同时会员可处理订单上限',
      MAX_THIRD_PARTY_TRANSFER_LIMIT: '第三方支付单笔金额上限',
      FRONT_WEBSITE_LINK: '官方前台域名',
      CMS_WEBSITE_LINK: '後臺域名',
      transactionAmount: '交易金额',
      customerName: '顾客',
      contact: '联系',
      payment_method: '付款方式',
      payment_id: '付款ID',
      company_comm: '公司佣金',
      owner_cost: '号码拥有者成本',
      master: 'Master',
      master_comm: 'Master 佣金',
      master_comm_rate: 'Master 佣金比例',
      agent: '代理',
      agent_comm: '代理比例',
      agent_comm_rate: '代理比例'
    }
  },
  header: {
    componentSize: '组件大小',
    language: '国际化',
    theme: '全局主题',
    layoutConfig: '布局设置',
    primary: 'primary',
    darkMode: '暗黑模式',
    greyMode: '灰色模式',
    weakMode: '色弱模式',
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    personalData: '个人信息',
    changePassword: '修改密码',
    logout: '退出登录'
  },
  menu: {
    page403: '403',
    page404: '404',
    page500: '500',
    home: '首页',
    system: '系统管理',
    accountManage: '账号管理',
    roleManage: '角色管理',
    systemLog: '系统日志',
    systemLoginLog: '管理员登录日志'
  },
  api: {
    100001: '服务器开小差啦,稍后再来试一试',
    100002: '参数错误',
    100003: '凭证失效，请重新登陆',
    100004: '凭证生成失败',
    100005: '验证凭证失败',
    100006: '数据库繁忙,请稍后再试',
    100007: '无资料更新',
    100008: '該物件已存在',
    100009: '該物件使用中',
    200001: '账号/密码错误',
    200002: '您的账号已被停用,请联系在线客服',
    200003: '密碼錯誤',
    200004: '您的帳號已過期'
  },
  curlec: {
    method: {
      fpx: 'FPX',
      card: 'Debit/Credit Card',
      wallet: 'E-Wallet'
    },
    status: {
      paid: '已付款',
      expired: '过期',
      cancelled: '已取消',
      created: '新增'
    }
  }
}
