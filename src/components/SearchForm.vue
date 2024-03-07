<script setup lang="ts">
import * as Types from '@/types'

const props = defineProps<{
  cityList: Types.City[]
  initialValue: { city?: string; keyword?: string }
}>()
const emit = defineEmits(['submit'])

const city = ref()
const keyword = ref()

const onSubmit = () => {
  emit('submit', {
    city: city.value?.City,
    keyword: keyword.value,
  })
}

watchEffect(() => {
  city.value = props.cityList.find(c => c.City === props.initialValue.city) || null
  keyword.value = props.initialValue.keyword
})
</script>

<template>
  <form class="flex flex-col gap-x3 gap-y2 mt3 md:(flex-row mt4)" @submit.prevent="onSubmit">
    <TheSelect v-model="city" :options="cityList" class="h-12 md:(h15 flex-grow w0)" />
    <div class="h12 md:(h15 flex-grow w0)">
      <input
        v-model.trim="keyword"
        type="text"
        class="w-full h-full rounded-2 px5 shadow-[0px_3px_6px_#00000029] placeholder-gray-light text-sm"
        placeholder="輸入景點名稱"
      />
    </div>
    <button
      type="submit"
      class="text-white text-lg bg-red-primary h12 flex justify-center items-center gap-x2 rounded-2 shadow-[0px_3px_6px_#00000029] hover:bg-#DB3939 md:(w40 h15 flex-shrink-0 text-xl)"
    >
      <div class="i-mdi-magnify w6 h6"></div>
      搜尋
    </button>
  </form>
</template>
