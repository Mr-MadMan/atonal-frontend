import { resetRouter, asyncRouterList } from '@/router';

function filterPermissionsRouters(routes, role) {
  const res = [];
  routes.forEach((route) => {
    const children = [];
    route.children?.forEach((childRouter) => {
      const roleCode = childRouter.meta?.role || 'guest';
      if (roleCode.indexOf(role) != -1 || roleCode == 'guest') {
        children.push(childRouter);
      }
    });
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  return res;
}

const state = {
  whiteListRouters: ['/login'],
  routers: [],
};

const mutations = {
  setRouters: (state, routers) => {
    state.routers = routers;
  },
};

const getters = {
  routers: (state) => state.routers,
  whiteListRouters: (state) => state.whiteListRouters,
};

const actions = {
  async initRoutes({ commit }, role) {
    console.log("初始化路由信息...")
    let accessedRouters;
    accessedRouters = filterPermissionsRouters(asyncRouterList, role);
    commit('setRouters', accessedRouters);
  },
  async restore({ commit }) {
    resetRouter();
    commit('setRouters', []);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
