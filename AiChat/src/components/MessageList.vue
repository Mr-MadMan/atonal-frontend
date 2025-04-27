<script setup lang="ts">
import MessageItem from './MessageItem.vue'
import type { ChatDetail } from '@/services/types'
import { useAutoScroll } from '@/composables/useAutoScroll'
const props = defineProps<{
  messages: ChatDetail[]
}>()

const containerRef = useAutoScroll([props.messages])

// 添加分页加载功能
</script>

<template>
  <div ref="containerRef" class="message-list">
    <TransitionGroup name="message" tag="div">
      <MessageItem v-for="message in props.messages" :key="message.id" :message="message" />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';

.message-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding-bottom: $spacing-lg;
}

.message-move,
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(60px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(0);
}

.message-leave-active {
  position: absolute;
  width: 100%;
}
</style>
