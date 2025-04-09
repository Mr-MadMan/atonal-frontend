import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import notification from './modules/notification';
import setting from './modules/setting';
import permission from './modules/permission';
import tabRouter from './modules/tabRouter'; // 多标签管理
import userManagement from './modules/userManagement';
import rule from './modules/rule';
import system from './modules/system';
import treatment from './modules/treatment';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: import.meta.env.MODE === 'prod',
  modules: {
    user,
    userManagement,
    setting,
    notification,
    permission,
    tabRouter,
    rule,
    system,
    treatment,
  },
});

export default store;
