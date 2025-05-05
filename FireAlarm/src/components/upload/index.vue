<template>
  <div class="file-upload-container">
    <t-upload
      v-model="files"
      theme="file-flow"
      :auto-upload="false"
      :multiple="true"
      :request-method="handleUploadFile"
      :onSuccess="handleChange"
      :onRemove="handleRemove"
      :disabled="readonly"
    >
      <template #trigger>
        <t-button variant="outline" :disabled="readonly">选择文件</t-button>
      </template>
    </t-upload>
  </div>
</template>

<script>
import axios from "@/utils/request";
import { api_file_sha256_query } from "@/api/file";
import CryptoJS from "crypto-js";
import proxy from "@/config/host";
const env = import.meta.env.MODE || "development";
const API_HOST = env === "mock" ? "/" : proxy[env].API;

export default {
  name: "FileUpload",

  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxFiles: {
      type: Number,
      default: 10,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      files: [...this.value],
      callbackFiles: [],
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.files = [...newVal];
        this.callbackFiles = [...newVal];
      },
    },
  },

  methods: {
    // 修改为处理单个文件的上传
    async handleUploadFile(file) {
      if (!file || !file[0] || !file[0].raw) {
        return {
          status: "fail",
          error: "文件不存在或已损坏",
        };
      }

      file = file[0];
      try {
        // 检查文件大小限制（例如100MB）
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.raw.size > maxSize) {
          return {
            status: "fail",
            error: "文件大小超过限制（最大100MB）",
          };
        }

        const sha256 = await this.calculateSHA256(file.raw);
        const checkRes = await api_file_sha256_query(sha256);
        let response = {};

        if (checkRes.data) {
          response = {
            url: API_HOST + checkRes.data.file_path,
            name: checkRes.data.file_name,
            path: checkRes.data.file_path,
            size: checkRes.data.file_size,
          };
          this.callbackFiles.push(response);
          return { status: "success", response: response };
        }

        const uploadedFile = await this.uploadNewFile(file);
        if (!uploadedFile || !uploadedFile.file_path) {
          throw new Error("上传失败：服务器返回数据无效");
        }

        response = {
          url: API_HOST + uploadedFile.file_path,
          size: uploadedFile.file_size,
          name: uploadedFile.file_name,
          path: uploadedFile.file_path,
        };
        this.callbackFiles.push(response);
        return { status: "success", response: response };
      } catch (error) {
        console.error("文件上传失败:", error);
        return {
          status: "fail",
          error: error.message || "文件上传失败，请重试",
        };
      }
    },

    // 修改上传新文件的逻辑
    async uploadNewFile(file) {
      this.$set(this.fileStatus, file.name, "uploading");
      const formData = new FormData();
      formData.append("file", file.raw);

      const { data } = await axios.post("/api/file/uploadv2", formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          this.$set(this.progress, file.name, percent);
        },
      });
      return data;
    },

    handleRemove(e) {
      let files = [];
      this.callbackFiles.forEach((file, index) => {
        if (index != e.index) {
          files.push(file);
        }
      });
      this.callbackFiles = files;
      this.$emit("change", files);
    },
    handleChange() {
      let files = [];
      this.callbackFiles.forEach((file) => {
        let tmp = { path: file.path, name: file.name, size: file.size };
        files.push(tmp);
      });
      this.$emit("change", files);
    },

    calculateSHA256(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
            resolve(CryptoJS.SHA256(wordArray).toString());
          } catch (error) {
            reject(new Error("SHA256计算失败"));
          }
        };
        reader.onerror = () => reject(new Error("文件读取失败"));
        reader.readAsArrayBuffer(file);
      });
    },
  },
};
</script>

<style scoped>
.file-upload-container {
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.custom-file-list {
  margin-top: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.file-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
}

.file-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.file-name {
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 12px;
}

.file-status {
  font-size: 12px;
}

.status-calculating {
  color: #ff9800;
}

.status-checking {
  color: #2196f3;
}

.status-uploading {
  color: #4caf50;
}

.status-success {
  color: #4caf50;
}

.status-exists {
  color: #9c27b0;
}

.status-error {
  color: #f44336;
}
</style>
