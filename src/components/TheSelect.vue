<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  TransitionRoot,
} from '@headlessui/vue'
import * as Types from '@/types'

const city = defineModel<Types.City | null>()
const props = defineProps<{
  options: Types.City[]
}>()

const query = ref('')
const filteredCity = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter(city => {
        return city.CityName.toLowerCase().includes(query.value.toLowerCase())
      })
)
</script>

<template>
  <div class="relative text-gray-dark text-sm">
    <div
      class="i-mdi-map-marker absolute left-3 inset-y-0 my-auto w6 h6"
      :class="city ? 'text-blue-primary' : 'text-gray-light'"
    ></div>
    <Combobox v-model="city" nullable>
      <ComboboxButton class="absolute inset-0" aria-label="city"></ComboboxButton>
      <ComboboxInput
        class="w-full h-full rounded-2 shadow-[0px_3px_6px_#00000029] placeholder-gray-light pl11 pr5"
        placeholder="輸入想去的地區"
        :displayValue="city => (city as Types.City)?.CityName"
        @change="query = $event.target.value"
      />
      <TransitionRoot
        class="absolute top-15 z-10"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="w50 max-h64 overflow-auto bg-white py2 rounded-2 empty:hidden shadow-[0px_3px_6px_#00000029] options"
        >
          <ComboboxOption
            v-for="city in filteredCity"
            :value="city"
            :key="city.City"
            as="template"
            v-slot="{ active }"
          >
            <li
              class="p3 flex items-center gap-x2 cursor-default select-none"
              :class="{ 'bg-#E4E7FF': active }"
            >
              <div class="i-mdi-map-marker w6 h6 text-blue-primary"></div>
              {{ city.CityName }}
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </Combobox>
  </div>
</template>

<style scoped>
.options {
  --sb-track-color: #ffffff;
  --sb-thumb-color: #959595;
  --sb-size: 5px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}
.options::-webkit-scrollbar {
  width: var(--sb-size);
}
.options::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 10px;
}
.options::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 10px;
}
</style>
