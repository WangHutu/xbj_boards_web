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

  // 查询类型列表
  static async getTypeList(params: any) {
    return request('/getTypeList', params, 'get')
  }

  // 增加类型列表
  static async insertTypeList(params: any) {
    return request('/insertTypeList', params, 'post')
  }

  // 修改类型列表
  static async updateTypeList(params: any) {
    return request('/updateTypeList', params, 'post')
  }

  // 删除类型列表
  static async delTypeList(params: any) {
    return request('/delTypeList', params, 'post')
  }

  // 查询板块信息列表
  static async getBoardList(params: any) {
    return request('/getBoardList', params, 'get')
  }

  // 增加板块信息列表
  static async insertBoardList(params: any) {
    return request('/insertBoardList', params, 'post')
  }

  // 修改板块信息列表
  static async updateBoardList(params: any) {
    return request('/updateBoardList', params, 'post')
  }

  // 删除板块信息列表
  static async delBoardList(params: any) {
    return request('/delBoardList', params, 'post')
  }

  // 占用板卡
  static async occBoard(params: any) {
    return request('/occBoard', params, 'post')
  }

  // 释放板卡
  static async reBoard(params: any) {
    return request('/reBoard', params, 'post')
  }

  // 查询日志列表
  static async getLogList(params: any) {
    return request('/getLogList', params, 'get')
  }
}
