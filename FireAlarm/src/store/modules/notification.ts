export interface msgDataItem {
  id: number;
  content: string;
  type: string;
  status: boolean;
  collected: boolean;
  date: string;
  quality: string;
}

/*
  {
      id: '123',
      content: '腾讯大厦一楼改造施工项目 已通过审核！',
      type: '合同动态',
      status: true,
      collected: false,
      date: '2021-01-01 08:00',
      quality: 'high',
    },
    */
// 定义的state初始值
const state: { msgData: Array<msgDataItem> } = {
  msgData: [],
};

const mutations = {
  setMsgData(state, data) {
    // eslint-disable-next-line no-param-reassign
    state.msgData = data;
    console.log(state.msgData);
  },
};

const getters = {
  unreadMsg: (state) => state.msgData.filter((item) => !item.status),
  readMsg: (state) => state.msgData.filter((item) => item.status),
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
