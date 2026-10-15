<script setup lang="ts">
import { threeModuleVariants } from '~/data/houses'
const assetUrl = useAssetUrl()
const ready = useHydrationReady()
const { threeModuleSize, selectThreeModule, selectInterest, openPlan } = useLandingState()
const views = [1, 2, 3, 4]
</script>
<template>
  <div>
    <div class="house-feature">
      <div class="house-image">
        <img
          :src="assetUrl('assets/three-module-house.webp')"
          alt="Визуализация барна на три модуля с панорамным остеклением и палубой"
          loading="lazy"
          width="1500"
          height="843"
        />
        <span class="photo-label">БАРН НА ТРИ МОДУЛЯ / ВИЗУАЛИЗАЦИЯ</span>
      </div>
      <div class="house-description">
        <span class="eyebrow">03 / БОЛЬШЕ МЕСТА ДЛЯ ЖИЗНИ</span>
        <h3>Три модуля.<br />Пространство для семьи.</h3>
        <p>
          Две спальни и общая кухня-гостиная в одном доме. Панорамное остекление открывает вид на
          участок, а палуба из лиственницы продолжает пространство снаружи.
        </p>
        <dl class="house-specs">
          <div>
            <dt>Размеры по КП</dt>
            <dd class="three-module-dimensions"><span>7 × 7,5 м</span><span>8 × 7,5 м</span></dd>
          </div>
          <div>
            <dt>Стоимость по КП</dt>
            <dd>от 3 137 500 ₽</dd>
          </div>
        </dl>
        <a
          class="btn"
          href="#request"
          data-interest="Трехмодульный дом"
          @click="selectInterest('Трехмодульный дом')"
          >Обсудить этот дом <span><UiArrow /></span
        ></a>
        <a
          class="text-link"
          :href="assetUrl('assets/three-module-house.pdf')"
          target="_blank"
          rel="noopener"
          >Коммерческое предложение <span>PDF <UiArrow /></span
        ></a>
      </div>
    </div>
    <div class="module-options two-options" aria-label="Размер и стоимость трехмодульного дома">
      <button
        v-for="variant in threeModuleVariants"
        :key="variant.size"
        :disabled="!ready"
        class="module-option"
        :class="{ selected: threeModuleSize === variant.size }"
        :aria-pressed="threeModuleSize === variant.size"
        :data-three-size="variant.size"
        @click="selectThreeModule(variant.size)"
      >
        <span>{{ variant.size }} + палуба из лиственницы</span><strong>{{ variant.price }}</strong>
      </button>
    </div>
    <p id="three-module-selection" class="fineprint" aria-live="polite">
      Выбран размер {{ threeModuleSize }}. Палуба из лиственницы указана в обоих ценовых вариантах
      КП. Актуальную стоимость, состав поставки, фундамент, доставку, монтаж и подключения согласуем
      при расчете.
    </p>
    <p class="fineprint">
      52,5 и 60 м² — расчет по габаритам 7 × 7,5 и 8 × 7,5 м, без площади палубы. Полезная площадь и
      размеры помещений уточняются в проекте.
    </p>
    <div class="three-module-views" aria-label="Ракурсы трехмодульного дома">
      <img
        v-for="view in views"
        :key="view"
        :src="assetUrl(`assets/three-module-view-${view}.webp`)"
        :alt="`Визуализация трехмодульного дома — ракурс ${view}`"
        loading="lazy"
        width="733"
        height="412"
      />
    </div>
    <details class="technical">
      <summary>Технические параметры и планировки <span>+</span></summary>
      <div class="technical-inner">
        <dl>
          <div>
            <dt>Высота потолка</dt>
            <dd>2,1–2,45 м</dd>
          </div>
          <div>
            <dt>Толщина стены / утепление</dt>
            <dd>226 / 150 мм</dd>
          </div>
          <div>
            <dt>Толщина перегородки / утепление</dt>
            <dd>121 / 50 мм</dd>
          </div>
        </dl>
        <div class="three-module-plan-links">
          <button
            :disabled="!ready"
            class="text-link"
            data-plan="three-module"
            @click="openPlan('three-module')"
          >
            Планировка дома <span><UiArrow /></span>
          </button>
          <button
            :disabled="!ready"
            class="text-link"
            data-plan="three-module-bath"
            @click="openPlan('three-module-bath')"
          >
            Планировка бани <span><UiArrow /></span>
          </button>
        </div>
      </div>
    </details>
  </div>
</template>
