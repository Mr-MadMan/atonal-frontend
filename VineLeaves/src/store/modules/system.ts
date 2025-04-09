import { message } from 'tdesign-vue';
import request from '@/utils/request';
import { commonResponse } from '@/constants/types';
// 定义的state初始值
const state = {
  serverInfo: {},
  userStatistic: {},
};

const mutations = {};

const getters = {};

const actions = {
  // 获取当前服务器信息
  async getServerInfo({ state }) {
    try {
      const res = await request.get<any, commonResponse>('/api/system/server');
      if (res.code === 0) {
        state.serverInfo = res.data;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  // 获取用户统计信息
  async getUserStatistic({ state }) {
    try {
      const res = await request.get<any, commonResponse>('/api/system/user');
      if (res.code === 0) {
        state.userStatistic = res.data;
      }
    } catch (error) {
      throw new Error(error);
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
