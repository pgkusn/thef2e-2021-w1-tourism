<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'radix-vue'

const currentPage = defineModel({
  type: Number,
  default: 1,
})
defineProps<{
  total: number
}>()

const itemsPerPage = 16
</script>

<template>
  <PaginationRoot
    v-if="total > itemsPerPage"
    v-model:page="currentPage"
    :itemsPerPage="itemsPerPage"
    :total="total"
    showEdges
    class="mt7.5 md:mt13"
  >
    <PaginationList v-slot="{ items }" class="flex justify-center items-center gap-3">
      <PaginationPrev class="page-navigation mr-6 md:mr2">
        <div class="i-mdi-chevron-left w7 h7 text-gray-light"></div>
      </PaginationPrev>
      <template v-for="page in items">
        <PaginationListItem
          v-if="page.type === 'page'"
          class="w-11 h-11 rounded-2 bg-white text-gray-dark data-[selected]:(bg-#2A48FF33 text-blue-primary border border-blue-primary) &hover:(text-blue-primary border border-blue-primary) hidden md:block"
          :value="page.value"
        >
          {{ page.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          class="w-9 h-9 items-center justify-center text-gray-dark hidden md:flex"
        >
          &#8230;
        </PaginationEllipsis>
      </template>
      <div class="text-gray-dark text-sm md:hidden">第 {{ currentPage }} 頁</div>
      <PaginationNext class="page-navigation md:ml2 ml-6">
        <div class="i-mdi-chevron-right w7 h7 text-gray-light"></div>
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>

<style scoped>
.page-navigation {
  @apply w-11 h-11 flex items-center justify-center rounded-2 bg-white shrink-0 disabled:opacity-50 [&:not(:disabled)]:&hover:bg-red-primary [&:not(:disabled)>div]:&hover:text-white;
}
</style>
