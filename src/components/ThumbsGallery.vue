<script setup lang="ts">
import Swiper from 'swiper'
import * as Types from '@/types'

defineProps<{
  items: Types.Picture[]
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
  <div>
    <div class="relative pt63.7%">
      <swiper-container
        class="mySwiper absolute inset-0 md:(rounded-2 overflow-hidden)"
        thumbs-swiper=".mySwiper2"
        space-between="10"
        ref="swiperEl"
        @swiperslidechange="onSlideChange"
      >
        <swiper-slide
          v-for="item in items"
          style="background-image: url(https://fakeimg.pl/354x190/?text=Loading)"
        >
          <CardImage :key="item.url" :src="item.url" :alt="item.description" />
        </swiper-slide>
      </swiper-container>
      <button
        class="navigation left-3 i-mdi-chevron-left-circle"
        :class="isBeginning ? 'opacity-20' : 'opacity-60'"
        @click="swiperEl?.swiper.slidePrev()"
      ></button>
      <button
        class="navigation right-3 i-mdi-chevron-right-circle"
        :class="isEnd ? 'opacity-20' : 'opacity-60'"
        @click="swiperEl?.swiper.slideNext()"
      ></button>
    </div>

    <div class="relative pt22.2% hidden md:block">
      <swiper-container
        class="mySwiper2 absolute inset-0"
        space-between="10"
        slides-per-view="3"
        free-mode="true"
        watch-slides-progress="true"
      >
        <swiper-slide
          v-for="item in items"
          class="rounded-2 overflow-hidden"
          style="background-image: url(https://fakeimg.pl/354x190/?text=Loading)"
        >
          <CardImage :src="item.url" :alt="item.description" :key="item.url" />
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<style scoped>
swiper-container {
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
}

swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mySwiper {
  width: 100%;
}

.mySwiper2 {
  box-sizing: border-box;
  padding-top: 10px;
}

.mySwiper2 swiper-slide {
  width: 25%;
  height: 100%;
  opacity: 0.4;
}

.mySwiper2 .swiper-slide-thumb-active {
  opacity: 1;
}

.v-lazy-image {
  opacity: 0;
  transition: opacity 0.4s;
}
.v-lazy-image-loaded {
  opacity: 1;
}

.navigation {
  @apply w12 h12 text-white absolute bottom-10 z-10 hidden md:block;
}
</style>
