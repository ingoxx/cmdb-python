import axios from 'axios'
import baseUrl from './baseUrl'
//import router from '@/router'
import { Message } from 'element-ui'
import qs, {stringify} from 'qs'
import { EventBus } from './eventBus';
//import Nprogress from "nprogress"

// 创建axios实例
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 600000//跟服务器同步 600s
});

// 异步请求
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 请求拦截器
instance.interceptors.request.use(config => {
  // 请求拦截逻辑写在这里
  return Promise.resolve(config)
}, error => {
  Message.error({ message: error || '请求出错' });
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(config => {
  // 响应拦截逻辑写在这里, 因为跨域问题当捕获到异常时，浏览器无法获取异常的状态码，所以下面的状态码是后台自己定义返回的
  switch (config.data.status) {
    case 401:  // 登录失效
      Message.error({ message: config.data.msg });
      setTimeout(function () {
        sessionStorage.clear();
        window.location.href = '/';
      }, 3000);
      return Promise.reject(config.data.msg);
    case 403:  // 无权限访问
      Message.error({ message: config.data.msg });
      return Promise.reject(config.data.msg);
  }
  return Promise.resolve(config)
}, error => {
  Message.error({ message: `响应出错：${error.message}`,
    showClose: true,
    duration:60000
  });
  return Promise.reject(error)
});

// get方法封装
export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    if (params.token === undefined ||  params.user === undefined){
      params.token = sessionStorage.getItem('token');
      params.user = sessionStorage.getItem('user');
    }
    instance.get(url, {
      params
    }).then(res => {
      resolve(res)
    }).catch(error => {
      EventBus.$emit('updateData', { message: false });
      reject(error)
    })
  })
};

// get responseType: 'blob',方法封装
export const getBlob = (url, params) => {
  return new Promise((resolve, reject) => {
    if (params.token === undefined ||  params.user === undefined){
      params.token = sessionStorage.getItem('token');
      params.user = sessionStorage.getItem('user');
    }
    instance.get(url, {
      params
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
};

// post方法封装
export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    if (data.token === undefined ||  data.user === undefined){
      data.token = sessionStorage.getItem('token');
      data.user = sessionStorage.getItem('user');
    }
    instance.post(url, qs.stringify(data)).then(res => {
      resolve(res)
    }).catch(error => {
      EventBus.$emit('updateData', { message: false });
      reject(error)
    })
  })
};

export const postUpload = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
      instance.post(url, data, config).then(resp => {
          resolve(resp);
      }).catch(error => {
          Message.error(error+":无法连接服务器");
          // reject(error);
          return new Promise(() => {});
      })
  })
};

// post方法封装
export const post2 = (url, data) => {
  return new Promise((resolve, reject) => {
    instance.post(url, qs.stringify(data)).then(res => {
      resolve(res)
    }).catch(error => {
      EventBus.$emit('updateData', { message: false });
      reject(error)
    })
  })
};
