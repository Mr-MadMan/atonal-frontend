<template>
  <div>
    <!-- 顶部 card  -->
    <top-panel class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
  </div>
</template>
<script>
import TopPanel from './components/TopPanel.vue';
import MiddleChart from './components/MiddleChart.vue';

export default {
  name: 'DashboardBase',
  components: {
    TopPanel,
    MiddleChart,
  },
  mounted() {
    this.$store.dispatch('system/getServerInfo');
    this.$store.dispatch('system/getUserStatistic');
  },
};
</script>
<style scoped lang="scss">
.row-container {
  margin-bottom: 16px;
}
::v-deep .t-card__body {
  padding-top: 0;
}
</style>
