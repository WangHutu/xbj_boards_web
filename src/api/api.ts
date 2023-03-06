import { request } from '@/request/axios'
/**
 * @description - 封装User类型的接口方法
 */
export class UserService {
    /**
     * @description 用户登录
     * @return {HttpResponse} result
     */
    static async userLoginApi(params:any) {   // 接口一
        return request('/login',params, 'post')
    }
    static async userRegisterApi(params:any) {   // 接口二
        return request('/register',params, 'post')
    }
}

export class Boards {
    /**
     * @description 获取地列表
     * @return {HttpResponse} result
     */
    static async getTypeList(params:any) {
        return request('/getTypeList',params, 'get')
    }
}