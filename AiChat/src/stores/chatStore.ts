import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSessionStore } from './sessionStore'
import type { ChatDetail, Message } from '@/services/types'
import request from '@/services/request'
import { chatApiService } from '@/services/api'
// import { useChatStream } from '@/composables/useChatStream'

export const useChatStore = defineStore('chat', () => {
  const sessionStore = useSessionStore()
  const isLoading = ref(false)
  // 当前会话的消息
  // const messages = ref<Message[]>([])
  const error = ref<Error | null>(null)
  const messages = computed<Message[]>(() => {
    return sessionStore.currentSession || []
  })

  // 发送消息
  const sendMessage = async (content: string) => {
    const chat_id = sessionStore.currentSessionId!
    const userMessage: Message = {
      id: Date.now(),
      content,
      role: 'user',
      create_time: Date.now(),
      update_time: null,
      chat_id,
      content_type: 'text'
    }

    messages.value.push(userMessage)
    isLoading.value = true
    error.value = null

    const assistantMessage: Message = {
      id: Date.now(),
      content: '',
      role: 'assistant',
      create_time: Date.now(),
      update_time: null,
      chat_id,
      content_type: 'think',
      isStreaming: true
    }

    messages.value.push(assistantMessage)

    const assistantResult: Message = {
      id: Date.now(),
      content: '',
      role: 'assistant',
      create_time: Date.now(),
      update_time: null,
      chat_id,
      content_type: 'text',
      isStreaming: true
    }

    await chatApiService.streamChatResponse(
      { content, chat_id },
      (chunk) => {
        console.log('chunk', chunk)
        const index = messages.value.findIndex((msg) => msg.role === 'assistant' && msg.content_type === 'think')
        if (index !== -1) {
          messages.value[index].content += chunk.content
        }

        if (chunk.action === 'text') {
          const index = messages.value.findIndex((msg) => msg.role === 'assistant' && msg.content_type === 'text')
          if (index < 0) {
            messages.value.push(assistantResult)
          }
          messages.value[index].content += chunk.content
        }
      },
      () => {
        const index = messages.value.findIndex((msg) => msg.id === assistantMessage.id)
        if (index !== -1) {
          messages.value[index].isStreaming = false
        }
        isLoading.value = false
      },
      (err) => {
        error.value = err
        isLoading.value = false
        const index = messages.value.findIndex((msg) => msg.id === assistantMessage.id)
        if (index !== -1) {
          messages.value[index].content += '\n\n[Error: Failed to get response]'
          messages.value[index].isStreaming = false
        }
      }
    )
  }

  return {
    messages,
    isLoading,
    sendMessage
  }
})
