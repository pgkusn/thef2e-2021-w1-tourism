<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { useMainStore } from '@/stores/main'
import { usePaginatedItems } from '@/composables/paginatedItems'
import { favorite, toggleFavorite } from '@/composables/favorite'
import * as Types from '@/types'

const props = defineProps<{
  type: Types.TourismType
}>()

const mainStore = useMainStore()
const router = useRouter()
const route = useRoute()

const { cityList, orderby, sortedCardList, scrollY } = storeToRefs(mainStore)

const currentType = computed<Types.TourismType>({
  get: () => props.type,
  set: (type: Types.TourismType) => {
    sortedCardList.value[type].length = 0
    router.push({ params: { type } })
  },
})

const searchValue = computed(() => ({
  city: route.query.city,
  keyword: route.query.keyword,
}))
const search = async ({ city, keyword }: { city: string; keyword: string }) => {
  await mainStore[`get${props.type}List`](city, keyword)
  const query = {
    ...(city && { city }),
    ...(keyword && { keyword }),
  }
  router.push({ query })
}

// 各分類分頁列表
const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (page: number) => {
    router.push({ query: { ...route.query, page } })
  },
})
const cardsOfType = computed(() => sortedCardList.value[props.type])
const { paginatedItems } = usePaginatedItems(cardsOfType, 16)
const searchResult = computed(() => {
  return paginatedItems.value[currentPage.value - 1]?.map(item => ({
    ...item,
    isFavorite: favorite.value.some(({ id }) => id === item.id),
  }))
})

// 保存捲軸位置
const { y } = useWindowScroll()
onBeforeRouteLeave(() => {
  scrollY.value = y.value
})
onMounted(() => {
  window.requestAnimationFrame(() => {
    y.value = scrollY.value
  })
})
</script>

<template>
  <TheHeader :type="props.type">
    <template #logo="{ isSticky }">
      <SvgIcon :name="isSticky ? 'logo_dart' : 'logo_light'" class="w20 h5 md:(w26 h7)" />
    </template>

    <template #default="{ title }">
      <div class="container xl:max-w266">
        <div
          class="text-20 leading-26.5 text-white text-shadow-[0px_3px_6px_#00000029] hidden md:block"
        >
          {{ title }}
        </div>
        <TheNav v-model="currentType" />
        <SearchForm :cityList="cityList" :initialValue="searchValue" @submit="search" />
      </div>
    </template>
  </TheHeader>

  <main class="flex-grow flex flex-col bg-#F1F1F1 pt6 pb5 md:(pt13 pb18)">
    <div class="container flex justify-between items-center">
      <div class="text-sm border-l-4 border-blue-primary pl1 text-gray-dark md:text-xl">
        搜尋結果
      </div>
      <div class="flex items-center gap-x3">
        <label id="sort" class="text-sm text-gray-light">排序</label>
        <div class="relative">
          <select
            v-model="orderby"
            class="h8 rounded-1.5 appearance-none text-sm text-center text-gray-dark pl3 pr8.5"
            aria-labelledby="sort"
          >
            <option :value="0">預設</option>
            <option :value="1">景點名稱</option>
          </select>
          <div
            class="i-mdi-chevron-down absolute right-1 inset-y-0 my-auto w7 h7 text-#2A48FF"
          ></div>
        </div>
      </div>
    </div>

    <div class="flex-grow">
      <div class="auto-fill container grid gap-3 mt5 md:(gap-5 mt5.5)">
        <Card
          v-for="item in searchResult"
          :data="item"
          :key="item.id"
          :hasCollect="true"
          flexDirection="auto"
          @toggleFavorite="toggleFavorite"
        />
      </div>
    </div>

    <Pagination v-model="currentPage" :total="cardsOfType.length" />
  </main>
</template>

<style scoped>
.auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(304px, 1fr));
}
</style>
