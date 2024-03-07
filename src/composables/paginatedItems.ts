import * as Types from '@/types'

export const usePaginatedItems = (items: Ref<Types.Card[]>, itemsPerPage: number) => {
  const paginatedItems = computed(() => {
    const newItems: Types.Card[][] = []
    items.value.forEach((item, i) => {
      if (i % itemsPerPage === 0) {
        newItems.push([])
      }
      newItems[Math.floor(i / itemsPerPage)].push(item)
    })
    return newItems
  })
  return { paginatedItems }
}
