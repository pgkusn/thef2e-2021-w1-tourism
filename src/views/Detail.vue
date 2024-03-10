<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { useMainStore } from '@/stores/main'
import { favorite, toggleFavorite } from '@/composables/favorite'
import * as Types from '@/types'

const props = defineProps<{
  type: Types.TourismType
  id: string
}>()

const route = useRoute()
const mainStore = useMainStore()
const isLargeScreen = useMediaQuery('(min-width: 768px)')

const { detailData, sortedCardList } = storeToRefs(mainStore)

const handleToggleFavorite = () => {
  toggleFavorite({
    type: props.type,
    id: props.id,
    name: detailData.value.name,
    city: detailData.value.city,
    picture: detailData.value.picture[0].url,
    pictureDescription: detailData.value.picture[0].description,
    classes: detailData.value.classes,
  })
}

// TODO: 推薦相同縣市或關鍵字
// 推薦列表
const randomCards = ref<Types.Card[]>([])
const recommendedCards = computed(() => {
  return randomCards.value.map(card => ({
    ...card,
    isFavorite: favorite.value.some(({ id }) => id === card.id),
  }))
})
const generateRandomCards = () => {
  const maxRecommendations = 50
  const cardsOfType = sortedCardList.value[props.type]
  const filteredCards = cardsOfType.filter(card => card.id !== route.params.id)
  const randomStartIndex = Math.floor(Math.random() * (filteredCards.length - maxRecommendations))
  randomCards.value = filteredCards.slice(randomStartIndex, randomStartIndex + maxRecommendations)
}
watch(() => route.params.id, generateRandomCards, { immediate: true })
</script>

<template>
  <TheHeader :type="props.type" :isForceSticky="true">
    <template #return="{ isSticky }">
      <router-link
        :to="{ name: 'home', query: $route.query }"
        class="flex items-center text-sm md:text-lg"
        :class="[isSticky ? 'text-gray-dark' : 'text-white']"
      >
        <div
          :class="[isSticky ? '#2C2C2C' : '#FFF']"
          class="i-mdi-chevron-left w9 h9 md:(w10 h10)"
        ></div>
        返回
      </router-link>
    </template>

    <template #default="{ title }">
      <div class="container mt8.5 hidden md:block">
        <div class="text-20 leading-26.5 text-white text-shadow-[0px_3px_6px_#00000029]">
          {{ title }}
        </div>
      </div>
    </template>
  </TheHeader>

  <main class="flex-grow bg-#F1F1F1">
    <div :class="{ container: isLargeScreen }">
      <div class="flex flex-col gap3.5 pt19 md:(flex-row gap5 pt10)">
        <div class="flex-grow w-auto md:w0">
          <ThumbsGallery :items="detailData.picture" />
        </div>
        <div class="relative flex-grow w-auto bg-white px5 pt4 pb6 rounded-2 md:w0">
          <h1 class="text-xl font-bold mb3 md:(text-2xl pr15 mb4)">{{ detailData.name }}</h1>

          <div v-if="detailData.city" class="flex items-center gap-x2 mb4 md:mb6">
            <div class="i-mdi-map-marker w6 h6 text-red-primary"></div>
            <p class="text-blue-primary underline">{{ detailData.city }}</p>
          </div>

          <dl
            class="empty:hidden [&>dt]:(flex items center gap-x2 text-gray-dark font-bold mb1 md:(mb2)) [&>dt:nth-last-of-type(-n+2)]:(mt4 md:(mt6))"
          >
            <dt v-if="detailData.classes.length">
              <div class="i-mdi-tag-outline w6 h6 text-red-primary"></div>
              標籤
            </dt>
            <dd class="flex flex-wrap gap-1 pl8 md:gap-3 empty:hidden">
              <div
                v-for="item in detailData.classes"
                class="text-sm text-#545454 bg-#C8C8C8 px1 py0.5 rounded"
              >
                {{ item }}
              </div>
            </dd>
            <dt v-if="detailData.openTime">
              <div class="i-mdi-clock-time-three-outline w6 h6 text-red-primary"></div>
              開放時間
            </dt>
            <dd class="text-sm pl8">
              {{ detailData.openTime }}
            </dd>
            <dt v-if="detailData.descriptionDetail">
              <div class="i-mdi-file-document-outline w6 h6 text-red-primary"></div>
              簡介
            </dt>
            <dd class="text-sm pl8 empty:hidden">
              {{ detailData.descriptionDetail }}
            </dd>
          </dl>

          <div
            class="inline-grid min-h12 gap2.5 mt8 [&>a]:(text-sm flex justify-center items-center rounded) md:(min-h15 gap-x5) lg:[&>a]:text-base"
            :class="{ 'grid-cols-2': detailData.phone && detailData.websiteUrl }"
          >
            <a
              v-if="detailData.phone"
              :href="`tel:+${detailData.phone}`"
              class="text-red-primary gap-x1 border border-red-primary p4 &hover:bg-#FFE6E6"
            >
              <div class="i-mdi-phone w4 h4"></div>
              {{ detailData.phone }}
            </a>
            <a
              v-if="detailData.websiteUrl"
              :href="detailData.websiteUrl"
              class="text-white bg-red-primary &hover:bg-#DB3939 p2"
              target="_blank"
            >
              官方網站
            </a>
          </div>

          <!-- 收藏按鈕 -->
          <button
            class="absolute right-5 -top-11.5 z-20 w10 h10 shadow-[0px_3px_6px_#00000029] rounded-full bg-white md:(top-4 right-5)"
            aria-label="collect"
            @click="handleToggleFavorite"
          >
            <div
              class="w6 h6 mx-auto"
              :class="[
                favorite.some(item => item.id === id)
                  ? 'i-mdi-cards-heart text-red-primary'
                  : 'i-mdi-cards-heart-outline text-gray-light',
              ]"
            ></div>
          </button>
        </div>
      </div>

      <div class="px5 py8 md:(px0 pt11.5 pb15)">
        <div
          class="text-gray-light mb2.5 md:(text-xl border-l-4 border-blue-primary pl1 text-gray-dark mb5)"
        >
          你可能會喜歡
        </div>
        <SlidesPerView :items="recommendedCards" :key="id" />
      </div>
    </div>
  </main>
</template>
