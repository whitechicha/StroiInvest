<script setup lang="ts">
const ready = useHydrationReady()
const menuOpen = ref(false)
function closeOnNavigation(event: MouseEvent) {
  if ((event.target as HTMLElement).closest('a')) menuOpen.value = false
}
</script>
<template>
  <header class="header" @keydown.esc="menuOpen = false">
    <div class="wrap header-inner">
      <a class="brand" href="#" aria-label="Стройинвест, на главную"
        ><svg viewBox="0 0 44 44" aria-hidden="true">
          <path d="M4 36V18L22 6l18 12v18H4Z M12 36V22l10-7 10 7v14 M22 24v12" /></svg
        ><span>СТРОЙИНВЕСТ<small>СТРОИТЕЛЬНАЯ КОМПАНИЯ</small></span></a
      >
      <nav
        class="nav"
        :class="{ open: menuOpen }"
        @click="closeOnNavigation"
        id="navigation"
        aria-label="Основная навигация"
      >
        <a href="#about">О компании</a><a href="#houses">Наши дома</a
        ><a href="#land">Земля ветеранам</a><a href="#process">Как работаем</a>
      </nav>
      <a class="btn small header-cta" href="#request"
        >Обсудить проект <span aria-hidden="true"><UiArrow direction="up-right" /></span
      ></a>
      <button
        :disabled="!ready"
        class="menu-toggle"
        :aria-expanded="menuOpen"
        aria-controls="navigation"
        :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>
    </div>
  </header>
</template>
