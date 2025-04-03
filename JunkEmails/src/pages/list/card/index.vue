<template>
  <div class="list-card">
    <!-- 搜索区域 -->
    <div class="list-card-operation">
      <t-button @click="openCreateUserDialog">创建用户</t-button>
    </div>
    <!-- 卡片列表 -->
    <template v-if="pagination.total > 0 && !dataLoading">
      <div class="list-card-items">
        <t-row :gutter="[16, 16]">
          <t-col
            :lg="4"
            :xs="6"
            :xl="3"
            v-for="product in userList.slice(
              pagination.pageSize * (pagination.current - 1),
              pagination.pageSize * pagination.current,
            )"
            :key="product.index"
          >
            <user-card :user-info="product" @delete-user="handleDeleteItem" @manage-user="handleManageUser" />
          </t-col>
        </t-row>
      </div>
      <div class="list-card-pagination">
        <t-pagination
          v-model="pagination.current"
          :total="pagination.total"
          :pageSizeOptions="[10, 20, 30]"
          :page-size.sync="pagination.pageSize"
          @page-size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </template>
    <div v-else-if="dataLoading" class="list-card-loading">
      <t-loading text="加载中..."></t-loading>
    </div>
    <dialog-manage-user ref="manageUser" @submit="onSubmit" :is-edit="isEdit" />
    <!-- 删除操作弹窗 -->
    <t-dialog
      header="确认删除所选用户？"
      :body="confirmBody"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onDelCancel"
    >
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { prefix } from '@/config/global';
import UserCard from '@/components/user-card/index.vue';
import DialogManageUser from '@/pages/list/components/DialogManageUser.vue';

export default {
  name: 'ListCard',
  components: {
    UserCard,
    DialogManageUser,
  },
  data() {
    return {
      pagination: { current: 1, pageSize: 10, total: 0 },
      prefix,
      userList: [],
      value: 'first',
      rowKey: 'index',
      rowClassName: (rowKey) => `${rowKey}-class`,
      formVisible: false,
      textareaValue: '',
      rules: {
        name: [{ required: true, message: '请输入产品名称', type: 'error' }],
      },
      searchValue: '',
      confirmVisible: false, // 控制确认弹窗
      delUser: null,
      dataLoading: false,
      isEdit: false,
    };
  },
  computed: {
    confirmBody(): string {
      const { delUser } = this;
      return delUser ? `删除后，${delUser.username}的所有信息将被清空, 且无法恢复` : '';
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.dataLoading = true;
      this.$store
        .dispatch('userManagement/getUserList', {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
        })
        .then((res) => {
          this.userList = res.data;
          this.pagination = {
            ...this.pagination,
            total: res.total,
          };
        })
        .finally(() => {
          this.dataLoading = false;
        });
    },
    onPageSizeChange(size: number) {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
      this.getList();
    },
    onCurrentChange(current: number) {
      this.pagination.current = current;
      this.getList();
    },
    onSubmit() {
      this.getList();
    },
    handleDeleteItem(userInfo) {
      this.confirmVisible = true;
      this.delUser = userInfo;
    },
    async onConfirmDelete() {
      const { user_id } = this.delUser;
      await this.$store.dispatch('userManagement/deleteUser', user_id);
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.getList();
    },
    onDelCancel() {
      this.delUser = null;
    },
    handleManageUser(userInfo) {
      this.isEdit = true;
      this.$refs.manageUser.show(userInfo);
    },
    openCreateUserDialog() {
      this.isEdit = false;
      this.$refs.manageUser.show();
    },
  },
};
</script>
<style scoped lang="scss">
.list-card-operation {
  display: flex;
  justify-content: space-between;

  .search-input {
    width: 360px;
  }
}

.list-card-loading {
  margin-top: 20px;
}

.list-card-items {
  margin: 14px 0 24px 0;
}
</style>
