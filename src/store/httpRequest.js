import axios from 'axios'
import storage from "./index";
import router from "../router";
import { Message } from 'element-ui'

// create an axios instance
// const axios = axios.create({
//   baseURL: this.$baseUrl, // url = base url + request url
//   timeout: 5000 // request timeout
// })

function refreshToken(refresh_token) {
  return axios.get("http://localhost:9999/refresh", refresh_token);
}

axios.defaults.baseURL = 'http://localhost:9999/';

axios.defaults.headers.get['Content-Type'] = 'application/javascript; charset=UTF-8'

axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN'
// 添加请求拦截器，若token存在则在请求头中加token，不存在也继续请求
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器,没有则不带token
    // Authorization是必须的
    let tokenInfo = storage.get('Authorization')
    // const token = tokenInfo ? tokenInfo.accessToken : null
    if (tokenInfo != null) {
      config.headers.Authorization = tokenInfo
      config.headers.refresh_token = storage.get('refresh_token')
    }
    console.log(config)
    return config
  },
  error => {
    console.log('在request拦截器检查到错误：', error.response)
    return Promise.reject(error)
  }
)

// respone拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code !== undefined && response.data.code !== 0){
      Message({
        message: response.data.code + ":" + response.data.description,
        type: 'error'
      })
    }
    return response
  },
  error => {
    // 在status不正确的情况下，判别status状态码给出对应响应
    if (error.response) {
      console.log('在respone拦截器检查到错误：')
      switch (error.response.status) {
        case 204:
          Message({
            message: '204:No Content（没有内容）',
            type: 'error'
          })
          error.response.data.error = '204:No Content（没有内容）'
          break
        case 401:
          Message({
            message: '401:Unauthorized（未经授权）',
            type: 'error'
          })
          // 可能是token过期，清除它
          storage.remove('Authorization')
          router.replace({
            path: '/login'
          }).then(r => console.log(r))
          location.reload() // 刷新页面，触发路由守卫
          error.response.data.error = '401:Unauthorized（未经授权）'
          break
        case 403:
          Message({
            message: '403:Forbidden（被禁止的）',
            type: 'error'
          })
          error.response.data.error = '403:Forbidden（被禁止的）'
          break
        case 500:
          Message({
            message: '500:服务器内部错误',
            type: 'error'
          })
          error.response.data.error = '500:服务器内部错误'
          break
        default:
          return error
      }
      return Promise.reject(error.response.data.error)
    }

    return Promise.reject(error)
  }
)

export default axios


