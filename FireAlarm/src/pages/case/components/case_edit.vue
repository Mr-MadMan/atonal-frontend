<template>
  <t-dialog
    :visible="visible"
    :header="readonly ? '查看病历' : '编辑病历'"
    width="900px"
    :footer="false"
    top="80px"
    @close="$emit('close')"
  >
    <t-form
      ref="form"
      :data="formData"
      :rules="formRules"
      label-align="left"
      @submit="handleSubmit"
    >
      <t-form-item label="病历标题" name="case_title">
        <t-input
          v-model="formData.case_title"
          placeholder="请输入病历标题"
          :disabled="readonly"
        />
      </t-form-item>
      <t-form-item label="撰写人" name="edit_info.realname">
        <t-input
          v-model="formData.edit_info.realname"
          placeholder="请输入撰写人姓名"
          readonly
        />
      </t-form-item>
      <t-form-item label="撰写人身份" name="edit_role">
        <t-input v-model="formData.edit_role" readonly />
      </t-form-item>
      <t-form-item label="病历内容" name="case_content">
        <t-textarea
          v-model="formData.case_content"
          placeholder="请输入病历内容"
          :autosize="{ minRows: 8, maxRows: 8 }"
          :disabled="readonly"
        />
      </t-form-item>
      <t-form-item label="病历附件">
        <upload-component
          v-model="formData.case_files"
          @change="handleFileChange"
          :readonly="readonly"
        />
      </t-form-item>
      <div v-if="!readonly" style="margin-top: 16px; text-align: right">
        <t-button variant="outline" @click="$emit('close')" style="margin-right: 16px"
          >取消</t-button
        >
        <t-button type="submit" theme="primary">提交</t-button>
      </div>
    </t-form>
  </t-dialog>
</template>

<script>
import proxy from "@/config/host";
const env = import.meta.env.MODE || "development";
const API_HOST = env === "mock" ? "/" : proxy[env].API;

import { api_case_detail, api_case_update } from "@/api/case.js";
import UploadComponent from "@/components/upload/index.vue";

export default {
  components: {
    UploadComponent,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    caseId: {
      type: [String, Number],
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        case_title: "",
        case_content: "",
        case_files: [],
        edit_info: { realname: "" },
        edit_role: "病人",
      },
      formRules: {
        case_title: [
          { required: true, message: "请填写病历标题", type: "error" },
          { max: 50, message: "标题长度不能超过50个字符", type: "warning" },
        ],

        case_content: [
          { required: true, message: "请填写病历内容", type: "error" },
          { max: 1000, message: "内容长度不能超过1000个字符", type: "warning" },
        ],
      },
      uploadedFiles: [],
    };
  },
  watch: {
    caseId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchCaseDetail();
        }
      },
    },
  },
  methods: {
    async fetchCaseDetail() {
      try {
        const res = await api_case_detail(this.caseId);
        let tmp = JSON.parse(res.data.case_files);
        let case_files = [];
        for (let i = 0; i < tmp.length; i++) {
          case_files.push({
            path: tmp[1].path,
            size: tmp[i].size,
            name: tmp[i].name,
            url: API_HOST + tmp[i].path,
          });
        }
        this.formData = {
          ...res.data,
          case_files: case_files,
          edit_info: res.data.edit_info || { realname: "" },
          edit_role: this.format_user_role(res.data.edit_role),
        };
      } catch (error) {
        this.$message.error("获取病历详情失败");
      }
    },
    format_user_role(role) {
      switch (role) {
        case "user":
          return "病人";
        case "admin":
          return "院长";
        case "doctor":
          return "医生";
        case "nurse":
          return "病人";
      }
    },
    handleFileChange(files) {
      this.formData.case_files = files;
    },
    async handleSubmit({ validateResult }) {
      if (validateResult === true) {
        try {
          const payload = {
            ...this.formData,
            case_files: JSON.stringify(this.formData.case_files),
          };
          const res = await api_case_update(this.caseId, payload);
          if (res.code === 0) {
            this.$message.success("修改成功");
            this.$emit("success");
            this.$emit("close");
          } else {
            this.$message.error(res.msg);
          }
        } catch (error) {
          this.$message.error("修改失败");
        }
      }
    },
  },
};
</script>
