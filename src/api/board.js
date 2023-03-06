import { request } from '@/request/axios'



export function getType(data) {
  return request('/getTypeList', data, 'get',)
}