<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSessionStore } from '@/stores/sessionStore'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  (event: 'send', content: string): void
}>()

const sessionStore = useSessionStore()
const input = ref('')
const inputRef = ref<HTMLInputElement>()

const handleSubmit = () => {
  if (input.value.trim() && !props.disabled) {
    emit('send', input.value)
    input.value = ''
  }
}

watch(
  () => sessionStore.isFocus,
  (val) => {
    if (val) {
      inputRef.value?.focus()
    }
  }
)
</script>

<template>
  <form class="message-input" @submit.prevent="handleSubmit">
    <input ref="inputRef" v-model="input" type="text" :disabled="disabled" placeholder="试试问我点什么吧" />
    <button type="submit" :disabled="disabled || !input.trim()">发送</button>
  </form>
</template>

<style lang="scss" scoped>
.message-input {
  display: flex;
  padding: 0.8rem;
}

.message-input input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: unset;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
  background-color: inherit;
  font-size: 1rem;
  color: var(--text-color);

  &:focus {
    outline: none;
  }
}

.message-input button {
  padding: 0.5rem 1rem;
  background-color: var(--button-bg);
  color: var(--button-text-color);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: var(--button-hover-bg);
  }
}

.message-input button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  color: var(--border-color);
}
</style>
