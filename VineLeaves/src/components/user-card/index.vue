<template>
  <t-card theme="poster2" :bordered="false">
    <template #avatar>
      <t-avatar size="56px">
        <template #icon>
          <shop-icon v-if="userInfo.type === 1" />
          <calendar-icon v-if="userInfo.type === 2" />
          <service-icon v-if="userInfo.type === 3" />
          <user-avatar-icon v-if="userInfo.type === 4" />
          <laptop-icon v-if="userInfo.type === 5" />
        </template>
      </t-avatar>
    </template>
    <template #content>
      <p class="list-card-item_detail--name">账户名：{{ userInfo.username }}</p>
      <p class="list-card-item_detail--desc">昵称：{{ userInfo.nickname }}</p>
    </template>
    <template #actions>
      <t-dropdown
        :disabled="userInfo.is_admin"
        trigger="click"
        :options="[
          {
            content: '编辑',
            value: 'manage',
            onClick: () => handleManageUser(userInfo),
          },
          {
            content: '删除',
            value: 'delete',
            onClick: () => handleDeleteUser(userInfo),
          },
        ]"
      >
        <t-button theme="default" :disabled="userInfo.is_admin" shape="square" variant="text">
          <more-icon />
        </t-button>
      </t-dropdown>
    </template>
  </t-card>
</template>
<script lang="ts">
import { ShopIcon, CalendarIcon, ServiceIcon, UserAvatarIcon, LaptopIcon, MoreIcon } from 'tdesign-icons-vue';

export default {
  name: 'UserCard',
  components: {
    ShopIcon,
    CalendarIcon,
    ServiceIcon,
    UserAvatarIcon,
    LaptopIcon,
    MoreIcon,
  },
  props: {
    userInfo: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleManageUser(userInfo) {
      this.$emit('manage-user', userInfo);
    },
    handleDeleteUser(userInfo) {
      this.$emit('delete-user', userInfo);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &_detail {
    min-height: 140px;

    &--name {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 400;
      color: var(--td-text-color-primary);
    }

    &--desc {
      color: var(--td-text-color-secondary);
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 40px;
    }
  }
}
</style>
