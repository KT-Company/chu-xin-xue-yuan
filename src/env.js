const CUS_ENV = {}

// 自定义环境变量
if (import.meta.env.DEV) {
  // 开发环境接口地址
  CUS_ENV.API1_URL = 'http://localhost:3000'
}
else {
  // 生产环境接口地址
  CUS_ENV.API1_URL = 'https://api1.example.com'
}

// 导出所有环境变量
export const env = {
  ...import.meta.env,
  ...CUS_ENV,
}

// 挂载到window对象使其全局可用
if (typeof window !== 'undefined') {
  window.__ENV = env
}
