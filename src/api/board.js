import request from './request'

export function getType(data) {
  console.log(data, 'parmas')
  return request({
    url: '/getTypeList',
    method: 'post',
    data
  })
}

// import NewAxios from './axios'
// let Axios = new NewAxios('')
// export default (Axios: any): any => {
//   return {
//     getType(data: any) {
//       return Axios.GetByBody('/getTypeList', data).then((res: any) => {
//         return res.data
//       })
//     }
//   }
// }
