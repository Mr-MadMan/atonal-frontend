<script setup lang="ts">
import { useSessionStore } from '@/stores/sessionStore'
import { onMounted } from 'vue'

const sessionStore = useSessionStore()

onMounted(() => {
  sessionStore.getSessionsList()
})

const handleCreateNew = () => {
  sessionStore.createNewSession()
}

const formatDate = (date: number) => {
  return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString().slice(0, 5)
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="handleCreateNew">
        <span>+ 新对话</span>
      </button>
    </div>

    <!-- 下拉刷新列表 -->
    <div class="session-list">
      <div
        v-for="session in sessionStore.sessionsList"
        :key="session.id"
        class="session-item"
        :class="{ active: session.chat_id === sessionStore.currentSessionId }"
        @click="sessionStore.switchSession(session.chat_id)"
      >
        <div class="session-content">
          <div class="session-title">
            {{ session.title }}
          </div>
          <div class="session-meta">
            <span class="session-time">{{ formatDate(session.create_time * 1000) }}</span>
          </div>
        </div>
        <button class="delete-btn" title="删除会话" @click.stop="sessionStore.deleteSession(session.chat_id)">×</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';

.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: $spacing-md;
}

.new-chat-btn {
  width: 100%;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  border: 1px solid var(--border-color);
  background-color: var(--button-bg);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--button-hover-bg);
  }
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
}

.session-item {
  padding: $spacing-sm;
  margin-bottom: $spacing-xs;
  border-radius: $border-radius-md;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--item-hover-bg);

    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background-color: var(--item-active-bg);
  }
}

.session-content {
  flex: 1;
  overflow: hidden;
}

.session-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);
}

.session-meta {
  font-size: 0.75rem;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-xs;
}

.delete-btn {
  opacity: 0;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 $spacing-xs;
  transition: opacity 0.2s ease;

  // &:hover {
  //   color: var(--danger-hover);
  // }
}
</style>
