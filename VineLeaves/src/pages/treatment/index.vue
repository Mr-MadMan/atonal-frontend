<template>
  <div class="treatment-container">
    <div class="treatment-operation">
      <t-button @click="openCreateTreatmentDialog">创建治疗方案</t-button>
    </div>
    <!-- 卡片列表 -->
    <t-table bordered row-key="index" :data="treatmentsList" :columns="columns" :loading="dataLoading">
      <template #operation="{ row }">
        <t-link theme="primary" hover="color" @click="handleManageTreatment(row)"> 编辑 </t-link>
        <t-link theme="danger" hover="color" @click="handleDeleteItem(row)"> 删除 </t-link>
      </template>
    </t-table>
    <div class="list-pagination">
      <t-pagination
        v-model="pagination.current"
        :total="pagination.total"
        :pageSizeOptions="[10, 20, 30]"
        :page-size.sync="pagination.pageSize"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
    <dialog-manage-treatment ref="manageTreatment" @submit="onSubmit" :is-edit="isEdit" />
    <!-- 删除操作弹窗 -->
    <t-dialog
      header="确认删除所选方案？"
      :visible.sync="confirmVisible"
      @confirm="onConfirmDelete"
      :onCancel="onDelCancel"
    >
    </t-dialog>
  </div>
</template>
<script lang="tsx">
import { prefix } from '@/config/global';
import DialogManageTreatment from '@/pages/treatment/components/DialogManageTreatment.vue';
import { mapState, mapActions } from 'vuex';
import dayjs from 'dayjs';

const dieaseMap = {
  black_rot: '黑腐病',
  downey_mildew: '霜霉病',
  esca: '埃斯卡病',
  healthy: '健康',
  leaf_blight: '枯萎病',
};

export default {
  name: 'Treatment',
  components: {
    DialogManageTreatment,
  },
  data() {
    return {
      pagination: { current: 1, pageSize: 10, total: 0 },
      prefix,
      treatmentsList: [],
      confirmVisible: false, // 控制确认弹窗
      delTreatment: null,
      dataLoading: false,
      isEdit: false,
      columns: [
        { colKey: 'id', title: 'ID', width: '60' },
        {
          colKey: 'disease_name',
          title: '植株症状',
          ellipsis: true,
          cell: (h, data) => dieaseMap[data.row.disease_name],
        },
        { colKey: 'treatment', title: '治疗方案', ellipsis: true },
        {
          colKey: 'create_time',
          title: '创建时间',
          cell: (h, data) => dayjs(data.row.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          colKey: 'update_time',
          title: '更新时间',
          cell: (h, data) =>
            data.row.update_time ? dayjs(data.row.update_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
        },
        { colKey: 'operation', title: '操作', ellipsis: true },
      ],
    };
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {
    ...mapActions('treatment', ['getTreatmentList', 'deleteTreatment']),
    getList() {
      this.dataLoading = true;
      this.getTreatmentList({
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      })
        .then((res) => {
          this.treatmentsList = res.data;
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
      this.isEdit ? this.$message.success('修改成功') : this.$message.success('创建成功');
      this.getList();
    },
    handleDeleteItem(treatmentInfo) {
      this.confirmVisible = true;
      this.delTreatment = treatmentInfo;
    },
    async onConfirmDelete() {
      const { id } = this.delTreatment;
      await this.deleteTreatment(id);
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.getList();
    },
    onDelCancel() {
      this.delTreatment = null;
    },
    handleManageTreatment(treatmentInfo) {
      this.isEdit = true;
      this.$refs.manageTreatment.show(treatmentInfo);
    },
    openCreateTreatmentDialog() {
      this.isEdit = false;
      this.$refs.manageTreatment.show();
    },
  },
};
</script>
<style scoped lang="scss">
.treatment-operation {
  margin-bottom: 20px;
}

.list-card-loading {
  margin-top: 20px;
}

.list-pagination {
  margin-top: 20px;
}
</style>
