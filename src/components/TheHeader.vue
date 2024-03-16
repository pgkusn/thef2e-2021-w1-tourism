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

const typeMap = new Map([
  ['ScenicSpot', { title: '景點', img: 'hero_spot' }],
  ['Restaurant', { title: '餐飲', img: 'hero_restaurant' }],
  ['Hotel', { title: '旅宿', img: 'hero_hotel' }],
  ['Activity', { title: '活動', img: 'hero_activity' }],
])

const title = computed(() => typeMap.get(props.type)?.title)

// 背景圖片
const getImageUrl = (name: string) => {
  const suffix = window.devicePixelRatio > 1 ? '@2x' : ''
  return new URL(`../assets/images/${name + suffix}.webp`, import.meta.url).href
}
for (const [_, value] of typeMap) {
  const img = new Image()
  img.src = getImageUrl(value.img)
}
const bgImgUrl = computed(() => {
  const fileName = typeMap.get(props.type)?.img ?? ''
  return `url(${getImageUrl(fileName)})`
})

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
