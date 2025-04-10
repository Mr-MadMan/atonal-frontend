import { TOKEN_NAME } from '@/config/global';
import request from '@/utils/request';

const InitUserInfo = {
  user: {
    isAdmin: false,
    nickname: '',
    username: '',
    user_id: '',
    session_id: '',
    roles: [],
  },
};

interface LoginResponse {
  code: number;
  data: {
    session_id: string;
    user_id: number;
    msg: string;
  };
  msg: string;
}

interface UserInfoResponse {
  code: number;
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
  msg: string;
}

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || '', // 默认token不走权限
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
  userInfo: (state) => state.userInfo,
};

const actions = {
  async login({ commit }, userInfo) {
    const res = await request.post<any, LoginResponse>('/api/user/login', {
      ...userInfo,
    });

    if (res?.code === 0) {
      commit('setToken', res.data.session_id);
    }
  },
  async getUserInfo({ commit, state }) {
    try {
      const res = await request.get<any, UserInfoResponse>(`/api/user`, {
        // headers: {
        //   'session-id': state.token,
        // },
      });

      if (res.code === 0) {
        const currUser = res.data.user;
        const roles = currUser.is_admin ? ['ALL_ROUTERS'] : ['UserIndex', 'Login', 'AnalysisIndex', 'TreatmentIndex'];
        Object.assign(currUser, { roles });
        commit('setUserInfo', currUser);
        return roles;
      }
    } catch (error) {
      throw new Error('获取用户信息失败');
    }
  },
  async logout({ commit }) {
    try {
      const res = await request.delete<any, LoginResponse>(`/api/user`, {
        // headers: {
        //   'session-id': state.token,
        // },
      });
      if (res.code === 0) {
        commit('removeToken');
        commit('setUserInfo', InitUserInfo);
      }
    } catch (error) {
      throw new Error('退出失败');
    }
  },
  async changePassword({ commit }, data) {
    const { nickname, old_password, new_password } = data;
    try {
      const res = await request.post<any, LoginResponse>(
        '/api/user',
        {
          nickname,
          old_password,
          new_password,
        },
        // {
        //   headers: {
        //     'session-id': state.token,
        //   },
        // },
      );
      if (res.code === 0) {
        commit('removeToken');
        commit('setUserInfo', InitUserInfo);
      }
    } catch (error) {
      throw new Error('修改密码失败');
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
