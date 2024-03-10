<script setup lang="ts">
import { useImage } from '@vueuse/core'

const props = defineProps<{
  src: string
}>()

const { isLoading } = useImage({ src: props.src })

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  const placeholderImg = 'https://picsum.photos/354/190'
  if (target.src !== placeholderImg) {
    target.src = placeholderImg
  }
}
</script>

<template>
  <img
    :src="src"
    class="object-cover w-full h-full transition-opacity duration-400"
    :class="isLoading ? 'opacity-0' : 'opacity-100'"
    @error="handleImageError"
  />
</template>
