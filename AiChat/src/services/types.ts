export interface ChatConfig {
  apiEndpoint: string
  model?: string
  temperature?: number
  maxTokens?: number
  headers?: Record<string, string>
}

export interface StreamChunk {
  choices?: Array<{
    delta: {
      content?: string
    }
  }>
}

export interface ChatSession {
  chat_id: string
  title: string
  id: number
  create_time: number
  update_time: number
  is_title: boolean
  user_id: number
}

export interface ChatHistory {
  historys: {
    data: ChatSession[]
    page: number
    row: number
    total: number
    total_page: number
  }
  user_id: number
}

export interface ChatDetail {
  chat_id: string
  content: string
  content_type: string
  create_time?: number
  update_time?: number | null
  role: string
  id: number
}

export interface Message extends ChatDetail {
  isStreaming?: boolean
}
