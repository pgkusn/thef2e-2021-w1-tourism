<script setup lang="ts">
import * as Types from '@/types'
import Swiper from 'swiper'
import { toggleFavorite } from '@/composables/favorite'

defineProps<{
  items: Types.Card[]
}>()

const swiperEl = ref<{ swiper: Swiper } | null>(null)

const isBeginning = ref(true)
const isEnd = ref(false)

const onSlideChange = () => {
  if (!swiperEl.value) return
  isBeginning.value = swiperEl.value.swiper.isBeginning
  isEnd.value = swiperEl.value.swiper.isEnd
}
</script>

<template>
  <div class="relative">
    <swiper-container
      space-between="10"
      slidesPerView="2"
      :breakpoints="{
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }"
      ref="swiperEl"
      @swiperslidechange="onSlideChange"
    >
      <swiper-slide v-for="item in items" class="h-inherit">
        <Card
          :key="item.id"
          :data="item"
          :hasBookmark="true"
          flexDirection="column"
          class="h-[calc(100%-4px)]"
          @toggleFavorite="toggleFavorite"
        />
      </swiper-slide>
    </swiper-container>

    <button
      class="navigation -left-5 i-mdi-chevron-left-circle"
      :class="isBeginning ? 'opacity-20' : 'opacity-60'"
      @click="swiperEl?.swiper.slidePrev()"
    ></button>
    <button
      class="navigation -right-5 i-mdi-chevron-right-circle"
      :class="isEnd ? 'opacity-20' : 'opacity-60'"
      @click="swiperEl?.swiper.slideNext()"
    ></button>
  </div>
</template>

<style scoped>
swiper-container {
  width: 100%;
  height: 100%;
}

swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navigation {
  @apply w11 h11 text-gray-dark absolute bottom-23 z-10 hidden md:block;
}
</style>
