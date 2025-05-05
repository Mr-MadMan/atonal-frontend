import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '个人中心', icon: 'user-circle', single: true },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { role: ['user', 'admin'] },
      },
    ],
  },
  {
    path: '/alarm',
    name: 'alarm',
    component: Layout,
    redirect: '/alarm/index',
    meta: { title: '视频流管理', icon: 'video-camera-3', single: true },
    children: [
      {
        path: 'index',
        name: 'alarmList',
        component: () => import('@/pages/alarm/index.vue'),
      },
    ],
  },
  {
    path: '/notice',
    name: 'notice',
    component: Layout,
    redirect: '/notice/msg',
    meta: { title: '事件管理', icon: 'calendar-event', single: true },
    children: [
      {
        path: 'msg',
        name: 'noticeMsg',
        component: () => import('@/pages/notice/msg.vue'),
      },
    ],
  },
  {
    path: '/account',
    name: 'account',
    component: Layout,
    redirect: '/account/index',
    meta: { title: '人员管理', icon: 'user', single: true },
    children: [
      {
        path: 'index',
        name: 'accountList',
        component: () => import('@/pages/account/index.vue'),
        meta: { role: ['admin'] },
      },
    ],
  },
];
