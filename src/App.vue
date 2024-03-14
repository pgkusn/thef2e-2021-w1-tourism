<script setup lang="ts">
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { useMainStore } from '@/stores/main'
import { favorite, toggleFavorite } from '@/composables/favorite'
import { isLoading } from '@/composables/loading'

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

  <Transition>
    <Loading v-model:active="isLoading">
      <div class="loadingio-spinner-rolling-0jxpwn6fft2n">
        <div class="ldio-8lwnm3o8fga">
          <div></div>
        </div>
      </div>
    </Loading>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@keyframes ldio-8lwnm3o8fga {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
.ldio-8lwnm3o8fga div {
  position: absolute;
  width: 65px;
  height: 65px;
  border: 5px solid #6a6a6a;
  border-top-color: transparent;
  border-radius: 50%;
}
.ldio-8lwnm3o8fga div {
  animation: ldio-8lwnm3o8fga 1s linear infinite;
  top: 50px;
  left: 50px;
}
.loadingio-spinner-rolling-0jxpwn6fft2n {
  width: 64px;
  height: 64px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.ldio-8lwnm3o8fga {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(0.64);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-8lwnm3o8fga div {
  box-sizing: content-box;
}
</style>
