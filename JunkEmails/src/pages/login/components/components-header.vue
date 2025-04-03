<template>
  <header class="login-header">
    <div class="logo"></div>
    <!-- <div class="operations-container">
      <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
        <setting-icon class="icon" />
      </t-button>
    </div> -->
  </header>
</template>

<script>
export default {
  methods: {
    toggleSettingPanel() {
      this.$store.commit('setting/toggleSettingPanel', true);
    },
  },
};
</script>
<style lang="scss" scoped>
.login-header {
  height: var(--td-comp-size-xxxl);
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
  color: var(--td-text-color-primary);

  .logo {
    width: 188px;
    height: var(--td-comp-size-xxxl);
  }

  .operations-container {
    display: flex;
    align-items: center;

    .t-button {
      margin-left: 16px;
    }

    .icon {
      height: 20px;
      width: 20px;
      padding: 6px;
      box-sizing: content-box;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
