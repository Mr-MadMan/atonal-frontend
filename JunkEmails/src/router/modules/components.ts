import { ViewModuleIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/user-management',
    name: 'UserManagement',
    component: Layout,
    redirect: '/user-management/base',
    meta: { title: '用户管理', icon: ViewModuleIcon },
    children: [
      {
        path: 'base',
        name: 'UserList',
        component: () => import('@/pages/list/card/index.vue'),
        meta: { title: '用户列表' },
      },
    ],
  },
  {
    path: '/rule',
    name: 'Rule',
    component: Layout,
    redirect: '/rule/base',
    meta: { title: '规则引擎', icon: ViewModuleIcon },
    children: [
      {
        path: 'base',
        name: 'RuleList',
        component: () => import('@/pages/rule/index.vue'),
        meta: { title: '规则列表' },
      },
    ],
  },
  // {
  //   path: '/detail',
  //   name: 'detail',
  //   component: Layout,
  //   redirect: '/detail/base',
  //   meta: { title: '详情页', icon: LayersIcon },
  //   children: [
  //     {
  //       path: 'base',
  //       name: 'DetailBase',
  //       component: () => import('@/pages/detail/base/index.vue'),
  //       meta: { title: '基础详情页' },
  //     },
  //     {
  //       path: 'advanced',
  //       name: 'DetailAdvanced',
  //       component: () => import('@/pages/detail/advanced/index.vue'),
  //       meta: { title: '多卡片详情页' },
  //     },
  //     {
  //       path: 'deploy',
  //       name: 'DetailDeploy',
  //       component: () => import('@/pages/detail/deploy/index.vue'),
  //       meta: { title: '数据详情页' },
  //     },
  //     {
  //       path: 'secondary',
  //       name: 'DetailSecondary',
  //       component: () => import('@/pages/detail/secondary/index.vue'),
  //       meta: { title: '二级详情页' },
  //     },
  //   ],
  // },
  // {
  //   path: '/result',
  //   name: 'result',
  //   component: Layout,
  //   redirect: '/result/success',
  //   meta: { title: '结果页', icon: 'check-circle' },
  //   children: [
  //     {
  //       path: 'success',
  //       name: 'ResultSuccess',
  //       component: () => import('@/pages/result/success/index.vue'),
  //       meta: { title: '成功页' },
  //     },
  //     {
  //       path: 'fail',
  //       name: 'ResultFail',
  //       component: () => import('@/pages/result/fail/index.vue'),
  //       meta: { title: '失败页' },
  //     },
  //     {
  //       path: 'network-error',
  //       name: 'ResultNetworkError',
  //       component: () => import('@/pages/result/network-error/index.vue'),
  //       meta: { title: '网络异常' },
  //     },
  //     {
  //       path: '403',
  //       name: 'Result403',
  //       component: () => import('@/pages/result/403/index.vue'),
  //       meta: { title: '无权限' },
  //     },
  //     {
  //       path: '404',
  //       name: 'Result404',
  //       component: () => import('@/pages/result/404/index.vue'),
  //       meta: { title: '访问页面不存在页' },
  //     },
  //     {
  //       path: '500',
  //       name: 'Result500',
  //       component: () => import('@/pages/result/500/index.vue'),
  //       meta: { title: '服务器出错页' },
  //     },
  //     {
  //       path: 'browser-incompatible',
  //       name: 'ResultBrowserIncompatible',
  //       component: () => import('@/pages/result/browser-incompatible/index.vue'),
  //       meta: { title: '浏览器不兼容页' },
  //     },
  //     {
  //       path: 'maintenance',
  //       name: 'ResultMaintenance',
  //       component: () => import('@/pages/result/maintenance/index.vue'),
  //       meta: { title: '系统维护页' },
  //     },
  //   ],
  // },
];
