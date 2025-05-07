<template>
  <div class="msg-container">
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
        <template #type="{ row }">
          <div class="title-cell">
            <span v-if="!row.status" class="unread-dot"></span>
            <span>{{ row.type }}</span>
          </div>
        </template>
        <template #content="{ row }">
          <div class="content-cell">{{ row.content }}</div>
        </template>
        <template #create_time="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
        <template #status="{ row }">
          <t-tag :theme="row.status ? 'default' : 'primary'" :variant="row.status ? 'light' : 'dark'">
            {{ row.status ? '已读' : '未读' }}
          </t-tag>
        </template>
        <template #op="{ row }">
          <t-button theme="primary" variant="text" @click="handleView(row)"> 查看 </t-button>
        </template>
      </t-table>
    </t-card>

    <!-- 消息详情弹窗 -->
    <t-dialog
      :visible="dialogVisible"
      :header="currentMsg.type"
      :footer="false"
      width="500px"
      @close="dialogVisible = false"
    >
      <div class="message-content">
        <div class="message-time">{{ formatTime(currentMsg.create_time) }}</div>
        <div class="message-body">{{ currentMsg.content }}</div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { api_msg_query, api_msg_set_read } from '@/api/msg.js';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      columns: [
        {
          colKey: 'type',
          title: '标题',
          width: 200,
        },
        {
          colKey: 'content',
          title: '内容',
          width: 300,
        },
        {
          colKey: 'create_time',
          title: '时间',
          width: 180,
        },
        {
          colKey: 'status',
          title: '状态',
          width: 100,
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
        const res = await api_msg_query({
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
      this.dialogVisible = true;

      if (!row.status) {
        try {
          await api_msg_set_read(row.id);
          // 更新本地数据状态
          const index = this.tableData.findIndex((item) => item.id === row.id);
          if (index !== -1) {
            this.tableData[index].status = true;
            // 强制更新视图
            this.tableData = [...this.tableData];
          }
          const res = await api_msg_query({ page: 1, row: 1000, status: -1 });
          this.$store.commit('notification/setMsgData', res.data.data);
        } catch (error) {
          this.$message.error('设置已读状态失败');
          console.error(error);
        }
      }
    },
  },
};
</script>

<style scoped>
.msg-container {
  padding: 20px;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #e34d59;
  border-radius: 50%;
  display: inline-block;
}

.message-content {
  padding: 16px;
}

.message-time {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.message-body {
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 自定义滚动条样式 */
:deep(.t-card__body) {
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

:deep(.t-card__body::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.t-card__body::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

:deep(.t-card__body::-webkit-scrollbar-track) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
