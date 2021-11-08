<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="item in showResultList" :key="item.ID" class="overflow-hidden rounded-lg shadow-lg">
            <img
                :src="item.Picture.PictureUrl1"
                :alt="item.Picture.PictureDescription1"
                onerror="this.src='hero.png'"
                class="w-full h-[190px] object-cover"
            >
            <div class="p-4 bg-white">
                <p>
                    {{ item.Name }}
                </p>
                <p class="leading-loose text-blue-700">
                    {{ item.City || item.Address.slice(0, 3) }}
                </p>
                <ul class="flex flex-wrap gap-2 mt-1">
                    <li v-if="item.Class" class="tag">
                        {{ item.Class }}
                    </li>
                    <li v-if="item.Class1" class="tag">
                        {{ item.Class1 }}
                    </li>
                    <li v-if="item.Class2" class="tag">
                        {{ item.Class2 }}
                    </li>
                    <li v-if="item.Class3" class="tag">
                        {{ item.Class3 }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-if="resultList.length > 1" class="flex justify-center mt-8">
        <button
            v-for="page in resultList.length"
            :key="page"
            class="rounded-lg w-11 h-11 mx-1.5"
            :class="[page === Number(currentPage) ? 'border border-blue-500 text-blue-500 bg-blue-100' : 'bg-white']"
            @click="changePage(page)"
        >
            {{ page }}
        </button>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup () {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const currentPage = computed(() => route.query.page || 1);
        const resultList = computed(() => store.getters.resultList);
        const showResultList = computed(() => resultList.value[currentPage.value - 1]);
        const changePage = page => {
            const query = {};
            if (route.query.city) {
                query.city = route.query.city;
            }
            if (route.query.keyword) {
                query.keyword = route.query.keyword;
            }
            router.replace({ query: { ...query, page } });

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        return {
            resultList,
            showResultList,
            changePage,
            currentPage
        };
    }
};
</script>