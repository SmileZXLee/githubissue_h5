import axios from 'axios'
import { Message, Loading } from 'element-ui'
const baseURL = 'https://api.github.com'
let loadingInstance = null;
const Request = axios.create({
  timeout: 50000,
  baseURL: baseURL,
  method: 'get'
})

Request.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    lock: true,
    text: '加载中...'
  })
  return config;
})


Request.interceptors.response.use(response => {
  loadingInstance.close();
  return response.data;
}, error => {

  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3000
  })
  loadingInstance.close();
  return Promise.reject(error)
})
export default Request
