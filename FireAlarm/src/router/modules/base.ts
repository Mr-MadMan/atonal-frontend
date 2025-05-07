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
    redirect: '/notice/events',
    meta: { title: '事件管理', icon: 'system-log', single: true },
    children: [
      {
        path: 'events',
        name: 'noticeEvents',
        component: () => import('@/pages/notice/events.vue'),
      },
    ],
  },
  {
    path: '/msg',
    name: 'msg',
    component: Layout,
    redirect: '/msg/index',
    meta: { title: '消息管理', icon: 'chat-message', single: true },
    children: [
      {
        path: 'index',
        name: 'msgList',
        component: () => import('@/pages/notice/index.vue'),
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
