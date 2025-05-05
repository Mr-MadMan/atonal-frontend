<template>
  <div class="alarm-container">
    <t-card class="alarm-list">
      <div class="list-content">
        <t-form layout="inline" @submit="handleSearch">
          <t-form-item label="">
            <t-input v-model="pagination.stream_title" placeholder="请输入视频流名称" clearable />
          </t-form-item>
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button theme="primary" @click="handleCreate" style="margin-left: 10px"> 新增 </t-button>
        </t-form>

        <t-card
          class="list-item"
          v-for="item in listData"
          :key="item.video_id"
          :title="item.name"
          hover-shadow
          @click.stop.native="handleDetail(item)"
        >
          <template #actions>
            <t-button theme="primary" variant="text" @click.stop="handleEdit(item, false)">编辑</t-button>
            <t-button theme="danger" variant="text" @click.stop="handleDelete(item)">删除</t-button>
          </template>
        </t-card>
      </div>
      <t-divider style="height: 100%" layout="vertical" />
      <div style="flex: 1; min-width: 600px">
        <video id="livePlayer"></video>
      </div>
    </t-card>

    <!-- 新增视频流配置 -->
    <t-dialog
      :visible="dialogVisible"
      :header="currentVideoId ? '编辑视频流配置' : '新增视频流配置'"
      width="900px"
      :footer="false"
      top="80px"
      :on-close="handleDialogClose"
    >
      <t-form ref="form" :data="formData" :rules="formRules" label-align="left" @submit="handleDialogSubmit">
        <t-form-item label="视频流名称" name="stream_title">
          <t-input v-model="formData.stream_title" placeholder="请输入视频流名称" />
        </t-form-item>

        <t-form-item label="视频流地址" name="stream_url">
          <t-input v-model="formData.stream_url" placeholder="请输入视频流地址" />
        </t-form-item>
        <div style="margin-top: 16px; text-align: right">
          <t-button variant="outline" @click="handleDialogClose" style="margin-right: 16px">取消</t-button>
          <t-button type="submit" theme="primary">提交</t-button>
        </div>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { api_video_list, api_video_add, api_video_delete, api_video_detail, api_video_update } from '@/api/alarm.js';
import Hls from 'hls.js';

const paginationOrigin = {
  page: 1,
  row: 100,
  stream_title: '',
  status: -1,
};

export default {
  components: {},
  data() {
    return {
      listData: [],
      loading: false,
      pagination: { ...paginationOrigin },
      dialogVisible: false,
      editDialogVisible: false,
      currentVideoId: '',
      currentVideo: {
        flv: '',
        hls: '',
      },
      formData: {
        stream_title: '',
        stream_url: '',
      },
      formRules: {
        stream_title: [
          { required: true, message: '请填写视频流名称', type: 'error' },
          { max: 50, message: '名称长度不能超过50个字符', type: 'warning' },
        ],
        stream_url: [
          { required: true, message: '请填写视频流地址', type: 'error' },
          //   { max: 200, message: '地址长度不能超过200个字符', type: 'warning' },
        ],
      },
      currentReadonly: false,
      current_user_id: '',
      current_user_role: '',
      hlsIns: null,
    };
  },
  mounted() {
    this.fetchVideoList();
    this.current_user_id = this.$store.getters['user/userInfo'].user_id;
    this.current_user_role = this.$store.getters['user/role'];
  },
  beforeDestroy() {
    this.currentVideo.hls = '';
    this.hlsIns.destroy();
  },
  methods: {
    initPlayer() {
      if (Hls.isSupported()) {
        this.hlsIns = new Hls();
        this.hlsIns.loadSource(this.currentVideo.hls);
        this.hlsIns.attachMedia(document.getElementById('livePlayer'));
        this.hlsIns.on(Hls.Events.MANIFEST_PARSED, () => {
          document.getElementById('livePlayer').play();
        });
      }
    },
    async fetchVideoList() {
      this.loading = true;
      const res = await api_video_list(this.pagination);
      this.pagination.total = res.data.total;
      this.pagination.current = res.data.page;
      this.listData = res.data.data;
      this.loading = false;
    },
    handleCreate() {
      this.formData = {
        stream_title: '',
        stream_url: '',
      };
      this.currentVideoId = '';
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.currentVideoId = row.id;
      this.formData = {
        stream_title: row.name,
        stream_url: row.pull_url,
      };
      this.dialogVisible = true;
    },
    async handleDetail(row) {
      if (row.id !== this.currentVideoId) {
        this.currentVideoId = row.id;
        const res = await api_video_detail(this.currentVideoId);
        if (res.code === 0 || res.code === 200) {
          this.currentVideo.hls = res.data.streams['http-hls'];
          this.initPlayer();
        }
      }
    },
    async handleDelete(row) {
      try {
        await api_video_delete(row.id);
        this.$message.success('删除成功');
        this.fetchVideoList();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    handleDialogClose() {
      this.dialogVisible = false;
      this.$refs.form.reset();
    },
    async handleDialogSubmit({ validateResult }) {
      if (validateResult === true) {
        try {
          const payload = {
            ...this.formData,
          };
          const res = this.currentVideoId
            ? await api_video_update(this.currentVideoId, payload)
            : await api_video_add(payload);
          if (res.code === 200 || res.code === 0) {
            this.$message.success('新增成功');
            this.dialogVisible = false;
            this.fetchVideoList();
          } else {
            this.$message.error(res.msg);
          }
        } catch (error) {
          this.$message.error('新增失败');
        }
      }
    },
    handleSearch() {
      this.fetchVideoList();
    },
  },
};
</script>

<style lang="less" scoped>
.alarm-container {
  height: 100%;
}

.alarm-list {
  height: 100%;
  /deep/ .t-card__body {
    display: flex;
    height: 100%;
  }
}

.list-content {
  margin-bottom: 0;
}

#livePlayer {
  width: 100%;
}

.list-item {
  margin-top: 10px;
  cursor: pointer;
}
</style>
