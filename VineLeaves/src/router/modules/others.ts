import { ViewModuleIcon } from 'tdesign-icons-vue';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/analysis',
    name: 'Analysis',
    component: Layout,
    redirect: '/analysis/index',
    meta: { title: '智能分析', icon: ViewModuleIcon },
    children: [
      {
        path: 'index',
        name: 'AnalysisIndex',
        component: () => import('@/pages/analysis/index.vue'),
      },
    ],
  },
  {
    path: '/treatment',
    name: 'Treatment',
    component: Layout,
    redirect: '/treatment/index',
    meta: { title: '治疗方案', icon: ViewModuleIcon },
    children: [
      {
        path: 'index',
        name: 'TreatmentIndex',
        component: () => import('@/pages/treatment/index.vue'),
      },
    ],
  },
  // 三级菜单配置
  // {
  //   path: '/menu',
  //   name: 'menu',
  //   component: Layout,
  //   meta: { title: '一级菜单', icon: 'menu-fold' },
  //   children: [
  //     {
  //       path: 'second',
  //       meta: { title: '二级菜单' },
  //       component: () => import('@/layouts/blank.vue'),
  //       children: [
  //         {
  //           path: 'third',
  //           name: 'NestMenu',
  //           component: () => import('@/pages/nest-menu/index.vue'),
  //           meta: { title: '三级菜单' },
  //         },
  //       ],
  //     },
  //   ],
  // },
];
