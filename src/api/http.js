import service from '@/utils/request'

/**
 * HTTP请求工具类
 * 提供统一的API请求方法，支持自动处理不同请求类型的参数传递
 */
const http = {
  /**
   * 基础请求方法
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求Promise
   */
  _request(config) {
    // 合并默认配置
    const baseConfig = {
      upload: false,
      headers: {}
    }
    return service({ ...baseConfig, ...config })
  },

  /**
   * GET请求
   * @param {string} url - 请求地址
   * @param {Object} [params] - 查询参数
   * @returns {Promise} 请求Promise
   */
  get(url, params) {
    return this._request({
      method: 'get',
      url,
      params
    })
  },

  /**
   * POST请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求体数据
   * @returns {Promise} 请求Promise
   */
  post(url, data) {
    return this._request({
      method: 'post',
      url,
      data
    })
  },

  /**
   * PUT请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求体数据
   * @returns {Promise} 请求Promise
   */
  put(url, data) {
    return this._request({
      method: 'put',
      url,
      data
    })
  },

  /**
   * DELETE请求
   * @param {string} url - 请求地址
   * @param {Object} [params] - 查询参数（URL参数）
   * @param {Object} [data] - 请求体数据（可选）
   * @returns {Promise} 请求Promise
   */
  delete(url, { params, data } = {}) {
    return this._request({
      method: 'delete',
      url,
      params,
      data
    })
  },

  /**
   * 文件上传（通用方法）
   * @param {string} url - 上传地址
   * @param {FormData} formData - 包含文件的FormData对象
   * @param {Object} [config] - 额外配置项
   * @returns {Promise} 上传请求Promise
   */
  uploadFile(url, formData, config = {}) {
    return this._request({
      method: 'post',
      url,
      data: formData,
      upload: true, // 触发上传处理逻辑
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
      ...config
    })
  },

  /**
   * 专用头像上传（基于通用文件上传的封装）
   * @param {string} url - 上传地址
   * @param {FormData} formData - 包含头像文件的FormData
   * @returns {Promise} 上传请求Promise
   */
  uploadAvatar(url, formData) {
    return this.uploadFile(url, formData, {
      headers: {
        'X-File-Type': 'avatar'
      }
    })
  }
}

export default http
