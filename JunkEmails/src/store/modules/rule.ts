import { message } from 'tdesign-vue';
import request from '@/utils/request';
import { commonResponse } from '@/constants/types';
// 定义的state初始值
const state = {};

const mutations = {};

const getters = {};

const actions = {
  // 获取规则列表
  async getRuleList({ state }, { page = 1, pageSize = 10 }) {
    try {
      const res = await request.get<any, commonResponse>('/api/rule', {
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
  // 新增规则
  async addRule({ state }, ruleInfo: any) {
    try {
      const res = await request.post<any, commonResponse>('/api/rule', ruleInfo);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('新增规则失败');
      throw new Error(error);
    }
  },
  // 编辑用户
  async editRule({ state }, ruleInfo: any) {
    const ruleInfo_ = {
      ...ruleInfo,
    };
    try {
      const res = await request.post<any, commonResponse>(`/api/rule/${ruleInfo.rule_id}`, ruleInfo_);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('编辑规则失败');
      throw new Error(error);
    }
  },
  // 删除规则
  async deleteRule({ state }, ruleId: number) {
    try {
      const res = await request.delete<any, commonResponse>(`/api/rule/${ruleId}`);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('删除规则失败');
      throw new Error(error);
    }
  },
  // 移动规则排序
  async moveRule({ state }, { id, sort_id }) {
    try {
      const res = await request<any, commonResponse>({
        url: `/api/rule/${id}`,
        method: 'put',
        params: {
          to_sort_id: sort_id,
        },
      });
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('移动规则失败');
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
