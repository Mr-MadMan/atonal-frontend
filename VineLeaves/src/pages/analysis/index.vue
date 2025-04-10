<template>
  <div class="analysis">
    <t-upload
      ref="uploadRef"
      v-model="file"
      :autoUpload="true"
      theme="file"
      accept="video/*, image/*"
      :abridgeName="[10, 8]"
      draggable
      :requestMethod="uploadMethod"
      :sizeLimit="{ size: 2, unit: 'GB' }"
    />

    <t-descriptions
      class="analysis-result"
      :labelStyle="{ backgroundColor: '#fff', width: '140px', color: '#000' }"
      :contentStyle="{ fontWeight: 'bold', width: '300px' }"
      title="图片分析结果"
      bordered
      :column="2"
    >
      <t-descriptions-item label="检测病症">{{
        diseaseFormat(imageAnalysisRes.detections) || '-'
      }}</t-descriptions-item>
      <t-descriptions-item label="检测结果">
        <t-image-viewer
          v-if="imageAnalysisRes.result_image"
          v-model="imgVisible"
          :images="[imageAnalysisRes.result_image]"
        >
          <template #trigger="{ open }">
            <div class="image-viewer__wrapper" @click="open">
              <img :src="imageAnalysisRes.result_image" alt="result" />
            </div>
          </template>
        </t-image-viewer>
        <span v-else>-</span>
      </t-descriptions-item>
      <t-descriptions-item label="治疗方案">{{ imageAnalysisRes.treatments.join(',') || '-' }}</t-descriptions-item>
    </t-descriptions>

    <t-descriptions
      class="analysis-result video-result"
      :labelStyle="{ backgroundColor: '#fff', width: '140px', color: '#000' }"
      :contentStyle="{ fontWeight: 'bold', width: '300px' }"
      title="视频分析结果"
      bordered
      :column="2"
    >
      <t-descriptions-item label="检测病症">{{ videoAnalysisRes.result_disease || '-' }}</t-descriptions-item>
      <t-descriptions-item label="检测结果图片">
        <t-image-viewer
          v-for="img in videoAnalysisRes.result_img"
          v-model="videoImgVisible"
          :images="videoAnalysisRes.result_img"
          :key="img"
        >
          <template #trigger="{ open }">
            <div class="image-viewer__wrapper" @click="open">
              <img :src="img" alt="result" />
            </div>
          </template>
        </t-image-viewer>
        <span v-if="!videoAnalysisRes.result_img.length">-</span>
      </t-descriptions-item>
      <t-descriptions-item label="检测结果视频">
        <video v-if="videoAnalysisRes.result_video" :src="videoAnalysisRes.result_video" controls width="300px" />
        <span v-else>-</span>
      </t-descriptions-item>
    </t-descriptions>
    <t-loading v-if="loading" attach="video-result" :showOverlay="false" style="width: 100%" />
  </div>
</template>
<script>
import request, { API_HOST } from '@/utils/request';

const ImageAnalysisInit = {
  detections: [],
  result_image: '',
  treatments: [],
  using_time: 0,
};

const VideoAnalysisInit = {
  result_disease: '',
  result_img: [],
  result_video: '',
};

export default {
  name: 'Analysis',
  components: {},
  data() {
    return {
      diseaseMap: {
        Leaf_blight: '枯萎病',
        Black_rot: '黑腐病',
        Downey_mildew: '霜霉病',
        Esca: '埃斯卡病',
        Healthy: '健康',
      },
      file: [],
      imageAnalysisRes: ImageAnalysisInit,
      imgVisible: false,
      videoAnalysisRes: VideoAnalysisInit,
      loading: false,
      videoImgVisible: false,
    };
  },
  methods: {
    diseaseFormat(detections) {
      return detections
        .map((detection) => `${this.diseaseMap[detection.class]}(${Number(detection.confidence * 100).toFixed(2)}%)`)
        .join(',');
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
          this.$message.success('上传成功');
          file.type.indexOf('image') !== -1 ? this.imageAnalyze(res.data.url) : this.videoAnalyze(res.data.url);
          file.type.indexOf('image') !== -1
            ? (this.imageAnalysisRes = ImageAnalysisInit)
            : (this.videoAnalysisRes = VideoAnalysisInit);
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
      request
        .post('/api/analyze/img', {
          file_path: path,
        })
        .then((res) => {
          this.imageAnalysisRes = res.data;
          this.imageAnalysisRes.result_image = `${API_HOST}web/static/${res.data.result_image}`;
        });
    },
    videoAnalyze(path) {
      request
        .post('/api/analyze/video', {
          file_path: path,
        })
        .then((res) => {
          this.pollingVideoAnalysis(res.data.task_id);
        });
    },
    // 轮询视频分析结果
    pollingVideoAnalysis(task_id) {
      this.loading = true;
      const interval = setInterval(() => {
        request
          .get(`/api/analyze/task/${task_id}`)
          .then((res) => {
            const { status, ...rest } = res.data;
            if (status === 'success') {
              this.videoAnalysisRes = rest;
              this.videoAnalysisRes.result_img = rest.result_img
                ? rest.result_img.split(',').map((img) => `${API_HOST}web/static/${img}`)
                : [];
              this.videoAnalysisRes.result_disease = rest.result_disease
                .split(',')
                .map((disease) => this.diseaseMap[disease])
                .join(',');
              this.videoAnalysisRes.result_video = rest.result_video
                ? `${API_HOST}web/static/${rest.result_video}`
                : '';
              clearInterval(interval);
              this.loading = false;
            } else if (status === 'error') {
              clearInterval(interval);
              this.loading = false;
            }
          })
          .catch((err) => {
            console.log('video task error', err);
            this.loading = false;
            clearInterval(interval);
          });
      }, 1000);
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
    display: inline-flex;
    height: 240px;
    cursor: zoom-in;

    + .image-viewer__wrapper {
      margin-left: 10px;
    }

    img {
      height: 100%;
    }
  }
}
</style>
