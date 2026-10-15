<script setup lang="ts">
const assetUrl = useAssetUrl()
</script>
<template>
  <footer>
    <div class="wrap">
      <div class="footer-top">
        <a class="brand" href="#"
          ><svg viewBox="0 0 44 44" aria-hidden="true">
            <path d="M4 36V18L22 6l18 12v18H4Z M12 36V22l10-7 10 7v14 M22 24v12" /></svg
          ><span>СТРОЙИНВЕСТ<small>ЗЕМЛЯ. ДОМ. ВАШЕ БУДУЩЕЕ.</small></span></a
        ><span>Строим по всей России</span><a href="#main">Наверх <UiArrow direction="up" /></a>
      </div>
      <div class="footer-bottom">
        <span>© 2026 ООО «Стройинвест»</span
        ><span
          >Материалы для предварительного ознакомления.<br />Условия и состав работ определяются
          договором.</span
        ><a :href="assetUrl('assets/stroyinvest.pdf')" target="_blank" rel="noopener"
          >Презентация компании <UiArrow direction="up-right"
        /></a>
      </div>
    </div>
  </footer>
</template>
