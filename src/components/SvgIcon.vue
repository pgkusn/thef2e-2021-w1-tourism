<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
})

const symbolId = computed(() => `#icon-${props.name}`)
</script>

<template>
  <svg aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<style scoped>
use {
  color: v-bind(color);
}
</style>
