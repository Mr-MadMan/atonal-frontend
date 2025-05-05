<template>
  <div class="case-container">
    <t-card>
      <div class="operation-container" style="display: flex; gap: 10px">
        <t-select
          v-model="filter.user_id"
          placeholder="请选择病人"
          clearable
          style="width: 300px"
          @change="handleFilterChange"
        >
          <t-option
            v-for="item in userOptions"
            :key="item.id"
            :value="item.id"
            :label="item.realname"
          />
        </t-select>
        <t-button theme="primary" @click="handleCreate" :disabled="!filter.user_id">
          <template #icon><t-icon name="add" /></template>
          新增病历
        </t-button>
      </div>

      <t-table
        row-key="case_id"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #operation="{ row }">
          <t-space>
            <t-link
              theme="primary"
              hover="color"
              @click="handleEdit(row, false)"
              v-if="row.edit_user_id == current_user_id || current_user_role == 'admin'"
            >
              <t-icon name="edit" /> 编辑
            </t-link>
            <t-link theme="primary" hover="color" @click="handleEdit(row, true)" v-else>
              <t-icon name="edit" /> 查看
            </t-link>
            <t-popconfirm
              theme="warning"
              content="确认删除该病历吗？"
              @confirm="handleDelete(row)"
              v-if="row.edit_user_id == current_user_id || current_user_role == 'admin'"
            >
              <t-link theme="danger" hover="color">
                <t-icon name="delete" /> 删除
              </t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增对话框 -->
    <t-dialog
      :visible="dialogVisible"
      header="新增病历"
      width="900px"
      :footer="false"
      top="80px"
      :on-close="handleDialogClose"
    >
      <t-form
        ref="form"
        :data="formData"
        :rules="formRules"
        label-align="left"
        @submit="handleDialogSubmit"
      >
        <t-form-item label="病历标题" name="case_title">
          <t-input v-model="formData.case_title" placeholder="请输入病历标题" />
        </t-form-item>

        <t-form-item label="病历内容" name="case_content">
          <t-textarea
            v-model="formData.case_content"
            placeholder="请输入病历内容"
            :autosize="{ minRows: 8, maxRows: 8 }"
          />
        </t-form-item>
        <t-form-item label="病历附件">
          <upload-component v-model="formData.case_files" @change="handleFileChange" />
        </t-form-item>
        <div style="margin-top: 16px; text-align: right">
          <t-button
            variant="outline"
            @click="handleDialogClose"
            style="margin-right: 16px"
            >取消</t-button
          >
          <t-button type="submit" theme="primary">提交</t-button>
        </div>
      </t-form>
    </t-dialog>

    <!-- 编辑对话框 -->
    <case-edit
      v-if="currentCaseId"
      :visible="editDialogVisible"
      :case-id="currentCaseId"
      :readonly="currentReadonly"
      @close="editDialogVisible = false"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script>
import { api_case_create, api_case_list, api_case_delete } from "@/api/case.js";
import UploadComponent from "@/components/upload/index.vue";
import CaseEdit from "@/pages/case/components/case_edit.vue";
import dayjs from "dayjs";
import { api_link } from "@/api/link.js";

export default {
  components: {
    UploadComponent,
    CaseEdit,
  },
  data() {
    return {
      filter: {
        user_id: null,
      },
      userOptions: [],
      columns: [
        { colKey: "id", title: "ID", width: 200 },
        { colKey: "case_title", title: "病历标题", width: 180 },
        { colKey: "edit_info.realname", title: "撰写人", width: 150 },
        {
          colKey: "edit_role",
          title: "撰写人身份",
          width: 100,
          cell: (h, { row }) => {
            const roleMap = {
              user: "病人",
              doctor: "医生",
              nurse: "护士",
              admin: "院长",
            };
            return roleMap[row.edit_role] || row.edit_role;
          },
        },
        {
          colKey: "create_time",
          title: "记录日期",
          width: 250,
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
      dialogVisible: false,
      editDialogVisible: false,
      currentCaseId: null,
      currentReadonly: false,
      formData: {
        case_title: "",
        case_content: "",
        case_files: [],
      },
      formRules: {
        case_title: [
          { required: true, message: "请填写病历标题", type: "error" },
          { max: 50, message: "标题长度不能超过50个字符", type: "warning" },
        ],
        "edit_info.realname": [
          { required: true, message: "请填写撰写人姓名", type: "error" },
          { max: 20, message: "姓名长度不能超过20个字符", type: "warning" },
        ],
        edit_role: [{ required: true, message: "请选择撰写人身份", type: "error" }],
        case_content: [
          { required: true, message: "请填写病历内容", type: "error" },
          { max: 1000, message: "内容长度不能超过1000个字符", type: "warning" },
        ],
      },
      uploadedFiles: [],
      current_user_id: "",
      current_user_role: "",
    };
  },
  mounted() {
    this.fetchUserOptions();
    this.current_user_id = this.$store.getters["user/userInfo"]["user_id"];
    this.current_user_role = this.$store.getters["user/role"];
  },
  methods: {
    async fetchUserOptions() {
      try {
        const res = await api_link({ page: 1, row: 1000 });
        this.userOptions = res.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCaseList() {
      if (!this.filter.user_id) {
        this.$message.warning("请先选择病人");
        return;
      }
      this.loading = true;
      let res = await api_case_list({
        page: this.pagination.current,
        row: this.pagination.pageSize,
        user_id: this.filter.user_id,
      });
      this.pagination.total = res.data.total;
      this.pagination.current = res.data.page;
      this.tableData = res.data.data;
      this.loading = false;
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchCaseList();
    },
    handleCreate() {
      this.formData = {
        case_title: "",
        case_content: "",
        case_files: [],
        edit_info: { realname: "" },
        edit_role: "user",
      };
      this.uploadedFiles = [];
      this.dialogVisible = true;
    },
    handleEdit(row, readonly) {
      this.currentCaseId = row.id;
      this.editDialogVisible = true;
      this.currentReadonly = readonly;
    },
    handleEditSuccess() {
      this.fetchCaseList();
    },
    handleFilterChange(value) {
      this.filter.user_id = value;
      this.fetchCaseList();
    },
    async handleDelete(row) {
      try {
        let res = await api_case_delete(row.case_id);
        this.$message.success("删除成功");
        this.fetchCaseList();
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
    handleDialogClose() {
      this.dialogVisible = false;
      this.$refs.form.reset();
    },
    handleFileChange(files) {
      console.log(files);
      this.formData.case_files = files;
    },
    async handleDialogSubmit({ validateResult }) {
      if (validateResult === true) {
        try {
          const payload = {
            ...this.formData,
            case_files: JSON.stringify(this.formData.case_files),
            user_id: this.filter.user_id,
          };
          const res = await api_case_create(payload);
          if (res.code === 0) {
            this.$message.success("新增成功");
            this.dialogVisible = false;
            this.fetchCaseList();
          } else {
            this.$message.error(res.msg);
          }
        } catch (error) {
          this.$message.error("新增失败");
        }
      }
    },
  },
};
</script>

<style scoped>
.case-container {
  padding: 20px;
}
.operation-container {
  margin-bottom: 20px;
}

/* 自定义滚动条样式 */
:deep(.t-dialog__body) {
  overflow-y: auto;
  max-height: calc(80vh - 120px);
}

:deep(.t-dialog__body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.t-dialog__body::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

:deep(.t-dialog__body::-webkit-scrollbar-track) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
