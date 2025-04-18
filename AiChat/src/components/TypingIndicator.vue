<script setup lang="ts">
import { computed } from 'vue';
// import { useChatStore } from '@/stores/chat';

// const chatStore = useChatStore();

// const typingText = computed(() => {
//   return chatStore.isLoading ? `${chatStore.currentModel.name} is typing...` : '';
// });
</script>

<template>
  <div class="typing-indicator">
    <div class="dots">
      <span v-for="i in 3" :key="i" :style="`--delay: ${i * 0.2}s`"></span>
    </div>
    <div class="text">AI is typing...</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.typing-indicator {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  background-color: $light-color;
  border-radius: $border-radius-lg;
  margin: $spacing-sm auto;
  width: fit-content;
  box-shadow: $shadow-sm;

  .dots {
    display: flex;
    margin-right: $spacing-sm;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $primary-color;
      margin: 0 2px;
      animation: bounce 1s infinite ease-in-out;
      animation-delay: var(--delay);
    }
  }

  .text {
    font-size: 0.875rem;
    color: $secondary-color;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
