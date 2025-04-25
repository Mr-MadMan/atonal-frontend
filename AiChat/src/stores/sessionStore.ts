import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatDetail, ChatHistory, ChatSession } from '@/services/types'
import request from '@/services/request'

export const useSessionStore = defineStore('session', () => {
  const sessionsList = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isFocus = ref(false)
  const currentSession = ref<ChatDetail[] | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(15)
  const total = ref(0)

  // 创建新会话
  const createNewSession = async () => {
    isFocus.value = true
    currentSessionId.value = null
    const res = await request.post<any, { chat_id: string }>('/api/sillconflow/start')
    const chat_id = res.chat_id
    currentSessionId.value = chat_id
    currentSession.value = []
  }

  // 切换会话
  const switchSession = async (chat_id: string) => {
    currentSessionId.value = chat_id
    const res = await request.get<any, { chat_id: string; details: ChatDetail[] }>(`/api/sillconflow/detail/${chat_id}`)
    console.log('---switchSession res---', res)
    currentSession.value = res.details
  }

  // 删除会话currentSession
  const deleteSession = async (chat_id: string) => {
    await request.delete<any, { chat_id: string }>(`/api/sillconflow/detail/${chat_id}`)
    sessionsList.value = sessionsList.value.filter((s) => s.chat_id !== chat_id)
    currentSessionId.value = null
    currentSession.value = []
  }

  // 更新会话标题
  const updateSessionTitle = (chat_id: string, title: string) => {
    const session = sessionsList.value.find((s) => s.chat_id === chat_id)
    if (session) {
      session.title = title
      // session.update_time = new Date().getTime()
    }
  }

  // 获取会话列表
  const getSessionsList = (page = 1) => {
    return request
      .get<any, ChatHistory>('/api/sillconflow/history', {
        params: {
          page,
          row: pageSize.value
        }
      })
      .then((res) => {
        if (page === 1) {
          sessionsList.value = []
          currentPage.value = 1
        }
        currentPage.value = page
        total.value = res.historys.total
        sessionsList.value = sessionsList.value.concat(res.historys.data)
        console.log('sessionsList list', sessionsList.value)
      })
  }

  return {
    isFocus,
    sessionsList,
    currentSessionId,
    currentSession,
    currentPage,
    pageSize,
    total,
    createNewSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    getSessionsList
  }
})
