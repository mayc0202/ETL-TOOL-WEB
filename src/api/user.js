import http from '@/api/http'

// const Prefix = '/user'

/**
 * login
 * @param {*} username
 * @param {*} password
 * @returns
 */
export function login(username, password) {
  return http.post(
    '/user/login.do',
    {
      'username': username,
      'password': password
    })
}

export function getInfo(token) {
  return http.get({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return http.get({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
