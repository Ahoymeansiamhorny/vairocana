export default {
  validation: {
    LENGTH: '{_field_} 必須包含正好 {length} 個字符',
    URL: '{_field_} 必須是一個有效的 URL',
    POSITIVE: '{_field_} 必須大於 0',
    REQUIRED: '{_field_} 是必需的',
    TEXT_ENTER: '請輸入 {_field_}',
    SELECTION: '請選擇 {_field_}',
    ONE_OF: '{_field_} 必須是 {ONE_OF} 之一',
    ACCOUNT_RULE: '{_field_} 必須是包含 8-20 個字母和數字的組合',
    PASSWORD_RULE: '{_field_} 必須是包含 8-20 個字母和數字的組合，包括大小寫字母',
    PASSWORD_ACCOUNT_CANNOT_BE_SAME: '帳戶密碼不能相同',
    EMAIL: '必須是有效的電子郵件',
    IS_PHONE: '必須是有效的電話號碼',
    MIN_VALUE: '{_field_} 字段必須為 0:{min} 或更高',
    MAX_VALUE: '{_field_} 字段必須為 0:{max} 或更低',
    MIN: '{_field_} 必須至少包含 {min} 個字符',
    MAX: '{_field_} 不能超過 {max} 個字符',
    IS_DIGIT: '{_field_} 必須是數字',
    PASSWORD_NEW_PASSWORD_CANNOT_BE_SAME: '新密碼不得與密碼相同',
    CONFIRM_PASSWORD_NEW_PASSWORD_NOT_SAME: '新密碼必須與確認密碼相同',
    DATE_FORMAT_ERROR: '{_field_} 不是有效的日期',
    IS_NUMBER: '{_field_} 必須是數字',
    UPLOAD: '請上傳文件'
  },
  home: {
    welcome: '歡迎'
  },
  tabs: {
    refresh: '刷新',
    maximize: '最大化',
    closeCurrent: '關閉當前',
    closeLeft: '關閉左側',
    closeRight: '關閉右側',
    closeOther: '關閉其他',
    closeAll: '關閉所有'
  },
  enum: {
    customerInfoDoc: {
      1: '身份證',
      2: '護照'
    },
    malaysiaState: {
      1: '柔佛',
      2: '吉打',
      3: '吉蘭丹',
      4: '吉隆坡',
      5: '納閩',
      6: '馬六甲',
      7: '森美蘭',
      8: '彭亨',
      9: '霹靂',
      10: '玻璃市',
      11: '檳城',
      12: '布城',
      13: '沙巴',
      14: '砂拉越',
      15: '雪蘭莪',
      16: '登嘉樓'
    },
    adminStatus: {
      1: '活躍',
      2: '停用'
    },
    adminIdentify: {
      1: '公司',
      2: '主',
      3: '代理'
    },
    numberStatus: {
      1: '活躍',
      2: '預留',
      3: '已售出',
      4: '停用'
    },
    numberDisplay: {
      1: '016-1234567',
      2: '01H-1234567'
    },
    numberType: {
      1: '所有相似號碼',
      2: '匹配最後 3 位數字',
      3: '匹配最後 4 位數字',
      4: '匹配前 3 位數字',
      5: '匹配前 4 位數字',
      6: '自有號碼'
    },
    numberRemark: {
      1: '',
      2: 'OT',
      3: '新 SIM'
    },
    numberSoldType: {
      1: '預付',
      2: '368 後付'
    },
    numberCategory: {
      1: 'AAABBBB',
      2: 'AAAABBB',
      3: 'AB 系列',
      4: 'AAABBB',
      5: 'AAAA',
      6: 'AAA',
      7: 'AAAAAAA',
      8: 'AAAAAA',
      9: 'AAAAA',
      10: 'ABBBCCC',
      11: 'ABBBBBC',
      12: 'AABBCCC',
      13: 'AAABCCC',
      14: 'AAABBBC',
      15: 'AABBBCC',
      16: 'AABBCDCD',
      17: 'AABBCCDD',
      18: 'ABCDABCD',
      19: 'ABCABC',
      20: 'ABABAB',
      21: 'AAAB',
      22: 'ABAB',
      23: 'AABB',
      24: 'ABBA',
      25: 'AABA',
      26: 'ABAA',
      27: 'AABBCAB',
      28: 'ABABCAB',
      29: 'AABBABC',
      30: '風水 1349',
      31: '風水 2678',
      32: '易經',
      33: '鏡子系列',
      34: '梯子系列',
      35: '玄學',
      36: '其他',
      37: '千系列'
    },
    paymentType: {
      1: '全款支付',
      2: '預訂支付',
      3: '結算支付'
    },
    tunnelType: {
      1: '銀行轉賬',
      2: 'FPX',
      3: '借記卡 / 信用卡',
      4: '信用分期',
      5: '電子錢包',
      6: '現金'
    },
    purchaseStatus: {
      0: '未提交',
      1: '已提交',
      2: '已確認',
      3: '已取消',
      4: '處理中',
      5: '沒收',
      6: '退款',
      7: '成功'
    }
  },
  common: {
    ProcessingDocument: '處理文件',
    PurchasesInformation: '購買信息',
    CustomerInformation: '客戶信息',
    resetPassword: '密碼更改成功，請重新登錄',
    success: '成功',
    warn: '警告',
    dialogDrawerClose: '您還有未保存的數據，是否繼續？',
    confirmDelete: '刪除 {username}，是否繼續？',
    changeStatus: '您是否要切換 {name} 狀態？',
    changeCategory: '您是否要切換 {name} 類別？',
    showMore: '顯示更多',
    showLess: '顯示更少',
    reminder: '提醒',
    colSetting: '列設置',
    colSettingNone: '當前沒有配置列',
    name: '名稱',
    show: '顯示',
    sort: '排序',
    noData: '無數據',
    operationSuccess: '操作成功',
    copySuccess: '複製成功',
    copyFail: '不支持或複製操作失敗',
    formatXls: '上傳的文件只能是 xls / xlsx 格式',
    uploadSelect: '請選擇字段並確保其格式正確',
    uploadExceed: '最多只能上傳一個文件',
    uploadSize: '請不要上傳大於 {size}MB 的文件',
    uploadLength: '最多只能處理 1,000 條數據'
  },
  form: {
    placeholder: {
      select: '請選擇',
      enter: '請輸入',
      startTime: '開始時間',
      endTime: '結束時間'
    },
    action: {
      search: '搜尋',
      reset: '重設搜尋條件',
      edit: '編輯 {target}',
      create: '新增 {target}',
      view: '檢視 {target}',
      resetPassword: '重置密碼',
      delete: '刪除',
      upload: '上傳',
      copyNumber: '複製號碼',
      copyResult: '複製結果',
      confirm: '確認 {target}',
      cancel: '取消',
      reject: '拒絕',
      directCashSettlement: '現金結算',
      completed: '完成',
      addNewCashSettlement: '添加新現金結算',
      refund: '退款',
      changeNumber: '更改號碼'
    },
    elMessageTitle: {
      editUser: '更新用戶成功',
      confirmButtonText: '確認',
      cancelButtonText: '取消'
    },
    button: {
      cancel: '取消',
      confirm: '確認',
      submit: '提交',
      reset: '重置',
      update: '更新'
    },
    fields: {
      owner_transfer_proof: '所有者轉移文件',
      delivery_proof: '交付轉移文件',
      bill_receipt_document: '賬單收據文件',
      inv_name: '發票名稱',
      contract_number: '合同編號',
      inv_address: '發票地址',
      inv_address2: '發票地址 2',
      inv_postcode: '發票郵政編碼',
      inv_state: '發票州/省',
      del_follow_inv: '交付地址同上',
      del_address: '交付地址',
      del_address2: '交付地址 2',
      del_postcode: '交付郵政編碼',
      del_state: '交付州/省',
      upload_type: '文件類型',
      doc: '文件',
      ic_front: '身份證正面',
      ic_rear: '身份證背面',
      passport: '護照',
      order_id: '訂單號',
      payment_type: '支付類型',
      tunnel_id: '支付方式',
      reference_id: '參考編號',
      amount: '金額',
      soldType: '銷售類型',
      remark: '備註',
      display: '顯示',
      expired: '過期',
      contacts: '聯絡人',
      os: '操作系統',
      device: '設備',
      browser: '瀏覽器',
      country: '國家',
      regionName: '地區',
      city: '城市',
      ip: 'IP',
      date: '日期',
      username: '姓名',
      password: '密碼',
      newPassword: '新密碼',
      confirmPassword: '確認新密碼',
      email: '電子郵件',
      nickname: '昵稱',
      name: '名稱',
      creator: '創建者',
      status: '狀態',
      description: '備註',
      mobile: '手機',
      role: '角色',
      roleIds: '角色',
      createdAt: '創建時間',
      modifiedAt: '修改時間',
      settleAt: '結算時間',
      loginAt: '登錄時間',
      operation: '操作',
      permission: '權限',
      owner: '所有者',
      number: '數量',
      category: '類別',
      price: '價格',
      OfferPrice: '成本',
      type: '類型',
      priceFrom: '價格起始',
      priceTo: '價格結束',
      identify: '識別',
      whatapps: 'WhatsApp',
      rate: '比率',
      bankId: '銀行',
      bankNumber: '銀行賬號',
      bankHolderName: '銀行戶名',
      parentAcc: '上級賬戶',
      key: '密鑰',
      assign: '分配',
      ownerId: '所有者ID',
      MASTER_DEFAULT_COMM_RATE: '主默認佣金率',
      COMPANY_COMM_RATE: '公司默認佣金率',
      AGENT_DEFAULT_COMM_RATE: '代理默認佣金率',
      WHATSAPP: 'WhatsApp',
      FACEBOOK: 'Facebook',
      INSTAGRAM: 'Instagram',
      CUSTOMER_LIVE_CHAT: '客戶實時聊天鏈接',
      MIN_BOOKING_PERCENT: '最低預訂費百分比',
      MASTER_DEFAULT_AGENT_KEYS: '主默認代理密鑰',
      LOCK_NUMBER_DURING_TRANSACTION: '交易期間鎖定號碼',
      LOCK_NUMBER_PERIOD_DAYS: '鎖定號碼天數',
      COMPANY_WHATSAPP_L1: '公司WhatsApp第一行',
      COMPANY_WHATSAPP_L2: '公司WhatsApp第二行',
      COMPANY_WHATSAPP_L3: '公司WhatsApp第三行',
      MIN_NUMBER_PRICE: '最低號碼價格',
      EXISTING_OPEN_PURCHASE_ORDER: '現有同時開放的購買訂單',
      MAX_THIRD_PARTY_TRANSFER_LIMIT: '第三方轉賬金額限制',
      FRONT_WEBSITE_LINK: '官方鏈接',
      CMS_WEBSITE_LINK: '後台系統鏈接',
      transactionAmount: '交易金額',
      customerName: '客戶',
      contact: '聯繫',
      payment_method: '支付方式',
      payment_id: '支付_ID',
      company_comm: '公司佣金',
      owner_cost: '所有者成本',
      total_owner_cost: '總所有者成本',
      master: '主',
      master_comm: '主佣金',
      total_master_comm: '總主佣金',
      master_comm_rate: '主佣金率',
      agent: '代理',
      agent_comm: '代理佣金',
      total_agent_comm: '總代理佣金',
      agent_comm_rate: '代理佣金率',
      newSettlementAmount: '新結算金額',
      lock_expired: '鎖定過期',
      new_product_id: '新ID',
      new_number: '新號碼',
      comm: '佣金',
      member: '會員',
      member_mobile: '會員手機',
      count: '計數'
    },
    titles: {
      confirmCancel: '確認/取消',
      addNewCashSettlementConfirmation: '添加新現金結算',
      changeNumberConfirmation: '更改號碼',
      refund: '退款',
      completed: '完成',
      changeNumberReminder: '*僅接受 368 後付號碼之間的交換'
    }
  },
  header: {
    componentSize: '組件大小',
    language: '語言',
    theme: '主題',
    layoutConfig: '佈局配置',
    primary: '主要',
    darkMode: '深色模式',
    greyMode: '灰色模式',
    weakMode: '弱模式',
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    personalData: '個人資料',
    changePassword: '更改密碼',
    logout: '登出'
  },
  http: {
    400: '請求失敗！請稍後重試',
    401: '登錄失效！請重新登錄',
    403: '當前賬戶無權訪問！',
    404: '您訪問的資源不存在！',
    405: '請求方式錯誤！請稍後重試',
    408: '請求超時！請稍後重試',
    500: '服務異常！',
    502: '網關錯誤！',
    503: '服務不可用！',
    504: '網關超時！'
  },
  api: {
    100001: '服務器開小差啦，稍後再來試一試',
    100002: '參數錯誤',
    100003: '憑證失效，請重新登錄',
    100004: '憑證生成失敗',
    100005: '驗證憑證失敗',
    100006: '數據庫繁忙，請稍後再試',
    100007: '無資料更新',
    100008: '該物件已存在',
    100009: '該物件使用中',
    100010: '未授權',
    100012: 'MultiForm請求參數不合法',
    100015: '上傳資料格式錯誤',
    100016: '上傳資料錯誤',
    200001: '賬號/密碼錯誤',
    200002: '您的賬號已被停用，請聯繫在線客服',
    200003: '密碼錯誤',
    200004: '您的賬號已過期',
    200006: '沒有Key開新代理',
    300001: '該產品已售出，無法進行操作',
    300002: '該產品已保留，無法進行操作',
    300003: '在購買訂單中使用中，無法進行操作',
    300004: '號碼價錢低於平台最低售賣價錢',
    300005: '找不到此號碼',
    300006: '此號碼類型無法進行更換號碼交易',
    300007: '此號碼不屬於所輸入的ID',
    500001: '號碼價錢低於最低訂購標準',
    500002: '預購價錢和系統計算不對',
    500003: '高於產品價錢',
    500004: '價錢不對',
    500005: '非法付款類型',
    500006: '交易管道找不到',
    500007: '此交易管道未開啟',
    500008: '購買訂單不存在',
    500009: '訂單已被處理過',
    500010: '此付款方式無法使用',
    500011: '此交易已過期',
    500012: '預購訂單不能為空',
    500013: '預購訂單未確認，無法換尾款',
    500014: '尾款在進行中/等待確認/已確認',
    500015: '尚未確認訂單，無法上傳資料',
    500016: '已被取消訂單，無法上傳資料',
    500017: '沒有上傳完整的身份證正反面',
    500018: '沒有上傳完整的身份證正反面',
    500019: '需要填寫送貨地址',
    500020: '此交易管道不接受超過最高第三方轉賬金額',
    500021: '生成第三方付款連接失敗',
    500022: '第三方回傳驗證失敗',
    500023: '會員超過可以提交新訂單的次數',
    500024: '已經上傳過文件',
    500025: '第三方交易無法手動確認',
    500026: '第三方交易無法手動取消',
    500027: '訂單狀態無法進行退款',
    500028: '僅用預購訂單才可以直接產生現金尾款訂單',
    500029: '該訂單狀態無法被處理',
    500030: '相關的尾款已經存在，無法新增',
    500031: '此訂單已經完成全部步驟',
    500032: '此訂單狀態無法被處理',
    500034: '此訂單無法被更換'
  },
  bank: {
    1: '大馬銀行',
    2: '安芬銀行',
    3: '農業銀行',
    4: '阿拉吉銀行',
    5: '聯合銀行',
    6: '安聯銀行',
    7: '曼谷銀行',
    8: '馬來西亞伊斯蘭銀行',
    9: '馬來西亞人民銀行',
    10: '馬來西亞穆阿瑪拉特銀行',
    11: '美國銀行',
    12: '中國銀行',
    13: '國民儲蓄銀行',
    14: 'BigPay',
    15: '法國巴黎銀行',
    16: '中國建設銀行',
    17: '聯昌國際銀行',
    18: '花旗銀行',
    19: '德意志銀行',
    20: 'Finexus 卡',
    21: 'GX 銀行',
    22: '豐隆銀行',
    23: '匯豐銀行',
    24: '中國工商銀行',
    25: '摩根大通銀行',
    26: '科威特金融銀行',
    27: '馬來亞銀行',
    28: '馬來西亞建設銀行',
    29: 'Merchantrade',
    30: '瑞穗銀行',
    31: '三菱東京UFJ銀行',
    32: '華僑銀行',
    33: '大眾銀行',
    34: '渣打銀行',
    35: '三井住友銀行',
    36: 'Touch N Go 數字',
    37: '大華銀行'
  },
  menu: {
    form: '禪林安心法會',
    page403: '403',
    page404: '404',
    page500: '500',
    login: '登錄',
    home: '主頁',
    admin: '管理員',
    accountManage: '管理員列表',
    roleManage: '角色',
    adminLog: '操作日誌',
    adminLoginLog: '登錄日誌',
    product: '產品',
    numberList: '電話號碼',
    numberExcelUploader: 'Excel 上傳',
    agent: '代理',
    agentAccountManage: '代理賬戶管理',
    agentLoginLog: '代理登錄日誌',
    member: '會員',
    memberList: '會員列表',
    memberLoginLog: '會員登錄日誌',
    setting: '設置',
    settingList: '設置列表',
    purchase: '購買',
    report: '報告',
    productContributionReport: '產品貢獻報告',
    masterCommissionList: '主佣金列表',
    agentCommissionList: '代理佣金列表',
    ownerCostList: '所有者成本列表',
    ownerCostSummaryList: '所有者成本總結'
  },
  permission: {
    formList: '表單列表',
    formUpdate: '更新表單',
    formDelete: '刪除表單',
    formCreate: '新增表單',
    agentCreate: '創建代理',
    agentDelete: '刪除代理',
    agentList: '代理列表',
    agentDirectList: '直接代理列表',
    agentLoginLog: '代理登錄日誌',
    agentUpdate: '更新代理',
    home: '主頁',
    managerCreate: '創建管理員',
    managerDelete: '刪除管理員',
    managerList: '管理員列表',
    managerDirectList: '直接管理員列表',
    managerLog: '管理員日誌',
    managerLoginLog: '管理員登錄日誌',
    managerResetPassword: '重置管理員密碼',
    managerResetSecure: '重置管理員安全設置',
    managerUpdate: '更新管理員',
    numberCreate: '創建號碼',
    numberDelete: '刪除號碼',
    numberList: '號碼列表',
    numberUpdate: '更新號碼',
    numberUpdateCategory: '更新號碼類別',
    numberUpdateStatus: '更新號碼狀態',
    numberBulkCreate: '批量創建號碼',
    roleCreate: '創建角色',
    roleDelete: '刪除角色',
    roleList: '角色列表',
    roleUpdate: '更新角色',
    memberList: '會員列表',
    memberUpdate: '更新會員',
    memberUpdateStatus: '更新會員狀態',
    memberLoginLog: '登錄日誌',
    settingList: '設置列表',
    settingUpdate: '更新設置',
    purchaseList: '購買列表',
    purchaseDetail: '購買詳情',
    purchaseConfirm: '確認購買',
    purchaseCancel: '取消購買',
    purchaseRefund: '退款',
    purchaseDirectCreateCashSettlementOrder: '直接創建現金結算訂單',
    purchaseUpdateRegisterDocument: '更新註冊文件',
    purchaseCompleted: '購買完成',
    purchaseChangeNumber: '更改購買號碼',
    productContributionReport: '產品貢獻報告',
    masterCommissionList: '主佣金列表',
    agentCommissionList: '代理佣金列表',
    ownerCostList: '所有者成本列表',
    ownerCostSummaryList: '所有者成本總結'
  },
  curlec: {
    method: {
      fpx: 'FPX',
      card: '借記卡/信用卡',
      wallet: '電子錢包'
    },
    status: {
      paid: '已支付',
      expired: '已過期',
      cancelled: '已取消',
      created: '已創建'
    }
  }
}
