<script setup lang="ts">
import { plans } from '~/data/houses'
const assetUrl = useAssetUrl()
const { activePlan, choosePlan } = useLandingState()
const dialog = ref<HTMLDialogElement | null>(null)
const plan = computed(() => (activePlan.value ? plans[activePlan.value] : null))
const planTitle = computed(() => plan.value?.title.replace(/(\d) м²/g, '$1\u00a0м²'))
watch(activePlan, async (key) => {
  await nextTick()
  if (key !== activePlan.value) return
  if (key && dialog.value && !dialog.value.open) dialog.value.showModal()
  else if (!key) dialog.value?.close()
})
function close() {
  activePlan.value = null
}
function onBackdrop(event: MouseEvent) {
  const element = dialog.value
  if (!element || event.target !== element) return
  const rect = element.getBoundingClientRect()
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    close()
}
onBeforeUnmount(() => dialog.value?.close())
</script>
<template>
  <dialog
    id="plan-dialog"
    ref="dialog"
    aria-labelledby="plan-title"
    @cancel="close"
    @close="close"
    @click="onBackdrop"
  >
    <div class="dialog-head">
      <div>
        <span class="eyebrow">ПЛАНИРОВОЧНОЕ РЕШЕНИЕ</span>
        <h3 id="plan-title">{{ planTitle }}</h3>
      </div>
      <button class="close-dialog" type="button" aria-label="Закрыть планировку" @click="close">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
          <path
            d="m6 6 12 12M18 6 6 18"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    <div class="dialog-content" tabindex="0" role="region" aria-label="Схема и описание планировки">
      <img
        v-if="plan"
        id="plan-image"
        :src="assetUrl(`assets/${plan.image}`)"
        :alt="plan.alt"
        width="1000"
        height="750"
      />
      <a
        v-if="plan"
        class="plan-full-size"
        :href="assetUrl(`assets/${plan.image}`)"
        target="_blank"
        rel="noopener noreferrer"
      >
        Открыть схему крупнее <UiArrow direction="up-right" />
      </a>
      <p id="plan-note">
        {{
          plan?.note ||
          'Схема из материалов компании для предварительного выбора. Итоговые размеры, площади, конструктив и инженерия уточняются в рабочем проекте. Терраса рассчитывается отдельно.'
        }}
      </p>
    </div>
    <div class="dialog-actions">
      <button v-if="plan?.selectable !== false" id="choose-plan" class="btn" @click="choosePlan">
        Выбрать этот вариант <span><UiArrow /></span></button
      ><button class="text-link close-plan" @click="close">Вернуться к домам</button>
    </div>
  </dialog>
</template>
