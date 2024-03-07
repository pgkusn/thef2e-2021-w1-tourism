import { useStorage } from '@vueuse/core'
import * as Types from '@/types'

export const favorite = useStorage<Types.Card[]>('favorite', [])

export const toggleFavorite = (item: Types.Card) => {
  const index = favorite.value.findIndex(({ id }) => id === item.id)
  if (index === -1) {
    favorite.value.push({
      ...item,
      isFavorite: true,
    })
  } else {
    favorite.value.splice(index, 1)
  }
}
