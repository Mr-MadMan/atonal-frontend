<template>
  <t-row :gutter="[16, 16]">
    <t-col :xs="12" :xl="12">
      <t-card title="服务器配置信息" class="dashboard-chart-card" :bordered="false">
        <div class="chart-container">
          <div
            id="cpuPie"
            ref="cpuPie"
            :style="{ width: `${resizeTime * 326}px`, height: `${resizeTime * 326}px`, margin: '0 auto' }"
          ></div>
          <div
            id="diskPie"
            ref="diskPie"
            :style="{ width: `${resizeTime * 326}px`, height: `${resizeTime * 326}px`, margin: '0 auto' }"
          ></div>
          <div
            id="memPie"
            ref="memPie"
            :style="{ width: `${resizeTime * 326}px`, height: `${resizeTime * 326}px`, margin: '0 auto' }"
          ></div>
        </div>
        <t-descriptions title="其他配置信息">
          <t-descriptions-item label="OS">{{
            serverInfo.os && serverInfo.os.system + ' ' + serverInfo.os.version
          }}</t-descriptions-item>
          <t-descriptions-item label="MySql">{{ serverInfo.mysql && serverInfo.mysql }}</t-descriptions-item>
          <t-descriptions-item label="Python">{{ serverInfo.python && serverInfo.python }}</t-descriptions-item>
          <t-descriptions-item label="Ultralytics">{{
            serverInfo.ultralytics && serverInfo.ultralytics
          }}</t-descriptions-item>
        </t-descriptions>
      </t-card>
    </t-col>
  </t-row>
</template>
<script>
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { PieChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import { mapState } from 'vuex';

import { LAST_7_DAYS } from '@/utils/date';
import { getPieChartDataSet, getLineChartDataSet } from '../index';
import { changeChartsTheme } from '@/utils/color';

echarts.use([TooltipComponent, LegendComponent, PieChart, GridComponent, LineChart, CanvasRenderer]);

export default {
  name: 'MiddleChart',
  data() {
    return {
      LAST_7_DAYS,
      resizeTime: 1,
      currentMonth: this.getThisMonth(),
      cpuPieChart: null,
      diskPieChart: null,
      memPieChart: null,
    };
  },
  computed: {
    ...mapState('setting', ['brandTheme', 'mode']), // 这里需要用到主题色和主题模式的全局配置
    ...mapState('system', ['serverInfo', 'userStatistic']), // 这里需要用到主题色和主题模式的全局配置
  },
  watch: {
    brandTheme() {
      changeChartsTheme([this.cpuPieChart, this.monitorChart]);
    },
    mode() {
      [this.cpuPieChart, this.diskPieChart, this.monitorChart].forEach((item) => {
        item.dispose();
      });
      this.renderCharts();
    },
    serverInfo(info) {
      if (info.cpu) {
        const option = getPieChartDataSet(
          [
            { value: info.cpu.usage, name: 'CPU使用率' },
            { value: 100 - info.cpu.usage, name: 'CPU空闲率' },
          ],
          this.$store.state.setting.chartColors,
        );
        this.cpuPieChart.setOption(option);
        this.cpuPieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
      }

      if (info.disk) {
        const option = getPieChartDataSet(
          [
            { value: info.disk.usage, name: '磁盘使用率' },
            { value: 100 - info.disk.usage, name: '磁盘空闲率' },
          ],
          this.$store.state.setting.chartColors,
        );
        this.diskPieChart.setOption(option);
        this.diskPieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
      }

      if (info.mem) {
        const option = getPieChartDataSet(
          [
            { value: info.mem.usage, name: '内存使用率' },
            { value: 100 - info.mem.usage, name: '内存空闲率' },
          ],
          this.$store.state.setting.chartColors,
        );
        this.memPieChart.setOption(option);
        this.memPieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0,
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateContainer();
    });

    window.addEventListener('resize', this.updateContainer, false);
    this.renderCharts();
  },

  methods: {
    /** 获取当前选中时间的短时间表达法 */
    getThisMonth(checkedValues = '') {
      let date;
      if (!checkedValues || checkedValues.length === 0) {
        date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      }
      date = new Date(checkedValues[0]);
      const date2 = new Date(checkedValues[1]);
      const startMonth = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
      const endMonth = date2.getMonth() + 1 > 9 ? date2.getMonth() + 1 : `0${date2.getMonth() + 1}`;

      return `${date.getFullYear()}-${startMonth}  至  ${date2.getFullYear()}-${endMonth}`;
    },
    /** 资金走趋选择 */
    onCurrencyChange(checkedValues) {
      const { chartColors } = this.$store.state.setting;

      this.currentMonth = this.getThisMonth(checkedValues);
      this.monitorChart.setOption(getLineChartDataSet({ dateTime: checkedValues, ...chartColors }));
    },
    updateContainer() {
      if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
        this.resizeTime = (document.documentElement.clientWidth / 2080).toFixed(2);
      } else if (document.documentElement.clientWidth < 1080) {
        this.resizeTime = (document.documentElement.clientWidth / 1080).toFixed(2);
      } else {
        this.resizeTime = 1;
      }

      // 根据父容器的大小设置大小
      this.cpuPieChart.resize({
        width: `${this.resizeTime * 326}px`,
        height: `${this.resizeTime * 326}px`,
      });

      this.diskPieChart.resize({
        width: `${this.resizeTime * 326}px`,
        height: `${this.resizeTime * 326}px`,
      });

      this.memPieChart.resize({
        width: `${this.resizeTime * 326}px`,
        height: `${this.resizeTime * 326}px`,
      });
    },
    renderCharts() {
      // 初始化cpu饼图
      if (!this.cpuPie) {
        this.cpuPie = document.getElementById('cpuPie');
      }
      this.cpuPieChart = echarts.init(this.cpuPie);

      // 初始化磁盘饼图
      if (!this.diskPie) {
        this.diskPie = document.getElementById('diskPie');
      }
      this.diskPieChart = echarts.init(this.diskPie);

      // 初始化内存饼图
      if (!this.memPie) {
        this.memPie = document.getElementById('memPie');
      }
      this.memPieChart = echarts.init(this.memPie);
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-chart-card {
  padding: 8px;

  ::v-deep .t-card__header {
    padding-bottom: 24px;
  }

  ::v-deep .t-card__title {
    font-size: 20px;
    font-weight: 500;
  }
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  height: fit-content;
  margin-bottom: 20px;
}
</style>
