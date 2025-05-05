<template>
  <div class="log-container">
    <t-card>
      <div class="operation-container" style="display: flex; gap: 10px">
        <t-select
          v-model="filter.user_id"
          placeholder="请选择病人"
          clearable
          style="width: 300px; margin-right: 10px"
          @change="handleFilterChange"
        >
          <t-option
            v-for="item in userOptions"
            :key="item.id"
            :value="item.id"
            :label="item.realname"
          />
        </t-select>
        <t-select
          v-model="filter.sensor_id"
          placeholder="请选择传感器"
          clearable
          style="width: 300px"
          @change="handleFilterChange"
        >
          <t-option
            v-for="item in sensorOptions"
            :key="item.sensor_id"
            :value="item.sensor_id"
            :label="item.sensor_name"
          />
        </t-select>
      </div>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      />
    </t-card>
  </div>
</template>

<script>
import { api_sensor_log, api_sensor_list } from "@/api/sensor.js";
import { api_link } from "@/api/link.js";
import dayjs from "dayjs";

export default {
  data() {
    return {
      columns: [
        { colKey: "sensor.sensor_name", title: "传感器名称", width: 150 },
        { colKey: "data_hr", title: "心率(bpm)", width: 120 },
        { colKey: "data_spo2", title: "血氧(%)", width: 120 },
        {
          colKey: "create_time",
          title: "测量时间",
          width: 180,
          cell: (h, { row }) => {
            return dayjs(row.create_time * 1000).format("YYYY-MM-DD HH:mm:ss");
          },
        },
      ],
      tableData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      filter: {
        sensor_id: "",
        user_id: "",
      },
      sensorOptions: [],
      userOptions: [],
    };
  },
  mounted() {
    this.fetchUserOptions();
    this.fetchSensorOptions();
    this.fetchLogList();
  },
  methods: {
    async fetchLogList() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current,
          row: this.pagination.pageSize,
        };

        if (this.filter.sensor_id) {
          params.sensor_id = this.filter.sensor_id;
        }
        if (this.filter.user_id) {
          params.user_id = this.filter.user_id;
        }

        const res = await api_sensor_log(params);
        this.pagination.total = res.data.total;
        this.pagination.current = res.data.page;
        this.tableData = res.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserOptions() {
      try {
        const res = await api_link({ page: 1, row: 1000 });
        this.userOptions = res.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSensorOptions() {
      if (!this.filter.user_id) {
        this.sensorOptions = [];
        return;
      }
      try {
        const params = {
          page: 1,
          row: 1000,
          user_id: this.filter.user_id,
        };
        const res = await api_sensor_list(params);
        this.sensorOptions = res.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchLogList();
    },
    handleFilterChange() {
      this.pagination.current = 1;
      this.fetchSensorOptions();
      this.fetchLogList();
    },
  },
};
</script>

<style scoped>
.log-container {
  padding: 20px;
}
.operation-container {
  margin-bottom: 20px;
}
</style>
