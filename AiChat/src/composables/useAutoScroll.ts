import { ref, onMounted, watch } from 'vue'

export function useAutoScroll(dependencies: any[]) {
  const containerRef = ref<HTMLElement | null>(null)

  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }

  onMounted(scrollToBottom)

  watch(() => dependencies, scrollToBottom, { deep: true })

  return containerRef
}
