<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import * as Types from '@/types'

defineOptions({
  inheritAttrs: false,
})
const props = defineProps<{
  data: Types.Card
  hasCollect?: boolean
  flexDirection: 'row' | 'column' | 'auto'
}>()
const emit = defineEmits(['toggleFavorite', 'handleCardClick'])

const router = useRouter()
const route = useRoute()

const handleCardClick = () => {
  router.push({
    name: 'detail',
    params: { type: props.data.type, id: props.data.id },
    query: route.query,
  })
  emit('handleCardClick')
}
const toggleFavorite = (e: { stopPropagation: () => void }) => {
  e.stopPropagation()
  emit('toggleFavorite', props.data)
}

// lazy load
const target = ref(null)
const targetIsVisible = ref(false)
const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting
  if (isIntersecting) {
    stop()
  }
})
</script>

<template>
  <div
    class="relative flex rounded shadow-[0px_3px_6px_#00000029] cursor-pointer overflow-hidden m0.5 &hover:(outline outline-2 outline-red-primary)"
    :class="[
      { 'md:(flex-col rounded-3)': flexDirection === 'auto' },
      { 'flex-col !rounded-3': flexDirection === 'column' },
      $attrs.class,
    ]"
    @click="handleCardClick"
  >
    <div
      ref="target"
      class="bg-cover bg-center w31 min-h32 flex-shrink-0 relative"
      :class="[
        { 'md:(w-full h-47.5)': flexDirection === 'auto' },
        { '!w-full h32 md:h-47.5': flexDirection === 'column' },
      ]"
      style="background-image: url(https://fakeimg.pl/354x190/?text=Loading)"
    >
      <Image
        v-if="targetIsVisible"
        :src="data.picture"
        :alt="data.pictureDescription"
        class="absolute left-0 top-0"
      />
    </div>
    <div
      class="px2 py3 flex-grow bg-white"
      :class="[
        { '!pb7.5 md:(pt3 px4 !pb4)': flexDirection === 'auto' },
        { 'md:(pt3 px4 !pb4)': flexDirection === 'column' },
      ]"
    >
      <p
        class="text-gray-dark text-sm"
        :class="{ 'md:text-base': flexDirection === 'auto' || flexDirection === 'column' }"
      >
        {{ data.name }}
      </p>
      <div
        v-if="data.city"
        class="flex items-center gap-x1 mt1"
        :class="[
          { 'md:(mt2 mb3)': flexDirection === 'auto' },
          { '!mt2 mb3': flexDirection === 'column' },
        ]"
      >
        <div class="i-mdi-map-marker w4 h4 text-blue-primary"></div>
        <p
          class="text-blue-primary text-xs underline"
          :class="{ 'md:text-sm': flexDirection === 'auto' || flexDirection === 'column' }"
        >
          {{ data.city }}
        </p>
      </div>
      <ul
        class="flex gap2 flex-wrap pr9 mt2"
        :class="[{ 'md:(pr0)': flexDirection === 'auto' }, { '!pr0': flexDirection === 'column' }]"
      >
        <li
          v-for="item in data.classes"
          class="text-xs text-#545454 bg-#C8C8C8 px1 py0.5 rounded"
          :class="{ 'md:(text-sm px2 py1)': hasCollect }"
        >
          {{ item }}
        </li>
      </ul>

      <!-- 收藏按鈕 -->
      <button
        v-if="hasCollect"
        class="absolute right-2 bottom-3 w7 h7 shadow-[0px_3px_6px_#00000029] rounded-full bg-white"
        :class="[
          { 'md:(top-3 bottom-auto right-3 w8 h8)': flexDirection === 'auto' },
          { '!top-3 !bottom-auto !right-3 md:(w8 h8)': flexDirection === 'column' },
        ]"
        aria-label="collect"
        @click="toggleFavorite"
      >
        <div
          class="w4 h4 mx-auto"
          :class="[
            data.isFavorite
              ? 'i-mdi-cards-heart text-red-primary'
              : 'i-mdi-cards-heart-outline text-gray-light',
            { 'md:(w5 h5)': flexDirection === 'auto' },
            { '!w5 !h5': flexDirection === 'column' },
          ]"
        ></div>
      </button>
    </div>
  </div>
</template>
