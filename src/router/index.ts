import { createRouter, createWebHashHistory } from 'vue-router'
import { useMainStore } from '@/stores/main'

import type { RouteLocation } from 'vue-router'
import * as Types from '@/types'

const initHomePageData = async (to: RouteLocation) => {
  const mainStore = useMainStore()

  const currentType = to.params.type as keyof typeof mainStore.sortedCardList

  const getListData = () => {
    return mainStore[`get${currentType}List`](to.query.city as string, to.query.keyword as string)
  }

  try {
    if (!mainStore.token) {
      await mainStore.getToken()
    }

    const promises = []
    if (!mainStore.cityList.length) {
      promises.push(mainStore.getCityList)
    }
    if (!mainStore.sortedCardList[currentType].length) {
      promises.push(getListData)
    }
    await Promise.all(promises.map(fn => fn()))
  } catch (error) {
    throw error
  }
}

const initDetailPageData = async (to: RouteLocation) => {
  const mainStore = useMainStore()

  const currentType = to.params.type as keyof typeof mainStore.sortedCardList

  const getDetailData = () => {
    return mainStore[`get${currentType}`](to.params.id as string)
  }
  const getListData = () => {
    return mainStore[`get${currentType}List`]()
  }

  try {
    const promises = [getDetailData]
    if (mainStore.sortedCardList[currentType].length < 100) {
      promises.push(getListData)
    }
    await Promise.all(promises.map(fn => fn()))
  } catch (error) {
    throw error
  }
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/ScenicSpot',
    },
    {
      path: '/:type(ScenicSpot|Restaurant|Hotel|Activity)',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      props: true,
      meta: { initData: initHomePageData },
    },
    {
      path: '/:type(ScenicSpot|Restaurant|Hotel|Activity)/:id',
      name: 'detail',
      component: () => import('@/views/Detail.vue'),
      props: true,
      meta: { initData: initDetailPageData },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/ScenicSpot',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeResolve(async (to, from) => {
  try {
    await (to.meta.initData as Types.InitData)(to, from)
  } catch (error) {
    console.error((error as Error).message)
    return false
  }
})

export default router
