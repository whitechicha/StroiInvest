<script setup lang="ts">
const assetUrl = useAssetUrl()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <img
      class="hero-photo"
      :src="assetUrl('assets/source-1-8-1.webp')"
      alt="Одноэтажный дом с большой террасой и панорамными окнами"
      fetchpriority="high"
      width="1290"
      height="769"
    />
    <div class="hero-shade"></div>
    <div class="wrap hero-inner">
      <h1 id="hero-title">Земля. Дом.<br /><em>Ваше будущее.</em></h1>
      <p class="hero-copy">
        Строим дома для жизни. Сопровождаем оформление<br class="desktop-break" />
        земельных участков для ветеранов боевых действий.
      </p>
      <div class="hero-actions">
        <a class="btn gold" href="#houses"
          >Выбрать свой дом <span aria-hidden="true"><UiArrow direction="up-right" /></span></a
        ><a class="hero-link" href="#land"
          >Земля для ветеранов <span aria-hidden="true"><UiArrow direction="right" /></span
        ></a>
      </div>
      <div class="hero-bottom">
        <span>От первого решения — до вашего дома</span
        ><a href="#about" aria-label="Узнать о компании"
          ><span class="scroll-arrow" aria-hidden="true"><UiArrow direction="down" /></span></a
        ><span class="hero-count">КАМЕННЫЕ И МОДУЛЬНЫЕ ДОМА</span>
      </div>
    </div>
    <span class="image-note">Пример архитектуры из презентации компании</span>
  </section>
</template>
