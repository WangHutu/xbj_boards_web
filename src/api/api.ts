import { request } from '@/request/axios'
/**
 * @description - 封装User类型的接口方法
 */
export class UserService {
  /**
   * @description 用户登录
   * @return {HttpResponse} result
   */
  static async userLoginApi(params: any) {
    // 接口一
    return request('/login', params, 'post')
  }
  static async userRegisterApi(params: any) {
    // 接口二
    return request('/register', params, 'post')
  }
}

export class Boards {
  /**
   * @description 获取地列表
   * @return {HttpResponse} result
   */
  static async getTypeList(params: any) {
    return request('/getTypeList', params, 'get')
  }

  static async insertTypeList(params: any) {
    return request('/insertTypeList', params, 'post')
  }

  static async updateTypeList(params: any) {
    return request('/updateTypeList', params, 'post')
  }

  static async delTypeList(params: any) {
    return request('/delTypeList', params, 'post')
  }

  static async getBoardList(params: any) {
    return request('/getBoardList', params, 'get')
  }

  static async insertBoardList(params: any) {
    return request('/insertBoardList', params, 'post')
  }

  static async updateBoardList(params: any) {
    return request('/updateBoardList', params, 'post')
  }

  static async delBoardList(params: any) {
    return request('/delBoardList', params, 'post')
  }

  static async getLogList(params: any) {
    return request('/getLogList', params, 'get')
  }
}
