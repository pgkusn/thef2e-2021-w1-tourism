<script setup lang="ts">
import { gsap } from 'gsap'
import { useWindowScroll } from '@vueuse/core'
import { useHeader } from '@/composables/header'
import { favorite, toggleFavorite } from '@/composables/favorite'
import * as Types from '@/types'

const props = defineProps<{
  type: Types.TourismType
  isForceSticky?: boolean
}>()
const emit = defineEmits(['changeType'])

const route = useRoute()
const isOpenModal = ref(false)
watch(
  () => route.params.id,
  () => {
    isOpenModal.value = false
  }
)

const { imgUrl } = useHeader()
const headerImgUrl = computed(() => `url(${imgUrl[props.type]})`)

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
          class="w27.5 h9 rounded-1.5 flex gap-x1 justify-center items-center text-sm text-gray-light bg-white shadow-[0px_3px_6px_#00000029]"
          @click="isOpenModal = true"
        >
          <div class="i-mdi-cards-heart w5 h5"></div>
          我的最愛
        </button>
      </div>
    </div>
    <slot :title="title"></slot>
  </header>

  <FavoriteModal v-model="isOpenModal" :items="favorite" :toggleFavorite="toggleFavorite" />
</template>

<style scoped>
header {
  background-image: v-bind(headerImgUrl);
}
</style>
