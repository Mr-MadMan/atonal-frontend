<template>
  <div>
    <!-- 顶部 card  -->
    <top-panel class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
    <t-loading v-if="loading" attach="row-container" :showOverlay="false" style="width: 100%" />
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
  data() {
    return {
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('system/getServerInfo');
    await this.$store.dispatch('system/getUserStatistic');
    this.loading = false;
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
