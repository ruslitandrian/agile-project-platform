import Joi from 'joi';

// 通用驗證規則
export const commonRules = {
  email: Joi.string().email().required().messages({
    'string.email': '請輸入有效的電子郵件地址',
    'any.required': '電子郵件為必填項',
    'string.empty': '電子郵件不能為空'
  }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': '密碼至少需要 8 個字符',
      'string.max': '密碼不能超過 128 個字符',
      'string.pattern.base': '密碼必須包含大小寫字母、數字和特殊字符',
      'any.required': '密碼為必填項',
      'string.empty': '密碼不能為空'
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(new RegExp('^[\\u4e00-\\u9fa5a-zA-Z\\s]+$'))
    .required()
    .messages({
      'string.min': '姓名至少需要 2 個字符',
      'string.max': '姓名不能超過 50 個字符',
      'string.pattern.base': '姓名只能包含中文、英文和空格',
      'any.required': '姓名為必填項',
      'string.empty': '姓名不能為空'
    }),
  
  uuid: Joi.string().uuid().required().messages({
      'string.guid': '無效的 ID 格式',
      'any.required': 'ID 為必填項'
    }),
  
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }
};

// 認證相關驗證
export const authSchemas = {
  register: Joi.object({
    email: commonRules.email,
    password: commonRules.password,
    name: commonRules.name,
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': '確認密碼與密碼不匹配',
        'any.required': '確認密碼為必填項',
        'string.empty': '確認密碼不能為空'
      })
  }),
  
  login: Joi.object({
    email: commonRules.email,
    password: Joi.string().required().messages({
      'any.required': '密碼為必填項',
      'string.empty': '密碼不能為空'
    })
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': '當前密碼為必填項',
      'string.empty': '當前密碼不能為空'
    }),
    newPassword: commonRules.password,
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': '確認密碼與新密碼不匹配',
        'any.required': '確認密碼為必填項',
        'string.empty': '確認密碼不能為空'
      })
  })
};

// 專案相關驗證
export const projectSchemas = {
  create: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': '專案名稱至少需要 2 個字符',
        'string.max': '專案名稱不能超過 100 個字符',
        'any.required': '專案名稱為必填項',
        'string.empty': '專案名稱不能為空'
      }),
    
    description: Joi.string()
      .max(500)
      .allow('')
      .messages({
        'string.max': '專案描述不能超過 500 個字符'
      }),
    
    startDate: Joi.date()
      .iso()
      .required()
      .messages({
        'date.format': '開始日期格式無效',
        'any.required': '開始日期為必填項'
      }),
    
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.format': '結束日期格式無效',
        'date.greater': '結束日期必須晚於開始日期',
        'any.required': '結束日期為必填項'
      }),
    
    status: Joi.string()
      .valid('planning', 'active', 'completed', 'archived')
      .default('planning')
      .messages({
        'any.only': '專案狀態必須是 planning, active, completed 或 archived'
      })
  }),
  
  update: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': '專案名稱至少需要 2 個字符',
        'string.max': '專案名稱不能超過 100 個字符'
      }),
    
    description: Joi.string()
      .max(500)
      .allow('')
      .messages({
        'string.max': '專案描述不能超過 500 個字符'
      }),
    
    startDate: Joi.date()
      .iso()
      .messages({
        'date.format': '開始日期格式無效'
      }),
    
    endDate: Joi.date()
      .iso()
      .messages({
        'date.format': '結束日期格式無效'
      }),
    
    status: Joi.string()
      .valid('planning', 'active', 'completed', 'archived')
      .messages({
        'any.only': '專案狀態必須是 planning, active, completed 或 archived'
      })
  })
};

// 任務相關驗證
export const taskSchemas = {
  create: Joi.object({
    title: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': '任務標題至少需要 2 個字符',
        'string.max': '任務標題不能超過 200 個字符',
        'any.required': '任務標題為必填項',
        'string.empty': '任務標題不能為空'
      }),
    
    description: Joi.string()
      .max(1000)
      .allow('')
      .messages({
        'string.max': '任務描述不能超過 1000 個字符'
      }),
    
    projectId: commonRules.uuid,
    
    assigneeId: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.guid': '指派人 ID 格式無效'
      }),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .default('medium')
      .messages({
        'any.only': '優先級必須是 low, medium, high 或 urgent'
      }),
    
    status: Joi.string()
      .valid('todo', 'in_progress', 'review', 'completed')
      .default('todo')
      .messages({
        'any.only': '任務狀態必須是 todo, in_progress, review 或 completed'
      }),
    
    dueDate: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.format': '截止日期格式無效'
      }),
    
    estimatedHours: Joi.number()
      .min(0.5)
      .max(1000)
      .allow(null)
      .messages({
        'number.min': '預估工時至少 0.5 小時',
        'number.max': '預估工時不能超過 1000 小時'
      })
  }),
  
  update: Joi.object({
    title: Joi.string()
      .min(2)
      .max(200)
      .messages({
        'string.min': '任務標題至少需要 2 個字符',
        'string.max': '任務標題不能超過 200 個字符'
      }),
    
    description: Joi.string()
      .max(1000)
      .allow('')
      .messages({
        'string.max': '任務描述不能超過 1000 個字符'
      }),
    
    assigneeId: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.guid': '指派人 ID 格式無效'
      }),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'urgent')
      .messages({
        'any.only': '優先級必須是 low, medium, high 或 urgent'
      }),
    
    status: Joi.string()
      .valid('todo', 'in_progress', 'review', 'completed')
      .messages({
        'any.only': '任務狀態必須是 todo, in_progress, review 或 completed'
      }),
    
    dueDate: Joi.date()
      .iso()
      .allow(null)
      .messages({
        'date.format': '截止日期格式無效'
      }),
    
    estimatedHours: Joi.number()
      .min(0.5)
      .max(1000)
      .allow(null)
      .messages({
        'number.min': '預估工時至少 0.5 小時',
        'number.max': '預估工時不能超過 1000 小時'
      })
  })
};

// 用戶相關驗證
export const userSchemas = {
  updateProfile: Joi.object({
    name: commonRules.name,
    email: commonRules.email,
    phone: Joi.string()
      .pattern(new RegExp('^09[0-9]{8}$'))
      .allow(null)
      .messages({
        'string.pattern.base': '手機號碼格式無效，請輸入 09 開頭的 10 位數字'
      }),
    avatar: Joi.string()
      .uri()
      .allow(null)
      .messages({
        'string.uri': '頭像 URL 格式無效'
      }),
    timezone: Joi.string()
      .allow(null)
      .messages({
        'string.base': '時區格式無效'
      })
  }),
  
  updateRole: Joi.object({
    role: Joi.string()
      .valid('admin', 'manager', 'member', 'viewer')
      .required()
      .messages({
        'any.only': '角色必須是 admin, manager, member 或 viewer',
        'any.required': '角色為必填項'
      })
  })
};

// 查詢參數驗證
export const querySchemas = {
  pagination: Joi.object({
    page: commonRules.pagination.page,
    limit: commonRules.pagination.limit,
    search: Joi.string()
      .max(100)
      .allow('')
      .messages({
        'string.max': '搜尋關鍵字不能超過 100 個字符'
      }),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'name', 'status', 'priority')
      .default('createdAt')
      .messages({
        'any.only': '排序欄位無效'
      }),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': '排序順序必須是 asc 或 desc'
      }),
    status: Joi.string()
      .allow(null)
      .messages({
        'string.base': '狀態過濾條件無效'
      }),
    priority: Joi.string()
      .allow(null)
      .messages({
        'string.base': '優先級過濾條件無效'
      })
  })
};

// 驗證中間件函數
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // 返回所有錯誤
      stripUnknown: true, // 移除未知欄位
      convert: true // 自動類型轉換
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: '輸入驗證失敗',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

// 查詢參數驗證中間件
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: '查詢參數驗證失敗',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};

// 路由參數驗證中間件
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: '路由參數驗證失敗',
        details: errors
      });
    }

    req.params = value;
    next();
  };
};
