
import store from '@/store'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 自动使用.env.development中的配置
  timeout: 5000
})

// HTTP状态码错误映射
const httpErrorMap = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求资源未找到',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

// 统一错误状态码
const SYSTEM_ERROE = '999999'

// 请求拦截器
service.interceptors.request.use(config => {
  // 非文件上传请求处理
  if (!config.upload) {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.data = JSON.stringify(config.data)
  }

  // 添加令牌
  if (store.getters.token) {
    config.headers['X-Token'] = getToken()
  }

  return config
}, error => {
  console.error('请求异常:', error)
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 处理会话过期等业务状态码
    if ([50008, 50012, 50014].includes(res.code)) {
      handleSessionExpired()
      return Promise.reject(new Error(res.message || '会话失效'))
    }

    // 处理其他业务错误
    if (res.code === SYSTEM_ERROE) {
      Message.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res // 返回核心数据
  },
  error => {
    // 网络错误处理
    if (!error.response) {
      handleNetworkError(error)
      return Promise.reject(error)
    }

    // HTTP状态码错误处理
    const status = error.response.status
    const message = httpErrorMap[status] || `请求错误 (${status})`

    // 特殊状态码处理
    if (status === 401) {
      handleUnauthorized()
    } else {
      Message.error(message)
    }

    return Promise.reject(new Error(message))
  }
)

/* 工具函数 */
// 处理会话过期
function handleSessionExpired() {
  MessageBox.confirm('Login status has expired, please log in again!', 'system prompt', {
    confirmButtonText: 'Log in again',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    store.dispatch('asyncResetToken').then(() => {
      location.reload()
    })
  })
}

// 处理网络异常
function handleNetworkError(error) {
  if (error.message.includes('timeout')) {
    Message.warning('Request timeout, please check network connection!')
  } else {
    Message.error('Network abnormality, please check the network connection!')
  }
}

// 处理未授权
function handleUnauthorized() {
  MessageBox.confirm('The current session has expired, please log in again!', 'prompt', {
    confirmButtonText: 'Log in again',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    store.dispatch('asyncResetToken').then(() => {
      location.reload()
    })
  })
}

export default service

