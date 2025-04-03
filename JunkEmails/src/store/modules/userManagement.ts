import { message } from 'tdesign-vue';
import request from '@/utils/request';
import { commonResponse } from '@/constants/types';

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
const state = {};

const mutations = {};

const getters = {};

const actions = {
  // 获取用户列表
  async getUserList({ state }, { page = 1, pageSize = 10 }) {
    try {
      const res = await request.get<any, UserListResponse>('/api/account', {
        params: {
          page,
          pageSize,
        },
      });
      if (res.code === 0) {
        return res.data;
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  // 获取用户详情
  async getUserInfo({ state }, userId: number) {
    try {
      const res = await request.get<any, UserInfoResponse>(`/api/account/${userId}`);

      if (res.code === 0) {
        return res.data;
      }
    } catch (error) {
      message.error('获取用户信息失败');
      throw new Error(error);
    }
  },
  // 新增用户
  async addUser({ state }, userInfo: any) {
    try {
      const res = await request.post<any, UserInfoResponse>('/api/account', userInfo);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('新增用户失败');
      throw new Error(error);
    }
  },
  // 编辑用户
  async editUser({ state }, userInfo: any) {
    const { nickname, is_admin, user_id } = userInfo;
    const userInfo_ = { nickname, is_admin, password: '' };
    try {
      const res = await request.post<any, UserInfoResponse>(`/api/account/${user_id}`, userInfo_);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('编辑用户失败');
      throw new Error(error);
    }
  },
  // 删除用户
  async deleteUser({ state }, userId: number) {
    try {
      const res = await request.delete<any, UserInfoResponse>(`/api/account/${userId}`);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('删除用户失败');
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
