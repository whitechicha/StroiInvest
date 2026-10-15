<script setup lang="ts">
import type { LocationResponse, LocationSuggestion } from '~~/shared/types/location'
const model = defineModel<string>({ required: true })
const config = useRuntimeConfig()
const endpoint = `${config.app.baseURL.replace(/\/$/, '')}/api/locations`
const root = ref<HTMLDivElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLUListElement | null>(null)
const isOpen = ref(false)
const active = ref(-1)
const opensUp = ref(false)
const maxHeight = ref(320)
const announcement = ref('')
const matches = ref<LocationSuggestion[]>([])
const loading = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
let controller: AbortController | undefined
let revision = 0
let scheduledQuery = ''
const feedback = computed(() =>
  loading.value
    ? 'Ищем населённые пункты и регионы…'
    : failed.value
      ? 'Подсказки временно недоступны. Укажите место вручную — заявку можно отправить.'
      : 'Ничего не найдено. Уточните регион или оставьте введённое название.',
)
const activeId = computed(() =>
  isOpen.value && active.value >= 0 ? `location-option-${active.value}` : undefined,
)
const status = computed(
  () =>
    announcement.value ||
    (isOpen.value
      ? !loading.value && !failed.value && matches.value.length
        ? `Вариантов: ${matches.value.length}. Выберите стрелками и Enter или нажатием.`
        : feedback.value
      : ''),
)
function cancelSearch() {
  clearTimeout(timer)
  controller?.abort()
  revision++
  loading.value = false
}
function close() {
  cancelSearch()
  isOpen.value = false
  active.value = -1
}
watch(model, (value) => {
  if (isOpen.value && value.trim() !== scheduledQuery) open()
})
function position() {
  if (!isOpen.value || !input.value) return
  const viewport = window.visualViewport
  const top = viewport?.offsetTop || 0
  const bottom = top + (viewport?.height || window.innerHeight)
  const rect = input.value.getBoundingClientRect()
  const below = bottom - rect.bottom - 12
  const above = rect.top - top - 12
  opensUp.value = below < 170 && above > below
  maxHeight.value = Math.max(120, Math.min(320, opensUp.value ? above : below))
}
function open(value = model.value) {
  cancelSearch()
  announcement.value = ''
  active.value = -1
  failed.value = false
  matches.value = []
  const query = value.trim()
  scheduledQuery = query
  isOpen.value = query.length >= 2
  if (!isOpen.value) return
  loading.value = true
  const current = revision
  timer = setTimeout(async () => {
    controller = new AbortController()
    try {
      const response = await $fetch<LocationResponse>(endpoint, {
        method: 'POST',
        body: { query },
        signal: controller.signal,
        timeout: 6000,
        retry: 0,
      })
      if (current !== revision || model.value.trim() !== query) return
      matches.value = response.suggestions
    } catch {
      if (current !== revision) return
      failed.value = true
    } finally {
      if (current === revision) {
        loading.value = false
        nextTick(position)
      }
    }
  }, 300)
  nextTick(position)
}
function onInput(event: Event) {
  if (!(event as InputEvent).isComposing) open((event.target as HTMLInputElement).value)
}
function choose(index: number) {
  const item = matches.value[index]
  if (!item) return
  model.value = item.value
  close()
  announcement.value = `Выбрано: ${model.value}`
  input.value?.focus({ preventScroll: true })
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    event.preventDefault()
    return
  }
  if (event.key === 'Tab') {
    close()
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (!isOpen.value) open()
    if (!isOpen.value || !matches.value.length) return
    event.preventDefault()
    const step = event.key === 'ArrowDown' ? 1 : -1
    active.value =
      active.value < 0
        ? step > 0
          ? 0
          : matches.value.length - 1
        : (active.value + step + matches.value.length) % matches.value.length
    nextTick(() => list.value?.children[active.value]?.scrollIntoView({ block: 'nearest' }))
  } else if (event.key === 'Enter' && isOpen.value && active.value >= 0) {
    event.preventDefault()
    choose(active.value)
  }
}
function onOutside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}
function onFocusOut(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node | null)) close()
}
onMounted(() => {
  document.addEventListener('pointerdown', onOutside)
  window.addEventListener('resize', position)
  window.addEventListener('scroll', position, true)
  window.visualViewport?.addEventListener('resize', position)
  window.visualViewport?.addEventListener('scroll', position)
})
onBeforeUnmount(() => {
  cancelSearch()
  document.removeEventListener('pointerdown', onOutside)
  window.removeEventListener('resize', position)
  window.removeEventListener('scroll', position, true)
  window.visualViewport?.removeEventListener('resize', position)
  window.visualViewport?.removeEventListener('scroll', position)
})
</script>
<template>
  <div id="location-field" ref="root" class="location-field" @focusout="onFocusOut">
    <label for="region">Населённый пункт или регион</label>
    <div class="location-control">
      <input
        id="region"
        ref="input"
        v-model="model"
        name="region"
        type="text"
        placeholder="Город, село, посёлок или регион"
        maxlength="150"
        required
        autocomplete="off"
        spellcheck="false"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        :aria-busy="loading"
        aria-controls="location-options"
        aria-describedby="location-help"
        :aria-activedescendant="activeId"
        @input="onInput"
        @compositionend="onInput"
        @focus="open()"
        @keydown="onKey"
      />
      <div
        id="location-dropdown"
        class="location-dropdown"
        :class="{ 'opens-up': opensUp }"
        :style="{ maxHeight: `${maxHeight}px` }"
        :hidden="!isOpen"
      >
        <ul
          id="location-options"
          ref="list"
          role="listbox"
          aria-label="Населённые пункты и регионы"
          @pointerdown.prevent
        >
          <li
            v-for="(item, index) in matches"
            :id="`location-option-${index}`"
            :key="item.id"
            role="option"
            :aria-selected="active === index"
            @click="choose(index)"
          >
            <strong>{{ item.name }}</strong
            ><span>{{ item.kind }}{{ item.context ? ` · ${item.context}` : '' }}</span>
          </li>
        </ul>
        <p id="location-empty" class="location-empty" :hidden="matches.length > 0">
          {{ feedback }}
        </p>
        <div class="location-credit">
          Подсказки
          <a href="https://dadata.ru/" target="_blank" rel="noopener noreferrer">DaData</a>
        </div>
      </div>
    </div>
    <p id="location-help" class="location-help">
      Введите от двух букв. Для подсказок название передаётся в DaData. Можно указать место вручную.
    </p>
    <span id="location-status" class="sr-only" role="status" aria-live="polite">{{ status }}</span>
  </div>
</template>
