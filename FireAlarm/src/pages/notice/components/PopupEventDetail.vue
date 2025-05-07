<template>
  <t-dialog
    class="popup-event-detail"
    :header="eventDetail.video_stream.name"
    :visible="dialogVisible"
    placement="center"
    :footer="false"
    width="650px"
    @close="dialogVisible = false"
  >
    <div class="message-content">
      <div>
        警报类型：<span style="font-weight: 700">{{
          eventDetail.result_label === 'smoke' ? '烟雾报警' : '火焰报警'
        }}</span>
      </div>
      <p>视频截图</p>
      <img :src="eventDetail.result_frame_path" alt="" />
      <p>视频截取</p>
      <video v-if="eventDetail.result_video_path" :src="eventDetail.result_video_path" controls></video>
      <p>视频检验描述</p>
      <t-textarea v-model="eventDetail.status_description" placeholder="请输入视频检验描述" />
      <div style="text-align: right; margin-top: 10px">
        <t-button theme="primary" @click="handleModifyEvent(1)">通过</t-button>
        <t-button theme="danger" @click="handleModifyEvent(-1)" style="margin-left: 10px">驳回</t-button>
      </div>
    </div>
  </t-dialog>
</template>

<script>
import { api_event_detail, api_event_modify } from '@/api/msg';
import dayjs from 'dayjs';
import proxy from '@/config/host';

const env = import.meta.env.MODE || 'development';
const API_HOST = env === 'mock' ? '/' : proxy[env].API;

export default {
  name: 'PopupEventDetail',
  data() {
    return {
      eventId: '',
      dialogVisible: false,
      eventDetail: {
        video_stream: {
          name: '',
        },
        result_frame_path: '',
        result_label: '',
        result_status: '',
        create_time: '',
        status_description: '',
      },
    };
  },
  methods: {
    formatTime(timestamp) {
      return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
    showDialog(eventId) {
      this.eventId = eventId;
      this.dialogVisible = true;
      this.fetchEventDetail();
    },
    async fetchEventDetail() {
      const res = await api_event_detail(this.eventId);
      this.eventDetail = res.data;
      this.eventDetail.result_frame_path = `${API_HOST}/web${res.data.result_frame_path}`;
      this.eventDetail.result_video_path = `${API_HOST}/web${res.data.result_video_path}`;
      console.log('eventDetail', this.eventDetail);
    },
    handleModifyEvent(status) {
      api_event_modify(this.eventId, {
        status,
        description: this.eventDetail.status_description,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功');
            this.dialogVisible = false;
            this.$emit('modifySuccess');
          }
        })
        .catch(() => {
          this.$message.error('修改失败');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.message-content {
  img,
  video {
    width: 100%;
  }

  p,
  div {
    font-size: 14px;
    font-weight: 500;
    color: #000;
    margin-bottom: 5px;
  }
}
</style>
