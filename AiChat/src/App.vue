<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import ChatContainer from './components/ChatContainer.vue'
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <ChatContainer />
    </div>
  </div>
</template>

<style>
@import '@/styles/global.scss';

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
}
</style>
