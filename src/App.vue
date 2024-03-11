<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import { favorite, toggleFavorite } from '@/composables/favorite'

const mainStore = useMainStore()
</script>

<template>
  <div class="flex flex-col min-h-dvh">
    <div class="flex-grow flex flex-col">
      <RouterView />
    </div>
    <footer class="text-xs text-gray-light py3 text-center md:(text-sm py5)">
      THE F2E 3rd Week 01 Desin by : Frank Peng
    </footer>
  </div>

  <FavoriteModal
    v-model="mainStore.isOpenModal"
    :items="favorite"
    :toggleFavorite="toggleFavorite"
  />
</template>
