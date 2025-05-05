<template>
  <div class="account-container">
    <t-card>
      <div class="operation-container">
        <t-form layout="inline" @submit="handleSearch">
          <t-form-item label="姓名">
            <t-input v-model="searchParams.realname" placeholder="请输入姓名" clearable />
          </t-form-item>
          <t-form-item label="电话">
            <t-input v-model="searchParams.telphone" placeholder="请输入电话" clearable />
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button style="margin-left: 16px" variant="outline" @click="handleReset"
              >重置</t-button
            >
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
          <t-link theme="primary" hover="color" @click="handleEdit(row)">
            <t-icon name="edit" /> 编辑
          </t-link>
        </template>
      </t-table>
    </t-card>

    <UserInfo
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
import { api_link } from "@/api/link.js";
import dayjs from "dayjs";
import UserInfo from "../account/components/user_info.vue";

export default {
  name: "Account",
  components: {
    UserInfo,
  },

  data() {
    return {
      showUserInfo: false,
      currentUser: null,
      roleMap: {
        user: "病人",
        doctor: "医生",
        nurse: "护士",
        admin: "院长",
      },
      roleOptions: [
        { value: "user", label: "病人" },
        { value: "doctor", label: "医生" },
        { value: "nurse", label: "护士" },
        { value: "admin", label: "院长" },
      ],
      searchParams: {
        realname: "",
        telphone: "",
      },
      columns: [
        { colKey: "id", title: "ID", width: 200 },
        { colKey: "username", title: "用户名", width: 150 },
        { colKey: "realname", title: "姓名", width: 150 },
        { colKey: "telphone", title: "电话", width: 150 },
        { colKey: "role", title: "角色", width: 100 },
        {
          colKey: "create_time",
          title: "创建时间",
          width: 180,
          cell: (h, { row }) => {
            return dayjs(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          },
        },
        { colKey: "operation", title: "操作", width: 150 },
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
        const res = await api_link(params);
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
        realname: "",
        telphone: "",
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
      this.showUserInfo = false;
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
