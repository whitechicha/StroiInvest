export function useHydrationReady() {
  const ready = ref(false)
  onMounted(() => {
    ready.value = true
  })
  return ready
}
