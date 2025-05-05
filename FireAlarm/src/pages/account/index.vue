<template>
  <div class="account-container">
    <t-card>
      <div class="operation-container">
        <t-form layout="inline" @submit="handleSearch">
          <t-form-item label="角色">
            <t-select v-model="searchParams.role" placeholder="请选择角色" clearable style="width: 150px">
              <t-option v-for="item in roleOptions" :key="item.value" :value="item.value" :label="item.label" />
            </t-select>
          </t-form-item>
          <t-form-item label="姓名">
            <t-input v-model="searchParams.realname" placeholder="请输入姓名" clearable />
          </t-form-item>
          <t-form-item label="电话">
            <t-input v-model="searchParams.telphone" placeholder="请输入电话" clearable />
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button style="margin-left: 16px" variant="outline" @click="handleReset">重置</t-button>
          </t-form-item>
        </t-form>
      </div>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #role="{ row }">
          {{ roleMap[row.role] || row.role }}
        </template>
        <template #operation="{ row }">
          <t-link theme="primary" hover="color" @click="handleEdit(row)"> <t-icon name="edit" /> 编辑 </t-link>
        </template>
      </t-table>
    </t-card>

    <user-info
      v-if="currentUser"
      :user_id="currentUser"
      :edit="true"
      :visible="showUserInfo"
      @success="handleUserInfoSuccess"
      @close="handleUserInfoCancel"
    />
  </div>
</template>

<script>
import { api_account_query } from '@/api/account.js';
import dayjs from 'dayjs';
import UserInfo from './components/user_info.vue';

export default {
  name: 'Account',
  components: {
    UserInfo,
  },

  data() {
    return {
      showUserInfo: false,
      currentUser: null,
      roleMap: {
        user: '值班员',
        admin: '管理员',
      },
      roleOptions: [
        { value: 'user', label: '值班员' },
        { value: 'admin', label: '管理员' },
      ],
      searchParams: {
        role: '',
        realname: '',
        telphone: '',
      },
      columns: [
        { colKey: 'id', title: 'ID', width: 200 },
        { colKey: 'username', title: '用户名', width: 150 },
        { colKey: 'realname', title: '姓名', width: 150 },
        { colKey: 'telphone', title: '电话', width: 150 },
        { colKey: 'role', title: '角色', width: 100 },
        {
          colKey: 'create_time',
          title: '创建时间',
          width: 180,
          cell: (h, { row }) => dayjs(row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        },
        { colKey: 'operation', title: '操作', width: 150 },
      ],
      tableData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.fetchAccountList();
  },
  methods: {
    async fetchAccountList() {
      this.loading = true;
      try {
        const params = {
          ...this.searchParams,
          page: this.pagination.current,
          row: this.pagination.pageSize,
        };
        const res = await api_account_query(params);
        this.pagination.total = res.data.total;
        this.pagination.current = res.data.page;
        this.tableData = res.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchAccountList();
    },
    handleSearch() {
      this.pagination.current = 1;
      this.fetchAccountList();
    },
    handleReset() {
      this.searchParams = {
        role: '',
        realname: '',
        telphone: '',
      };
      this.pagination.current = 1;
      this.fetchAccountList();
    },
    handleEdit(row) {
      this.currentUser = row.id;
      this.showUserInfo = true;
    },
    handleUserInfoSuccess() {
      this.showUserInfo = false;
      this.fetchAccountList();
    },
    handleUserInfoCancel() {
      console.log(111);

      this.showUserInfo = false;
    },
    async handleDelete(row) {
      try {
        // 假设有api_account_delete方法
        // await api_account_delete(row.id);
        this.$message.success('删除成功');
        this.fetchAccountList();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
  },
};
</script>

<style scoped>
.account-container {
  padding: 20px;
}
.operation-container {
  margin-bottom: 20px;
}
</style>
