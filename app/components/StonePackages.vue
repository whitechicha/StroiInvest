<script setup lang="ts">
const assetUrl = useAssetUrl()
const { selectPackage } = useLandingState()
</script>

<template>
  <section class="section completion">
    <div class="wrap">
      <div class="section-top">
        <div>
          <div class="eyebrow">КОМПЛЕКТАЦИИ КАМЕННОГО ДОМА</div>
          <h2>Ровно столько,<br /><em>сколько вам нужно.</em></h2>
        </div>
        <p>Вы выбираете уровень готовности.<br />Мы закрепляем состав работ в договоре.</p>
      </div>
      <div class="completion-grid">
        <article>
          <span class="step-number">01</span>
          <h3>Теплый контур</h3>
          <p>Основа для дальнейшего обустройства своими силами.</p>
          <ul>
            <li>Фундамент, стены и кровля</li>
            <li>Окна и входная дверь</li>
          </ul>
          <a href="#request" data-package="Теплый контур" @click="selectPackage('Теплый контур')"
            >Обсудить комплектацию <span><UiArrow direction="up-right" /></span
          ></a>
        </article>
        <article>
          <span class="step-number">02</span>
          <h3>Под отделку</h3>
          <p>Основные работы завершены. Можно выбирать интерьер.</p>
          <ul>
            <li>Все работы теплого контура</li>
            <li>Инженерные системы</li>
            <li>Подготовка под чистовую отделку</li>
          </ul>
          <a href="#request" data-package="Под отделку" @click="selectPackage('Под отделку')"
            >Обсудить комплектацию <span><UiArrow direction="up-right" /></span
          ></a>
        </article>
        <article class="featured">
          <span class="step-number">03</span>
          <h3>Под ключ</h3>
          <p>Дом с чистовой отделкой по согласованной спецификации.</p>
          <ul>
            <li>Все работы комплектации «Под отделку»</li>
            <li>Чистовая отделка по спецификации</li>
          </ul>
          <a href="#request" data-package="Под ключ" @click="selectPackage('Под ключ')"
            >Обсудить комплектацию <span><UiArrow direction="up-right" /></span
          ></a>
        </article>
      </div>
      <p class="fineprint">
        Земля, мебель, внешние подключения и благоустройство не входят в базовое сравнение и
        рассчитываются отдельно.
      </p>
    </div>
  </section>
</template>
