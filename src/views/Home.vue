<template>
    <div>
        <div class="px-4 py-10 bg-center bg-cover" :style="{ backgroundImage: 'url(hero.png)' }">
            <div class="w-[1064px] mx-auto">
                <h1 class="text-5xl leading-relaxed text-white">
                    {{ nav[$props.name] }}
                </h1>
                <nav class="mb-4">
                    <router-link
                        v-for="(value, key) in nav"
                        :key="key"
                        :to="{ params: { name: key } }"
                        replace
                        class="nav-link"
                        :class="{ active: $props.name === key }"
                    >
                        {{ value }}
                    </router-link>
                </nav>
                <select v-model="selectedCity" class="h-8 px-2 border rounded">
                    <option value="">
                        想去的地區
                    </option>
                    <option v-for="city in showCities" :key="city.City" :value="city.City">
                        {{ city.CityName }}
                    </option>
                </select>
                <input
                    v-model="keyword"
                    type="text"
                    class="h-8 px-2 ml-3 border rounded placeholder-[#959595]"
                    placeholder="景點名稱"
                >
                <button class="w-20 h-8 ml-3 text-white bg-red-500 rounded" @click="search">
                    搜尋
                </button>
                <button class="w-20 h-8 ml-1.5 text-white bg-red-400 rounded" @click="reset">
                    清空條件
                </button>
            </div>
        </div>
        <div class="px-4 py-10">
            <div class="w-[1276px] mx-auto">
                <p class="mb-2 text-lg">
                    搜尋結果
                </p>
                <ResultList :name="$props.name" />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import ResultList from '@/components/ResultList.vue';

export default {
    components: {
        ResultList
    },
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    setup (props) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        const nav = {
            ScenicSpot: '景點',
            Restaurant: '餐飲',
            Hotel: '旅宿',
            Activity: '活動'
        };

        // 地區 & 搜尋文字
        const showCities = ref([]);
        const selectedCity = ref('');
        const keyword = ref('');

        // 搜尋結果
        const result = ref([]);
        const filterShowResult = computed(() => result.value.filter(item => item[props.name + 'Name'].match(keyword.value)));

        // 搜尋 & 清除
        const search = async event => {
            result.value = await store.dispatch('getShowResult', { name: props.name, city: selectedCity.value });
            store.dispatch('setShowResultHandler', filterShowResult.value);

            // 組合網址參數
            const query = {};
            if (selectedCity.value) {
                query.city = selectedCity.value;
            }
            if (keyword.value) {
                query.keyword = keyword.value;
            }
            if (!event && route.query.page) {
                query.page = route.query.page;
            }
            router.replace({ query });
        };
        const reset = async () => {
            if (!selectedCity.value && !keyword.value) return;

            result.value = await store.dispatch('getShowResult', { name: props.name });
            store.dispatch('setShowResultHandler', result.value);

            selectedCity.value = '';
            keyword.value = '';
            router.replace({ params: { name: props.name } });
        };

        watch(() => props.name, async () => {
            if (!showCities.value.length) {
                showCities.value = await store.dispatch('getCities');
            }
            // 抓網址參數
            selectedCity.value = route.query.city || '';
            keyword.value = route.query.keyword || '';
            search();
        }, { immediate: true });

        return {
            showCities,
            selectedCity,
            keyword,
            search,
            reset,
            nav
        };
    }
};
</script>