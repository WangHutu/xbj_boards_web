// import axios
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { setLocal, getLocal } from '../common/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

// create axios
const request = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 8000 // 8s超时
})

const whiteUrls = ['/login']

// request interceptor
request.interceptors.request.use(
  (config) => {
    console.log(config, 'config')
    config.data = JSON.stringify(config.data)
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    let token = getLocal('Authorization')
    if (!whiteUrls.includes(config.url)) {
      if (!token) {
        router.push('/login')
      } else {
        config.headers['Authorization'] = token
      }
    }
    return config
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  (res) => {
    if (typeof res.data !== 'object') {
      ElMessage.error('服务端异常！')
      return Promise.reject(res)
    }
    if (res.data.code != 200) {
      if (res.data.message) ElMessage.error(res.data.message)
      // if (res.data.code == 416) {
      //     router.push({ path: '/login' })
      // }
      return Promise.reject(res.data)
    }
    if (res.data.message) ElMessage.success(res.data.message)
    return res.data
  },
  (error) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// export request
export default request
