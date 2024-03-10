<script setup lang="ts">
const typeList = [
  {
    type: 'ScenicSpot',
    name: '景點',
    icon: 'i-mdi-camera-plus',
  },
  {
    type: 'Restaurant',
    name: '餐飲',
    icon: 'i-mdi-silverware-fork-knife',
  },
  {
    type: 'Hotel',
    name: '旅宿',
    icon: 'i-mdi-home-variant',
  },
  {
    type: 'Activity',
    name: '活動',
    icon: 'i-mdi-palette-outline',
  },
]

const currentType = defineModel()
</script>

<template>
  <div class="flex gap-x3 mt3.5">
    <label
      v-for="item in typeList"
      class="w17.5 h8.75 flex justify-center items-center gap-x1 rounded-full text-sm cursor-pointer md:(w27 h12 gap-x2 text-base) &hover:shadow-[0px_3px_6px_#00000029]"
      :class="
        item.type === currentType
          ? 'bg-#B72323 text-white shadow-[0px_3px_6px_#00000029]'
          : 'bg-white text-gray-light'
      "
    >
      <input v-model="currentType" type="radio" :value="item.type" class="hidden" />
      {{ item.name }}
      <div class="w3.5 h3.5 md:(w5 h5)" :class="item.icon"></div>
    </label>
  </div>
</template>
