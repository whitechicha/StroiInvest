<script setup lang="ts">
withDefaults(defineProps<{ direction?: 'up-right' | 'right' | 'down' | 'up' }>(), {
  direction: 'up-right',
})
const paths = {
  'up-right': 'M7 17 17 7M7 7h10v10',
  right: 'M4 12h16m-6-6 6 6-6 6',
  down: 'M12 4v16m-6-6 6 6 6-6',
  up: 'M12 20V4m-6 6 6-6 6 6',
}
</script>
<template>
  <svg
    :class="['icon', `icon-arrow-${direction}`]"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[direction]" />
  </svg>
</template>
