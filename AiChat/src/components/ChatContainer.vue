<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useChatStore } from '@/stores/chatStore'
import { useSessionStore } from '@/stores/sessionStore'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'

const chatStore = useChatStore()
const sessionStore = useSessionStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const containerRef = ref<HTMLElement | null>(null)

const handleSend = async (content: string) => {
  if (sessionStore.currentSession.length === 0) {
    await sessionStore.createNewSession()
  }
  chatStore.sendMessage(content)
}

// 滚动到底部
watchEffect(() => {
  if (containerRef.value && chatStore.messages.length) {
    containerRef.value.scrollTo({
      top: containerRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }
})

// 监听主题变化
watch(
  isDark,
  (newVal) => {
    const hljsTheme = document.getElementById('hljs-theme')
    if (newVal) {
      hljsTheme?.setAttribute('href', 'public/highlight-dark.css')
    } else {
      hljsTheme?.setAttribute('href', 'public/highlight-light.css')
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="chat-app" :class="{ dark: isDark }">
    <div class="chat-header">
      <button class="theme-toggle" @click="toggleDark()">
        <transition name="slide-up" mode="out-in">
          <span :key="isDark ? 'moon' : 'sun'">
            {{ isDark ? '🌙' : '☀️' }}
          </span>
        </transition>
      </button>
    </div>
    <div ref="containerRef" class="chat-container">
      <MessageList :messages="chatStore.messages" />
    </div>

    <div class="input-container">
      <MessageInput :disabled="chatStore.isLoading" @send="handleSend" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';

.chat-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  transition: all 0.3s ease;
}

.chat-header {
  display: flex;
  justify-content: flex-end;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: $spacing-xs;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background-color: var(--hover-bg);
  }
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
  scroll-behavior: smooth;
}

.input-container {
  background-color: var(--header-bg);
  border-radius: $border-radius-lg;

  .input-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-xs;

    .model-info {
      font-size: 0.75rem;
      color: var(--secondary-text);
    }
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(0, 20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(0, -20px);
}
</style>
