import { TOKEN_NAME,SESSION_NAME } from '@/config/global';

const InitUserInfo = {
  role: "",
};

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || null,
  userInfo: JSON.parse(localStorage.getItem(SESSION_NAME)) || InitUserInfo,
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
    console.info("写入用户的session",userInfo)
    state.userInfo = userInfo;
    localStorage.setItem(SESSION_NAME,JSON.stringify(userInfo))
  },

};

const getters = {
  token: (state) => state.token,
  role: (state) => state.userInfo?.role,
  userInfo:(state)=>state.userInfo
};



export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
