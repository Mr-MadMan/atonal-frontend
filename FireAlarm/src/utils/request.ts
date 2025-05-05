import axios from 'axios';
import proxy from '../config/host';
import store from '@/store';
import { MessagePlugin } from 'tdesign-vue';
import router from '@/router';

const env = import.meta.env.MODE || 'development';

const API_HOST = env === 'mock' ? '/' : proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
};

const instance = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  withCredentials: false,
});

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3;

instance.interceptors.request.use((config) => {
  const token = store.getters['user/token'];
  if (token) {
    config.headers['session-id'] = token;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
  },
  (err) => {
    if (err.response && err.response.status === 403) {
      MessagePlugin.error("会话过期,请重新登录");
      router.push("/login");
      return Promise.reject(err);
    }

    const { config } = err;
    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.retryCount += 1;
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);

export default instance;