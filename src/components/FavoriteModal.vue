<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { useIntersectionObserver, useMediaQuery } from '@vueuse/core'
import { usePaginatedItems } from '@/composables/paginatedItems'
import * as Types from '@/types'

const isOpenModel = defineModel({ default: false })
const props = defineProps<{
  items: Types.Card[]
  toggleFavorite: (item: Types.Card) => void
}>()

const isLargeScreen = useMediaQuery('(min-width: 768px)')

const cardList = computed(() => {
  return isLargeScreen.value ? paginatedCardList.value : infiniteScrollList.value[currentType.value]
})

// 各分類分頁列表
const currentType = ref<Types.TourismType>('ScenicSpot')
const currentPage = ref(1)
const cardsOfType = computed(() => {
  return props.items.filter(item => item.type === currentType.value)
})
const { paginatedItems } = usePaginatedItems(cardsOfType, 6)
const paginatedCardList = computed(() => paginatedItems.value[currentPage.value - 1])

// 手機版無限捲動分頁
const currentScrollPage = ref(0)
const infiniteScrollList = ref({
  ScenicSpot: [] as Types.Card[],
  Restaurant: [] as Types.Card[],
  Hotel: [] as Types.Card[],
  Activity: [] as Types.Card[],
})
const hasNextPage = computed(() => currentScrollPage.value < paginatedItems.value.length)
const target = ref(null)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting && hasNextPage.value) {
    currentScrollPage.value++
    infiniteScrollList.value[currentType.value] = [
      ...infiniteScrollList.value[currentType.value],
      ...paginatedItems.value[currentScrollPage.value - 1],
    ]
  }
})

const handleTypeChange = (newType: Types.TourismType) => {
  currentType.value = newType
  currentPage.value = 1
  currentScrollPage.value = 0
  infiniteScrollList.value[currentType.value].length = 0
}
const handleCloseModel = () => {
  currentPage.value = 1
  currentScrollPage.value = 0
  infiniteScrollList.value[currentType.value].length = 0
  currentType.value = 'ScenicSpot'
}
</script>

<template>
  <TransitionRoot appear :show="isOpenModel" as="template">
    <Dialog as="div" class="relative z-40" @close="isOpenModel = false">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
            @after-leave="handleCloseModel"
          >
            <DialogPanel
              class="w-full max-w-211 transform overflow-hidden rounded-2xl bg-#F1F1F1 px5 py7.5 text-left align-middle shadow-xl transition-all md:(px0 pt13.5 pb10)"
            >
              <button
                class="i-mdi-close w7 h7 absolute top-7.5 right-5 text-gray-light md:(w9 h9 top-5 right-5)"
                @click="isOpenModel = false"
              ></button>

              <div class="md:pl19">
                <h2 class="text-lg text-center text-gray-dark md:(text-xl text-left)">我的最愛</h2>
                <TheNav
                  :model-value="currentType"
                  @update:model-value="handleTypeChange"
                  class="justify-center mb5.5 md:(justify-start mb4)"
                />
              </div>

              <div class="flex">
                <div class="w20 flex-shrink-0 justify-center items-center hidden md:flex">
                  <button
                    v-show="currentPage > 1"
                    class="i-mdi-chevron-left-circle w12 h12 text-gray-light"
                    @click="currentPage--"
                  ></button>
                </div>
                <div class="flex-grow">
                  <div class="grid grid-cols-1 gap-y3 md:(grid-cols-2 gap-y4 gap-x5)">
                    <Card
                      v-for="item in cardList"
                      :data="item"
                      :hasBookmark="true"
                      flexDirection="row"
                      @toggleFavorite="toggleFavorite"
                    />
                  </div>
                  <div v-show="!isLargeScreen && hasNextPage" ref="target"></div>
                </div>
                <div class="w20 flex-shrink-0 justify-center items-center hidden md:flex">
                  <button
                    v-show="currentPage < paginatedItems.length"
                    class="i-mdi-chevron-right-circle w12 h12 text-gray-light"
                    @click="currentPage++"
                  ></button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
