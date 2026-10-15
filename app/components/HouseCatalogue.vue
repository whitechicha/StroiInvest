<script setup lang="ts">
import { plans } from '~/data/houses'
const ready = useHydrationReady()
const assetUrl = useAssetUrl()
const { moduleSize, selectModule, selectInterest, openPlan } = useLandingState()
const stoneProjects = [
  { key: '80', name: 'КОМПАКТНЫЙ', description: 'Две спальни и общая семейная зона' },
  { key: '110', name: 'СЕМЕЙНЫЙ', description: 'Больше пространства для вашей семьи' },
  { key: '140', name: 'ПРОСТОРНЫЙ', description: 'Кабинет, гостевая и личное пространство' },
] as const
type HouseTab = 'stone' | 'modular' | 'three-modular'
const tabs: { key: HouseTab; label: string; shortLabel: string; area: string }[] = [
  { key: 'stone', label: 'Каменные дома', shortLabel: 'Каменные', area: '80–160 м²' },
  { key: 'modular', label: 'Двухмодульные дома', shortLabel: '2 модуля', area: '30–40 м²' },
  { key: 'three-modular', label: 'Трехмодульные дома', shortLabel: '3 модуля', area: '52,5–60 м²' },
]
const activeTab = ref<HouseTab>('stone')
function onTabKey(event: KeyboardEvent, current: HouseTab) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const index = tabs.findIndex((tab) => tab.key === current)
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  activeTab.value = tabs[next]!.key
  nextTick(() => document.getElementById(activeTab.value + '-tab')?.focus())
}
</script>
<template>
  <section class="section houses" id="houses">
    <div class="wrap">
      <div class="section-top">
        <div>
          <div class="eyebrow">ДОМА ДЛЯ ЖИЗНИ</div>
          <h2>Разные решения.<br /><em>Ваш характер.</em></h2>
        </div>
        <p>Для постоянной жизни, загородного отдыха<br />или первого семейного дома.</p>
      </div>
      <div class="tabs" role="tablist" aria-label="Тип дома">
        <button
          v-for="tab in tabs"
          :id="`${tab.key}-tab`"
          :key="tab.key"
          :disabled="!ready"
          role="tab"
          :aria-selected="activeTab === tab.key"
          :aria-controls="`${tab.key}-panel`"
          :aria-label="tab.label"
          :tabindex="activeTab === tab.key ? 0 : -1"
          :data-tab="tab.key"
          @click="activeTab = tab.key"
          @keydown="onTabKey($event, tab.key)"
        >
          <span class="tab-label-full">{{ tab.label }}</span
          ><span class="tab-label-short" aria-hidden="true">{{ tab.shortLabel }}</span
          ><span class="tab-area">{{ tab.area }}</span>
        </button>
      </div>
      <div
        class="house-panel"
        id="stone-panel"
        :hidden="activeTab !== 'stone'"
        role="tabpanel"
        aria-labelledby="stone-tab"
      >
        <div class="house-feature">
          <div class="house-image">
            <img
              :src="assetUrl('assets/stone-house.webp')"
              alt="Каменный одноэтажный дом со скатной кровлей"
              loading="lazy"
              width="1350"
              height="1013"
            /><span class="photo-label">ПРИМЕР АРХИТЕКТУРЫ</span>
          </div>
          <div class="house-description">
            <span class="eyebrow">01 / ОСНОВАТЕЛЬНО И НАДОЛГО</span>
            <h3>Дом, в котором<br />хочется остаться.</h3>
            <p>
              Каменный дом с планировкой под вашу семью. Общая кухня-гостиная, отдельные спальни,
              хозяйственная зона и выход на террасу.
            </p>
            <dl class="house-specs">
              <div>
                <dt>Площадь</dt>
                <dd>80–160 м²</dd>
              </div>
              <div>
                <dt>Комплектация</dt>
                <dd>3 варианта</dd>
              </div>
            </dl>
            <a
              class="btn"
              href="#request"
              data-interest="Каменный дом"
              @click="selectInterest('Каменный дом')"
              >Подобрать проект <span><UiArrow direction="up-right" /></span></a
            ><small>Стоимость и сроки — после выбора проекта и оценки участка.</small>
          </div>
        </div>
        <div class="project-intro">
          <h3>Планировки каменных домов</h3>
          <p>Нажмите на карточку, чтобы рассмотреть схему и выбрать свой вариант.</p>
        </div>
        <div class="project-grid">
          <button
            v-for="project in stoneProjects"
            :key="project.key"
            :disabled="!ready"
            class="project-card"
            :data-plan="project.key"
            :aria-label="`Открыть планировку: ${plans[project.key].title}`"
            @click="openPlan(project.key)"
          >
            <span class="project-top">{{ project.name }}</span>
            <strong>{{ plans[project.key].area }} <small>м²</small></strong>
            <span class="project-description">{{ project.description }}</span>
            <span class="project-bottom">Открыть планировку <UiArrow direction="right" /></span>
          </button>
        </div>
        <p class="fineprint">
          Площади и схемы — ориентиры для выбора. Рабочий проект и привязка к участку согласуются
          отдельно. Терраса в указанную площадь не включена.
        </p>
      </div>
      <div
        class="house-panel"
        id="modular-panel"
        role="tabpanel"
        aria-labelledby="modular-tab"
        :hidden="activeTab !== 'modular'"
      >
        <div class="house-feature">
          <div class="house-image">
            <img
              :src="assetUrl('assets/source-0-1-0.webp')"
              alt="Визуализация двухмодульного дома с фасадом из дерева и металла"
              loading="lazy"
              width="1500"
              height="843"
            /><span class="photo-label">ДВУХМОДУЛЬНЫЙ ДОМ / ВИЗУАЛИЗАЦИЯ</span>
          </div>
          <div class="house-description">
            <span class="eyebrow">02 / КОМПАКТНО И ПРОДУМАННО</span>
            <h3>Небольшой дом.<br />Большие планы.</h3>
            <p>
              Два модуля образуют единое пространство. В коммерческом предложении предусмотрены
              планировочные решения для дома и бани.
            </p>
            <dl class="house-specs">
              <div>
                <dt>Размер</dt>
                <dd>6 × 5 — 8 × 5 м</dd>
              </div>
              <div>
                <dt>Стоимость по КП</dt>
                <dd>от 1 612 500 ₽</dd>
              </div>
            </dl>
            <a
              class="btn"
              href="#request"
              data-interest="Двухмодульный дом"
              @click="selectInterest('Двухмодульный дом')"
              >Выбрать комплектацию <span><UiArrow direction="up-right" /></span></a
            ><a
              class="text-link"
              :href="assetUrl('assets/modular-house.pdf')"
              target="_blank"
              rel="noopener"
              >Коммерческое предложение <span>PDF <UiArrow direction="up-right" /></span
            ></a>
          </div>
        </div>
        <div class="module-options" aria-label="Размер и стоимость двухмодульного дома">
          <button
            :disabled="!ready"
            class="module-option"
            :class="{ selected: moduleSize === '6 × 5 м' }"
            :aria-pressed="moduleSize === '6 × 5 м'"
            data-size="6 × 5 м"
            @click="selectModule('6 × 5 м')"
          >
            <span>30 м² / 6 × 5 м</span><strong>1 612 500 ₽</strong></button
          ><button
            :disabled="!ready"
            class="module-option"
            :class="{ selected: moduleSize === '7 × 5 м' }"
            :aria-pressed="moduleSize === '7 × 5 м'"
            data-size="7 × 5 м"
            @click="selectModule('7 × 5 м')"
          >
            <span>35 м² / 7 × 5 м</span><strong>2 088 125 ₽</strong></button
          ><button
            :disabled="!ready"
            class="module-option"
            :class="{ selected: moduleSize === '8 × 5 м' }"
            :aria-pressed="moduleSize === '8 × 5 м'"
            data-size="8 × 5 м"
            @click="selectModule('8 × 5 м')"
          >
            <span>40 м² / 8 × 5 м</span><strong>2 356 250 ₽</strong>
          </button>
        </div>
        <p id="module-selection" class="fineprint" aria-live="polite">
          Выбран размер {{ moduleSize }}. Цены приведены из предоставленного КП; актуальность,
          состав поставки, фундамент, доставка и монтаж уточняются при расчете.
        </p>
        <details class="technical">
          <summary>Технические параметры и планировка <span>+</span></summary>
          <div class="technical-inner">
            <dl>
              <div>
                <dt>Высота потолка</dt>
                <dd>2,0–2,2 м</dd>
              </div>
              <div>
                <dt>Толщина стены / утепление</dt>
                <dd>176 / 100 мм</dd>
              </div>
              <div>
                <dt>Толщина перегородки / утепление</dt>
                <dd>121 / 50 мм</dd>
              </div>
            </dl>
            <button
              :disabled="!ready"
              class="text-link"
              data-plan="module"
              @click="openPlan('module')"
            >
              Посмотреть планировку дома <span><UiArrow direction="up-right" /></span>
            </button>
          </div>
        </details>
      </div>
      <div
        id="three-modular-panel"
        class="house-panel"
        role="tabpanel"
        aria-labelledby="three-modular-tab"
        :hidden="activeTab !== 'three-modular'"
      >
        <ThreeModuleHouse />
      </div>
    </div>
  </section>
</template>
