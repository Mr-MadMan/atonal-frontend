<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { Message } from '@/services/types'
import { useChatStore } from '@/stores/chatStore'
import IconCopy from './IconCopy.vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

// 自定义渲染markdown并高亮代码
function renderMarkdown(content: string | any): string {
  // 确保content是字符串
  if (typeof content !== 'string') {
    console.warn('renderMarkdown收到非字符串值:', content)
    return String(content || '') // 尝试转换为字符串或返回空字符串
  }

  // 使用正则表达式处理代码块
  const processedContent = content.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const highlightedCode = hljs.highlight(code, { language }).value
    return `<pre><code class="hljs language-${language}">${highlightedCode}</code></pre>`
  })

  // 使用marked处理剩余的Markdown，并断言为string类型
  return marked(processedContent) as string
}

const props = defineProps<{
  message: Message
}>()

const { copy, isSupported, copied } = useClipboard({ legacy: true })
const chataStore = useChatStore()

const messageClass = computed(() => ({
  'message-item': true,
  [`role-${props.message.role}`]: true,
  'is-streaming': props.message.isStreaming,
  'has-error': props.message.content.includes('[Error]')
}))

const handleCopy = () => {
  if (isSupported) {
    copy(props.message.content)
  }
}
</script>

<template>
  <div :class="messageClass">
    <div class="message-header">
      <span class="message-role">
        {{ message.role === 'user' ? '你' : message.content_type === 'think' ? '思考过程' : 'AI回答' }}
      </span>
      <button v-if="isSupported && message.content" class="copy-button" title="Copy to clipboard" @click="handleCopy">
        {{ copied ? '√' : `⎘ 复制` }}
      </button>
    </div>
    <div class="message-content">
      <template v-if="message.role === 'assistant' && !message.content">
        <div class="streaming-animation">
          <span v-for="item in 3" :key="item" class="dot"></span>
        </div>
      </template>
      <pre v-else-if="message.content_type === 'think'">{{ message.content }}</pre>
      <template v-else>
        <div
          class="answer-content"
          v-html="
            message.content && typeof message.content === 'string'
              ? renderMarkdown(message.content)
              : String(message.content || '')
          "
        ></div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';

.message-item {
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  max-width: 85%;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: $shadow-sm;
  color: var(--text-color);

  &.role-user {
    align-self: flex-end;
    background-color: var(--user-message-bg);
    // color: var(--user-message-text);
    border-bottom-right-radius: $border-radius-xs;

    // .message-header {
    //   color: var(--user-message-header);
    // }

    .message-role {
      text-align: right;
    }
  }

  &.role-assistant {
    align-self: flex-start;
    background-color: var(--assistant-message-bg);
    // color: var(--assistant-message-text);
    border-bottom-left-radius: $border-radius-xs;

    // .message-header {
    //   color: var(--assistant-message-header);
    // }
  }

  &.is-streaming {
    border-left: 3px solid var(--streaming-indicator);
  }

  &.has-error {
    border-left: 3px solid var(--error-color);
  }
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-xs;
  font-size: 0.8rem;
  font-weight: 600;
  gap: $spacing-sm;
}

.message-role {
  flex: 1;
}

.message-time {
  opacity: 0.7;
  font-size: 0.7rem;
  color: inherit;
}

.copy-button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  padding: $spacing-xs;
  color: var(--text-color);

  &:hover {
    opacity: 1;
  }
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;

  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    background-color: var(--header-bg);
    padding: $spacing-sm;
    border-radius: $border-radius-md;
    font-size: 0.8rem;
  }
}

.streaming-animation {
  display: flex;
  gap: $spacing-xs;
  padding: $spacing-sm 0;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
    opacity: 0.6;
    animation: pulse 1.5s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
</style>
