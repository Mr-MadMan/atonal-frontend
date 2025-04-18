<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import ChatContainer from './components/ChatContainer.vue'
import type { ChatConfig } from '@/services/types'

const config: ChatConfig = {
  apiEndpoint: 'https://api.your-ai-service.com/v1/chat/completions',
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000,
  headers: {
    Authorization: 'Bearer your-api-key',
  },
}
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <ChatContainer :config="config" />
    </div>
  </div>
</template>

<style>
@import '@/styles/global.scss';
#app {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}
</style>
