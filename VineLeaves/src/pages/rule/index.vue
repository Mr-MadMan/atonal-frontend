<template>
  <div class="rule">
    <div class="rule-operation">
      <t-button @click="openCreateRuleDialog">创建规则</t-button>
    </div>
    <t-table
      class="rule-table"
      row-key="index"
      :columns="columns"
      :data="ruleData"
      :loading="loading"
      lazyLoad
      bordered
      dragSort="row-handler"
      @drag-sort="onDragSort"
    >
      <template #operation="{ row }">
        <t-link theme="primary" hover="color" @click="openEditRuleDialog(row)"> 编辑 </t-link>
        <t-link theme="danger" hover="color" @click="handleDeleteItem(row)"> 删除 </t-link>
      </template>
    </t-table>
    <div class="list-card-pagination">
      <t-pagination
        v-model="pagination.page"
        :total="pagination.total"
        :pageSizeOptions="[10, 20, 30]"
        :page-size.sync="pagination.pageSize"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />
    </div>

    <dialog-manage-rule ref="manageRule" @submit="onSubmit" :is-edit="isEdit" />

    <!-- 删除操作弹窗 -->
    <t-dialog header="确认删除所选规则？" :visible.sync="delVisible" @confirm="onConfirmDelete" :onCancel="onDelCancel">
    </t-dialog>
  </div>
</template>

<script lang="tsx">
import { MoveIcon } from 'tdesign-icons-vue';
import { mapActions } from 'vuex';
import DialogManageRule from './components/DialogManageRule.vue';
import dayjs from 'dayjs';

const contentMap = {
  body: '邮件内容',
  title: '邮件标题',
  all: '邮件内容和标题',
};

const actionMap = {
  ham: '正常邮件',
  spam: '垃圾邮件',
};

const initialColumns = [
  {
    colKey: 'drag', // 列拖拽排序必要参数
    title: '排序',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h) => (
      <span>
        <MoveIcon />
      </span>
    ),
    width: 46,
  },
  { colKey: 'id', title: 'ID', width: 50 },
  {
    colKey: 'content',
    title: '规则内容',
    ellipsis: true,
    cell: (h, data) => contentMap[data.row.content],
  },
  { colKey: 'keyword', title: '关键词', ellipsis: true },
  { colKey: 'action', title: '行为', ellipsis: true, cell: (h, data) => actionMap[data.row.action] },
  {
    colKey: 'create_time',
    title: '创建时间',
    cell: (h, data) => dayjs(data.row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    colKey: 'update_time',
    title: '更新时间',
    cell: (h, data) => (data.row.update_time ? dayjs(data.row.update_time * 1000).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  { colKey: 'operation', title: '操作', width: 120 },
];

export default {
  name: 'Rule',
  components: {
    DialogManageRule,
  },
  data() {
    return {
      loading: false,
      ruleData: [],
      columns: [...initialColumns],
      pagination: { page: 1, pageSize: 10, total: 0 },
      isEdit: false,
      delVisible: false,
      delRule: null,
    };
  },
  mounted() {
    this.getRuleList();
  },
  methods: {
    ...mapActions(['rule/getRuleList', 'rule/deleteRule', 'rule/moveRule']),
    getRuleList() {
      this.loading = true;
      this['rule/getRuleList']({
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          this.ruleData = res.data;
          this.pagination.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDragSort(params) {
      console.log('交换行', params);
      this['rule/moveRule']({
        id: params.current.id,
        sort_id: params.target.sort_id,
      });
      // this.ruleData = params.newData;
    },
    onPageSizeChange(size: number) {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
      this.getRuleList();
    },
    onCurrentChange(current: number) {
      this.pagination.current = current;
      this.getRuleList();
    },
    openCreateRuleDialog() {
      this.isEdit = false;
      this.$refs.manageRule.show();
    },
    onSubmit() {
      this.getRuleList();
    },
    openEditRuleDialog(row) {
      this.isEdit = true;
      this.$refs.manageRule.show(row);
    },
    handleDeleteItem(row) {
      this.delVisible = true;
      this.delRule = row;
    },
    async onConfirmDelete() {
      const { id } = this.delRule;
      await this['rule/deleteRule'](id);
      this.delVisible = false;
      this.$message.success('删除成功');
      this.getRuleList();
    },
    onDelCancel() {
      this.delRule = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.rule-table {
  margin-bottom: 15px;
}

.rule-operation {
  margin-bottom: 15px;
}
</style>
