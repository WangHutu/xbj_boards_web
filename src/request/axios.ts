import axios from 'axios'
import { showMessage } from './status' // 引入状态码文件
import { ElMessage } from 'element-plus' // 引入el 提示框，这个项目里用什么组件库这里引什么
// import { LocalVue } from '@/common/utils'
// import { useRouter } from 'vue-router'

// const router = useRouter()

// 设置接口超时时间
axios.defaults.timeout = 60000

// 请求地址，这里是动态赋值的的环境变量，下一篇会细讲，这里跳过
// @ts-ignore
axios.defaults.baseURL = '/api'

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    // const token = LocalVue.getLocal('Authorization')
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded' // 传参方式表单
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // if (!whiteUrls.includes(config.url)) {
    //   console.log('ihj')

    //   if (!token) {
    //     router.push('/login')
    //   } else {
    //     config.headers['Authorization'] = token
    //   }
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//http response 拦截器
axios.interceptors.response.use(
  (response:any) => {
    // console.log(response, 'response')
    if (typeof response.data !== 'object') {
      ElMessage.error('服务端异常！')
      return Promise.reject(response)
    }
    if (response.data.code != 200) {
      if(response.data.code == 205) {
        ElMessage.error("数据已存在")
      } else {
        ElMessage.error(showMessage(response.status)) // 传入响应码，匹配响应码对应信息
      }
      return Promise.reject(response.data)
    }
    if (response.data.message) ElMessage.success(response.data.message)
    return response.data
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// 封装 GET POST 请求并导出
export function request(url = '', params = {}, type = 'POST') {
  //设置 url params type 的默认值
  return new Promise((resolve, reject) => {
    let promise
    if (type.toUpperCase() === 'GET') {
      promise = axios({
        url,
        params
      })
    } else if (type.toUpperCase() === 'POST') {
      promise = axios({
        method: 'POST',
        url,
        data: params
      })
    }
    //处理返回
    promise
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
