import axios from 'axios'
import proxy from '../config/host'
import { TOKEN_NAME } from '@/config/global'

const env = import.meta.env.MODE || 'dev'

console.log('env', env)

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: [0, 200],
  REQUEST_FOBID: 1001
}

const instance = axios.create({
  baseURL: proxy[env].API,
  timeout: 10000,
  withCredentials: false
})

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3

instance.interceptors.request.use((config) => {
  config.headers['session-id'] = localStorage.getItem(TOKEN_NAME) || ''
  return config
})

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { data } = response
      if (CODE.REQUEST_SUCCESS.includes(data.code)) {
        return data.data
      }
      console.error('请求失败')
      return Promise.reject(data)
    }
  },
  (err) => {
    const { config } = err

    if (!config || !config.retry) {
      return Promise.reject(err)
    }

    config.retryCount = config.retryCount || 0

    if (config.retryCount >= config.retry) {
      return Promise.reject(err)
    }

    config.retryCount += 1

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({})
      }, config.retryDelay || 1)
    })

    return backoff.then(() => instance(config))
  }
)

export default instance
