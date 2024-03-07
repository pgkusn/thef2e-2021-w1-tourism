import { getImageUrl } from '@/utils/getImageUrl'

export const useHeader = () => {
  const suffix = window.devicePixelRatio > 1 ? '@2x' : ''
  const imgUrl = {
    ScenicSpot: getImageUrl(`hero_spot${suffix}.png`),
    Restaurant: getImageUrl(`hero_restaurant${suffix}.png`),
    Hotel: getImageUrl(`hero_hotel${suffix}.png`),
    Activity: getImageUrl(`hero_activity${suffix}.png`),
  }

  // preload
  const loadCount = ref(0)
  const loaded = computed(() => loadCount.value === Object.values(imgUrl).length)
  Object.values(imgUrl).forEach(url => {
    const img = new Image()
    img.onload = () => {
      loadCount.value++
    }
    img.src = url
  })

  return {
    imgUrl,
    loaded,
  }
}
