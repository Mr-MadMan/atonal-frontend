<template>
  <div class="events-container">
    <t-card>
      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
        hover
      >
        <template #result_label="{ row }">
          <div class="title-cell">
            <span v-if="!row.result_status" class="unread-dot"></span>
            <span>{{ row.result_label === 'smoke' ? '烟雾报警' : '火焰报警' }}</span>
          </div>
        </template>
        <template #create_time="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
        <template #result_status="{ row }">
          <t-tag :theme="row.result_status ? 'default' : 'primary'" :variant="row.result_status ? 'light' : 'dark'">
            {{ statusMap[row.result_status] }}
          </t-tag>
        </template>
        <template #op="{ row }">
          <t-button theme="primary" variant="text" @click="handleView(row)"> 查看 </t-button>
        </template>
      </t-table>
    </t-card>
    <popup-event-detail ref="popupEventDetail" @modifySuccess="fetchMsgList" />
  </div>
</template>

<script>
import { api_event_query } from '@/api/msg.js';
import dayjs from 'dayjs';
import PopupEventDetail from './components/PopupEventDetail.vue';

export default {
  components: {
    PopupEventDetail,
  },
  data() {
    return {
      statusMap: {
        '-1': '驳回',
        0: '未审核',
        1: '已审核',
      },
      columns: [
        {
          colKey: 'id',
          title: 'ID',
          width: 100,
        },
        {
          colKey: 'video_stream.name',
          title: '视频名称',
          width: 100,
        },
        {
          colKey: 'result_label',
          title: '报警类型',
          width: 200,
        },
        {
          colKey: 'result_status',
          title: '状态',
          width: 100,
        },
        {
          colKey: 'create_time',
          title: '创建时间',
          width: 180,
        },
        {
          colKey: 'op',
          title: '操作',
          width: 100,
          align: 'center',
        },
      ],
      tableData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      currentMsg: {},
    };
  },
  mounted() {
    this.fetchMsgList();
  },
  methods: {
    formatTime(timestamp) {
      return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
    async fetchMsgList() {
      this.loading = true;
      try {
        const res = await api_event_query({
          page: this.pagination.current,
          row: this.pagination.pageSize,
        });
        this.tableData = res.data.data;
        this.pagination.total = res.data.total;
        this.pagination.current = res.data.page;
      } catch (error) {
        this.$message.error('获取消息列表失败');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchMsgList();
    },
    async handleView(row) {
      this.currentMsg = row;
      this.$refs.popupEventDetail.showDialog(row.id);
    },
  },
};
</script>

<style scoped>
.events-container {
  padding: 20px;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #e34d59;
  border-radius: 50%;
  display: inline-block;
}
</style>
