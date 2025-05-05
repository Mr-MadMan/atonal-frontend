import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import store from '@/store';
import router from '@/router';
import { api_user_login_out } from './api/user';
NProgress.configure({ showSpinner: false });
import webSocketService from '@/utils/websocket';

const whiteListRouters = store.getters['permission/whiteListRouters'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = store.getters['user/token'];
  if (token) {
    // 如果访问的是登录页面 
    // 退出登录 并清空权限
    if (to.path === '/login') {
      setTimeout(async() => {
        await api_user_login_out();
        await store.commit('user/removeToken');
        store.dispatch('permission/restore');
      });
      next();
      return;
    }
    if(!window.websocket){
       console.log("websocket 会话没有初始化");
       webSocketService.init();
       window.websocket = webSocketService;

    }
    const role = store.getters['user/role'];
    console.log("当前用户的角色为:" + role)
    await store.dispatch('permission/initRoutes', role);
    if (role) {
      next();
    } else {
        await api_user_login_out();
        await store.commit('user/removeToken');
        next(`/login?redirect=${to.path}`);
        NProgress.done();
    }
   
     console.log("会话的token",token)
  } else {
    console.log("没有拿到token 信息")
    if (whiteListRouters.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
    NProgress.done();
  }
});


router.afterEach(() => {
  NProgress.done();
});
