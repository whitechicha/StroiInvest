<script setup lang="ts">
const ready = useHydrationReady()
import { buildWhatsAppUrl } from '~/utils/whatsapp'
const { form, moduleSize, threeModuleSize, selectInterest } = useLandingState()
const config = useRuntimeConfig()
const isLand = computed(() => form.value.interest === 'Земля для ветерана')
const submitError = ref('')
const directLink = computed(
  () => `https://wa.me/${String(config.public.whatsappPhone).replace(/\D/g, '')}`,
)
const phoneLabel = computed(() => {
  const digits = String(config.public.whatsappPhone).replace(/\D/g, '')
  return digits.length === 11 && digits.startsWith('7')
    ? `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
    : `+${digits}`
})
function submit(event: SubmitEvent) {
  submitError.value = ''
  const element = event.currentTarget as HTMLFormElement
  if (!element.reportValidity()) return
  if (!form.value.region.trim()) {
    submitError.value = 'Укажите город или регион.'
    return
  }
  try {
    window.location.assign(
      buildWhatsAppUrl(
        String(config.public.whatsappPhone),
        form.value,
        moduleSize.value,
        threeModuleSize.value,
      ),
    )
  } catch {
    submitError.value = 'Не удалось открыть WhatsApp. Напишите нам по номеру рядом с формой.'
  }
}
</script>
<template>
  <section id="request" class="request-section">
    <div class="wrap request-grid">
      <div>
        <div class="eyebrow light">СЛЕДУЮЩИЙ ШАГ</div>
        <h2>Начнем<br /><em>с вашей идеи.</em></h2>
        <p>Выберите направление и расскажите, каким вы видите свой дом или участок.</p>
        <div class="request-note">
          Обсудим ваш проект в WhatsApp<br /><span
            >Заполните форму — ваши пожелания появятся в сообщении для компании.</span
          ><a class="whatsapp-contact" :href="directLink" target="_blank" rel="noopener noreferrer"
            >{{ phoneLabel }} <UiArrow
          /></a>
        </div>
      </div>
      <form id="project-form" @submit.prevent="submit">
        <fieldset class="request-fields" :disabled="!ready">
          <div class="form-row">
            <label
              >Ваш интерес<select
                id="interest"
                v-model="form.interest"
                name="interest"
                @change="selectInterest(form.interest)"
              >
                <option>Каменный дом</option>
                <option>Двухмодульный дом</option>
                <option>Трехмодульный дом</option>
                <option>Земля для ветерана</option>
              </select></label
            ><LocationAutocomplete v-model="form.region" />
          </div>
          <div id="house-fields" class="form-row" :hidden="isLand">
            <label
              >Желаемая площадь, м²<input
                id="area"
                v-model.number="form.area"
                name="area"
                type="number"
                step="0.1"
                min="10"
                max="1500"
                placeholder="Например, 110"
                :disabled="isLand" /></label
            ><label
              >Комплектация<select
                id="package"
                v-model="form.completion"
                name="package"
                :disabled="isLand"
              >
                <option>Пока не определился</option>
                <option>Теплый контур</option>
                <option>Под отделку</option>
                <option>Под ключ</option>
              </select></label
            >
          </div>
          <label
            >Что важно учесть?<textarea
              id="message"
              v-model="form.message"
              name="message"
              :placeholder="
                isLand
                  ? 'Выбранный регион и вопросы по оформлению участка. Не указывайте паспортные данные.'
                  : 'Состав семьи, пожелания к планировке, есть ли участок…'
              "
              maxlength="2000"
              rows="3"
            />
          </label>
          <button class="btn gold" type="submit">
            Отправить запрос в WhatsApp <span><UiArrow /></span>
          </button>
          <p class="form-hint">
            Откроется WhatsApp с готовым сообщением. Для отправки нажмите «Отправить» в чате.
          </p>
          <p v-if="submitError" role="alert" class="form-hint">{{ submitError }}</p>
        </fieldset>
      </form>
    </div>
  </section>
</template>
