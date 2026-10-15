<script setup lang="ts">
const assetUrl = useAssetUrl()
const { selectInterest } = useLandingState()
</script>

<template>
  <section class="land-section" id="land">
    <div class="wrap land-grid">
      <div class="land-title">
        <div class="eyebrow light">ОТДЕЛЬНОЕ НАПРАВЛЕНИЕ</div>
        <h2>Своя земля.<br /><em>Новая глава.</em></h2>
        <p>
          Сопровождение оформления земельных участков для ветеранов боевых действий по всей
          территории РФ.
        </p>
        <a
          class="btn gold"
          href="#request"
          data-interest="Земля для ветерана"
          @click="selectInterest('Земля для ветерана')"
          >Обсудить свою ситуацию <span><UiArrow direction="up-right" /></span
        ></a>
        <div class="land-footnote">
          Сначала проверяем основания.<br />Затем заключаем договор с ветераном.
        </div>
      </div>
      <div class="land-steps">
        <article>
          <span>01</span>
          <div>
            <h3>Разбираемся в вашей ситуации</h3>
            <p>
              Изучаем документы, статус и ранее реализованные права. Оцениваем возможные основания в
              выбранном регионе.
            </p>
          </div>
        </article>
        <article>
          <span>02</span>
          <div>
            <h3>Согласуем условия договора</h3>
            <p>
              Фиксируем объем сопровождения, стоимость, порядок оплаты и документ, который считается
              результатом.
            </p>
          </div>
        </article>
        <article>
          <span>03</span>
          <div>
            <h3>Сопровождаем оформление</h3>
            <p>
              Готовим документы и заявления, сопровождаем взаимодействие с уполномоченными органами.
            </p>
          </div>
        </article>
        <div class="land-note">
          <span aria-hidden="true"><UiArrow direction="up-right" /></span>
          <p>
            Возможность и порядок предоставления участка проверяются индивидуально. Статус ветерана
            сам по себе не означает гарантированного получения земли.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
