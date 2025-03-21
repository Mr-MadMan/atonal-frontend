import { message } from 'tdesign-vue';
import { TOKEN_NAME } from '@/config/global';
import request from '@/utils/request';

const InitUserInfo = {
  roles: [],
};

interface LoginResponse {
  code: number;
  data: {
    session_id: string;
    user_id: number;
  };
  msg: string;
}

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
  userInfo: InitUserInfo,
};

const mutations = {
  setToken(state, token) {
    localStorage.setItem(TOKEN_NAME, token);
    state.token = token;
  },
  removeToken(state) {
    localStorage.removeItem(TOKEN_NAME);
    state.token = '';
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};

const getters = {
  token: (state) => state.token,
  roles: (state) => state.userInfo?.roles,
};

const actions = {
  async login({ commit }, userInfo) {
    try {
      const res = await request.post<any, LoginResponse>('/api/user/login', {
        ...userInfo,
      });
      if (res.code === 0) {
        commit('setToken', res.data.session_id);
      }
    } catch (error) {
      message.error('登录失败');
      throw new Error('登录失败');
    }
  },
  async getUserInfo({ commit, state }) {
    // const mockRemoteUserInfo = async (token) => {
    //   if (token === 'main_token') {
    //     return {
    //       name: 'td_main',
    //       roles: ['ALL_ROUTERS'],
    //     };
    //   }
    //   return {
    //     name: 'td_dev',
    //     roles: ['UserIndex', 'DashboardBase', 'login'],
    //   };
    // };

    // const res = await mockRemoteUserInfo(state.token);

    try {
      const res = await request.get<any, LoginResponse>(`/api/user/login?session-id=${state.token}`);
      if (res.code === 0) {
        commit('setUserInfo', res.data);
      }
    } catch (error) {
      // message.error('登录失败');
      throw new Error('获取用户信息失败');
    }
  },
  async logout({ commit }) {
    commit('removeToken');
    commit('setUserInfo', InitUserInfo);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
