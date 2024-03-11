<script setup lang="ts">
import { gsap } from 'gsap'
import { useWindowScroll } from '@vueuse/core'
import { useMainStore } from '@/stores/main'
import * as Types from '@/types'

const props = defineProps<{
  type: Types.TourismType
  isForceSticky?: boolean
}>()
const emit = defineEmits(['changeType'])

const mainStore = useMainStore()

// 背景圖片
const imgSuf = window.devicePixelRatio > 1 ? '@2x' : ''
const bgImgMap = new Map([
  ['ScenicSpot', `/hero_spot${imgSuf}.webp`],
  ['Restaurant', `/hero_restaurant${imgSuf}.webp`],
  ['Hotel', `/hero_hotel${imgSuf}.webp`],
  ['Activity', `/hero_activity${imgSuf}.webp`],
])
for (const [_, value] of bgImgMap) {
  const img = new Image()
  img.src = value
}
const bgImgUrl = computed(() => `url(${bgImgMap.get(props.type)})`)

// 標題
const titleMap = new Map([
  ['ScenicSpot', '景點'],
  ['Restaurant', '餐飲'],
  ['Hotel', '旅宿'],
  ['Activity', '活動'],
])
const title = computed(() => titleMap.get(props.type))

// 置頂元素
const { y } = useWindowScroll()
const isSticky = computed(() => props.isForceSticky || y.value > 84)
const stickyEl = ref(null)
watch(isSticky, value => {
  if (!value) return
  gsap.from(stickyEl.value, {
    duration: 0.2,
    y: -84,
  })
})
</script>

<template>
  <header
    class="bg-top bg-no-repeat bg-cover md:(pt32.5 pb7)"
    :class="{ 'pt25 pb5': !isForceSticky }"
  >
    <div
      class="top-0 inset-x-0 z-30"
      :class="[isSticky ? 'fixed bg-white shadow-[0px_3px_6px_#00000029]' : 'absolute']"
      ref="stickyEl"
    >
      <div class="container py5 flex justify-between items-center">
        <slot name="logo" :isSticky="isSticky"></slot>
        <slot name="return" :isSticky="isSticky"></slot>
        <button
          class="w27.5 h9 rounded-1.5 flex gap-x1 justify-center items-center text-sm text-gray-light bg-white shadow-[0px_3px_6px_#00000029] &hover:text-red-primary &hover:(outline outline-1 outline-red-primary)"
          @click="mainStore.isOpenModal = true"
        >
          <div class="i-mdi-cards-heart w5 h5"></div>
          我的最愛
        </button>
      </div>
    </div>
    <slot :title="title"></slot>
  </header>
</template>

<style scoped>
header {
  background-image: v-bind(bgImgUrl);
}
</style>
