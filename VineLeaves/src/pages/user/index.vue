<template>
  <t-row :gutter="[16, 16]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>Hi，{{ userInfo.nickname }}</div>
        <t-button @click="openChangePasswordDialog">修改密码</t-button>
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <template #option>
          <t-button theme="default" shape="square" variant="text">
            <edit-icon size="18" />
          </t-button>
        </template>
        <t-row class="content" justify="space-between">
          <t-col v-for="(item, index) in USER_INFO_LIST" :key="index" class="contract" :span="item.span || 3">
            <div class="contract-title">
              {{ item.title }}
            </div>
            <div class="contract-detail">
              {{ item.content }}
            </div>
          </t-col>
        </t-row>
      </t-card>
    </t-col>

    <!-- <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="90px">T</t-avatar>
        <div class="name">My Account</div>
        <div class="position">XXG 港澳业务拓展组员工 直客销售</div>
      </t-card>
    </t-col> -->
    <dialog-change-password ref="changePasswordRef" />
  </t-row>
</template>
<script>
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import { EditIcon } from 'tdesign-icons-vue';
import { mapState } from 'vuex';
import { getFolderLineDataSet } from './index';
import { changeChartsTheme } from '@/utils/color';
import { LAST_7_DAYS } from '@/utils/date';
import DialogChangePassword from '@/components/dialog/DialogChangePassword.vue';
import { USER_INFO_LIST, TEAM_MEMBERS, PRODUCT_LIST } from '@/service/service-user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

export default {
  name: 'UserIndex',
  components: {
    EditIcon,
    DialogChangePassword,
  },
  data() {
    return {
      dashboardBase: '',
      lineContainer: '',
      lineChart: '',
      LAST_7_DAYS,
      USER_INFO_LIST,
      TEAM_MEMBERS,
      PRODUCT_LIST,
    };
  },
  computed: {
    ...mapState('setting', ['brandTheme', 'mode']),
    ...mapState('user', ['userInfo']),
  },
  watch: {
    brandTheme() {
      changeChartsTheme([this.lineChart]);
    },
    mode() {
      this.renderCharts();
    },
    lineChart() {
      this.updateContainer();
    },
  },
  mounted() {
    // window.addEventListener('resize', this.updateContainer, false);
    // this.renderCharts();
    // this.$nextTick(() => {
    //   this.updateContainer();
    // });
  },
  methods: {
    /** 图表选择 */
    onLineChange(value) {
      this.lineChart.setOption(getFolderLineDataSet({ dateTime: value }));
    },
    updateContainer() {
      this.lineChart.resize?.({
        width: this.lineContainer.clientWidth,
        height: this.lineContainer.clientHeight,
      });
    },
    renderCharts() {
      const { chartColors } = this.$store.state.setting;
      if (!this.lineContainer) {
        this.lineContainer = document.getElementById('lineContainer');
      }
      this.lineChart = echarts.init(this.lineContainer);
      this.lineChart.setOption({
        grid: {
          x: 30, // 默认是80px
          y: 30, // 默认是60px
          x2: 10, // 默认80px
          y2: 30, // 默认60px
        },
        ...getFolderLineDataSet({ ...chartColors }),
      });
    },
    getIcon(type) {
      const typeMap = {
        a: ProductAIcon,
        b: ProductBIcon,
        c: ProductCIcon,
        d: ProductDIcon,
      };
      return typeMap[type || 'a'];
    },
    openChangePasswordDialog() {
      this.$refs.changePasswordRef.showDialog();
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
