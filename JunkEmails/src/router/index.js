import VueRouter from 'vue-router';

import baseRouters from './modules/base';
import componentsRouters from './modules/components';
import othersRouters from './modules/others';

const env = import.meta.env.MODE || 'dev';

// 存放动态路由
export const asyncRouterList = [...baseRouters, ...componentsRouters, ...othersRouters];

// 存放固定的路由
const defaultRouterList = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
  },
  // 登录成功重定向路由
  {
    path: '/',
    redirect: '/dashboard/base',
  },
  ...asyncRouterList,
  {
    path: '/404',
    name: 'Result404',
    component: () => import('@/pages/result/404/index.vue'),
    meta: { title: '访问页面不存在页' },
  },
  // 如果没有匹配到路由，则重定向到404页面
  { path: '*', redirect: '/404' },
];

const createRouter = () =>
  new VueRouter({
    mode: 'history',
    /**
     * 当你的应用部署在子目录时：
      例如你的应用部署在 https://example.com/my-app/
      可以设置 base: '/my-app/'
    */
    base: env === 'prod' ? '/web/' : null,
    routes: defaultRouterList,
    scrollBehavior() {
      return { x: 0, y: 0 };
    },
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
