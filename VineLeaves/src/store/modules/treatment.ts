import { message } from 'tdesign-vue';
import request from '@/utils/request';
import { commonResponse } from '@/constants/types';
// 定义的state初始值
const state = {};

const mutations = {};

const getters = {};

const actions = {
  // 获取治疗方案列表
  async getTreatmentList({ state }, { page = 1, pageSize = 10 }) {
    try {
      const res = await request.get<any, commonResponse>('/api/treatment', {
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
  // 获取治疗方案详情
  async getTreatmentInfo({ state }, id: number) {
    try {
      const res = await request.get<any, commonResponse>(`/api/treatment/${id}`);

      if (res.code === 0) {
        return res.data;
      }
    } catch (error) {
      message.error('获取治疗方案详情失败');
      throw new Error(error);
    }
  },
  // 新增治疗方案
  async addTreatment({ state }, treatmentInfo: any) {
    try {
      const res = await request.post<any, commonResponse>('/api/treatment', treatmentInfo);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('新增治疗方案失败');
      throw new Error(error);
    }
  },
  // 编辑治疗方案
  async editTreatment({ state }, treatmentInfo: any) {
    const { id, treatment } = treatmentInfo;
    try {
      const res = await request.post<any, commonResponse>(`/api/treatment/${id}`, { treatment });
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('编辑治疗方案失败');
      throw new Error(error);
    }
  },
  // 删除治疗方案
  async deleteTreatment({ state }, id: number) {
    try {
      const res = await request.delete<any, commonResponse>(`/api/treatment/${id}`);
      if (res.code === 0) {
        return res.data;
      }
      return Promise.reject(res);
    } catch (error) {
      message.error('删除治疗方案失败');
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
