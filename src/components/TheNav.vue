<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import * as Types from '@/types'

defineProps<{ currentType: Types.TourismType }>()

const mainStore = useMainStore()

const typeList = [
  {
    type: 'ScenicSpot' as Types.TourismType,
    name: '景點',
    icon: 'i-mdi-camera-plus',
  },
  {
    type: 'Restaurant' as Types.TourismType,
    name: '餐飲',
    icon: 'i-mdi-silverware-fork-knife',
  },
  {
    type: 'Hotel' as Types.TourismType,
    name: '旅宿',
    icon: 'i-mdi-home-variant',
  },
  {
    type: 'Activity' as Types.TourismType,
    name: '活動',
    icon: 'i-mdi-palette-outline',
  },
]

const handleTypeChange = (type: Types.TourismType) => {
  mainStore.sortedCardList[type].length = 0
}
</script>

<template>
  <div class="flex gap-x3 mt3.5">
    <router-link
      v-for="item in typeList"
      :key="item.type"
      :to="{ name: 'home', params: { type: item.type } }"
      class="w17.5 h8.75 flex justify-center items-center gap-x1 rounded-full text-sm cursor-pointer md:(w27 h12 gap-x2 text-base) &hover:shadow-[0px_3px_6px_#00000029]"
      :class="
        item.type === currentType
          ? 'bg-#B72323 text-white shadow-[0px_3px_6px_#00000029]'
          : 'bg-white text-gray-light'
      "
      @click="handleTypeChange(item.type)"
    >
      {{ item.name }}
      <div class="w3.5 h3.5 md:(w5 h5)" :class="item.icon"></div>
    </router-link>
  </div>
</template>
