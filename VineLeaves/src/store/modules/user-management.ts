import { TOKEN_NAME } from '@/config/global';
import request from '@/utils/request';

interface commonResponse {
  code: number;
  data: any;
  msg: string;
}

interface UserListResponse extends commonResponse {
  data: {
    session_id: string;
    user_id: number;
    msg: string;
  };
}

interface UserInfoResponse extends commonResponse {
  data: {
    session_id: string;
    user: {
      is_admin: boolean;
      nickname: string;
      username: string;
      user_id: string;
      roles: string[];
    };
  };
}

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || '', // 默认token不走权限
  userList: [],
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
  setUserList(state, userList) {
    state.userList = userList;
  },
};

const getters = {
  token: (state) => state.token,
  roles: (state) => state.userInfo?.roles,
};

const actions = {
  async getUserList({ state }, { page = 1, pageSize = 10 }) {
    try {
      const res = await request.get<any, UserListResponse>('/api/account', {
        params: {
          page,
          pageSize,
        },
        headers: {
          'session-id': state.token,
        },
      });
      if (res.code === 0) {
        return res.data;
      }
    } catch (error) {
      throw new Error('获取用户列表失败');
    }
  },
  async getUserInfo({ commit, state }) {
    try {
      const res = await request.get<any, UserInfoResponse>(`/api/user`, {
        headers: {
          'session-id': state.token,
        },
      });

      if (res.code === 0) {
        const currUser = res.data.user;
        const roles = currUser.is_admin ? ['ALL_ROUTERS'] : ['UserIndex', 'DashboardBase', 'login'];
        Object.assign(currUser, { roles });
        commit('setUserInfo', currUser);
        return roles;
      }
    } catch (error) {
      throw new Error('获取用户信息失败');
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
