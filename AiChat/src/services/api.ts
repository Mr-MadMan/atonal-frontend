import axios, { AxiosResponse, CancelTokenSource } from 'axios'
import request from './request'
import { ChatDetail, Message, StreamChunk } from './types'
import { TOKEN_NAME } from '@/config/global'
import proxy from '@/config/host'

const env = import.meta.env.MODE || 'dev'

export class ChatApiService {
  private cancelTokenSource: CancelTokenSource | null = null

  async streamChatResponse(
    message,
    onData: (chunk: { action: string; chat_id: string; content: string; id: number }) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // 取消之前的请求
    this.cancelRequest()

    this.cancelTokenSource = axios.CancelToken.source()

    try {
      const response = await fetch(`${proxy[env].API}api/sillconflow/chat/${message.chat_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'session-id': localStorage.getItem(TOKEN_NAME) || ''
        },
        body: JSON.stringify({ chat_content: message.content })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      console.log('---stream---', response)

      const decoder = new TextDecoder()
      let buffer = ''

      let reading = true
      while (reading) {
        const { done, value } = await reader.read()

        if (done) {
          onComplete()
          reading = false
          break
        }

        const decoded = decoder.decode(value, { stream: true })
        buffer += decoded

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        // console.log('---buffer---', buffer)

        lines.forEach((line) => {
          console.log('line', line)

          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6))

            if (data.actions === 'end') {
              onComplete()
              reading = false
              return
            }

            try {
              data && onData(data)
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        })
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        onError(error instanceof Error ? error : new Error('Unknown error'))
      }
    }
  }

  cancelRequest(): void {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Request canceled by user')
      this.cancelTokenSource = null
    }
  }
}

export const chatApiService = new ChatApiService()
