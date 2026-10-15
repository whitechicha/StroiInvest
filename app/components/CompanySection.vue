<script setup lang="ts">
const assetUrl = useAssetUrl()
</script>

<template>
  <section class="section about" id="about">
    <div class="wrap about-grid">
      <div>
        <div class="eyebrow">О КОМПАНИИ</div>
        <h2>Большое дело<br />начинается<br /><em>с доверия.</em></h2>
      </div>
      <div class="about-text">
        <p class="intro">
          «Стройинвест» — строительная компания, которая помогает пройти путь от выбора участка и
          проекта до готового дома.
        </p>
        <p>
          Строим для семей, военнослужащих и участников СВО. Учитываем образ жизни, состав семьи и
          бюджет. Отдельное направление — сопровождение оформления земельных участков для ветеранов
          боевых действий.
        </p>
        <div class="about-facts">
          <div>
            <span>Договор</span>
            <p>Состав работ, оплата и результат зафиксированы заранее</p>
          </div>
          <div>
            <span>Контроль</span>
            <p>Согласование этапов и изменений, фото- и видеоотчеты</p>
          </div>
        </div>
        <a
          class="text-link"
          :href="assetUrl('assets/stroyinvest.pdf')"
          target="_blank"
          rel="noopener"
          >Презентация компании <span>PDF <UiArrow direction="up-right" /></span
        ></a>
      </div>
    </div>
  </section>
</template>
