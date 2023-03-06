import request from './request'

export function userLoginApi(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function userRegisterApi(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
