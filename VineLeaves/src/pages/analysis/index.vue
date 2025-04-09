<template>
  <div class="analysis">
    <t-upload
      ref="uploadRef"
      v-model="file"
      :autoUpload="true"
      theme="file"
      :abridgeName="[10, 8]"
      draggable
      :requestMethod="uploadMethod"
      :sizeLimit="{ size: 2, unit: 'GB' }"
      @cancel-upload="onCancelUpload"
    />

    <t-descriptions
      class="analysis-result"
      :labelStyle="{ backgroundColor: '#fff', width: '140px', color: '#000' }"
      :contentStyle="{ fontWeight: 'bold', width: '300px' }"
      title="图片分析结果"
      bordered
      :column="2"
    >
      <t-descriptions-item label="检测病症">{{ imageAnalysisRes.detections.join(',') || '-' }}</t-descriptions-item>

      <t-descriptions-item label="检测结果">
        <t-image-viewer
          v-if="imageAnalysisRes.result_image"
          v-model="imgVisible"
          :images="[imageAnalysisRes.result_image]"
          :closeOnEscKeydown="false"
        >
          <template #trigger="{ open }">
            <div class="image-viewer__wrapper" @click="open">
              <img :src="imageAnalysisRes.result_image" alt="result" />
              <!-- <div class="tdesign-demo-image-viewer__ui-image--hover">
                <span><browse-icon size="1.4em" /> 预览</span>
              </div> -->
            </div>
          </template>
        </t-image-viewer>
        <span v-else>-</span>
      </t-descriptions-item>
      <t-descriptions-item label="治疗方案">{{ imageAnalysisRes.treatments.join(',') || '-' }}</t-descriptions-item>
    </t-descriptions>
  </div>
</template>

<script>
import request, { API_HOST } from '@/utils/request';

export default {
  name: 'Analysis',
  components: {},
  data() {
    return {
      formData: {
        mail_title: '',
        mail_body: '',
      },
      rules: {
        mail_title: [{ required: true, message: '请输入邮件标题' }],
        mail_body: [{ required: true, message: '请输入邮件内容' }],
      },
      analysisResult: {
        verify_id: '',
        rule_id: '',
        label: '',
        probability: '',
      },
      actionMap: {
        ham: '正常邮件',
        spam: '垃圾邮件',
      },
      file: [],
      imageAnalysisRes: {
        detections: [],
        result_image: '',
        treatments: [],
        using_time: 0,
      },
      imgVisible: false,
    };
  },
  methods: {
    onCancelUpload() {
      console.log('cancel upload');
    },
    uploadMethod(file) {
      // 控制上传进度
      let percent = 0;
      const percentTimer = setInterval(() => {
        if (percent + 10 < 99) {
          percent += 10;
          this.$refs.uploadRef.uploadFilePercent({ file, percent });
        } else {
          clearInterval(percentTimer);
        }
      }, 100);

      return request
        .post(
          '/api/file/upload',
          {
            file: file.raw,
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        .then((res) => {
          clearInterval(percentTimer);
          console.log('upload success', res.data);
          this.$message.success('上传成功');
          file.type.indexOf('image') !== -1 ? this.imageAnalyze(res.data.url) : this.videoAnalyze(res.data.url);
          return {
            status: 'success',
            response: {
              url: res.data.url,
            },
          };
        })
        .catch((err) => {
          console.log('upload file error', err);
          this.$message.error('上传失败请重试');
          return {
            status: 'fail',
            error: '上传失败请重试',
          };
        });
    },
    imageAnalyze(path) {
      console.log('image analysis', path);
      request
        .post('/api/analyze/img', {
          file_path: path,
        })
        .then((res) => {
          console.log('image analysis success', res.data);
          this.imageAnalysisRes = res.data;
          this.imageAnalysisRes.result_image = `${API_HOST}web/static/${res.data.result_image}`;
        });
    },
    videoAnalyze(path) {
      console.log('video analysis', path);
      return request.post('/api/analyze/video', {
        file_path: path,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.analysis {
  padding: 16px;
  background-color: #fff;
}

.analysis-result {
  margin-top: 20px;

  .image-viewer__wrapper {
    height: 240px;
    cursor: zoom-in;

    img {
      height: 100%;
    }
  }
}
</style>
