import { createRouter, createWebHashHistory } from 'vue-router'
import Swal from 'sweetalert2'
import { isAxiosError } from 'axios'
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
    if (!mainStore.token) {
      await mainStore.getToken()
    }

    const promises = [getDetailData]
    if (mainStore.sortedCardList[currentType].length < 100) {
      promises.push(getListData)
    }
    await Promise.all(promises.map(fn => fn()))
  } catch (error) {
    throw error
  }
}

let cachedScrollY = 0

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
      meta: {
        initData: initHomePageData,
        saveScrollPosition: true,
      },
    },
    {
      path: '/:type(ScenicSpot|Restaurant|Hotel|Activity)/:id',
      name: 'detail',
      component: () => import('@/views/Detail.vue'),
      props: true,
      meta: {
        initData: initDetailPageData,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/ScenicSpot',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.meta.saveScrollPosition && to.name !== from.name) {
      return { top: cachedScrollY }
    } else {
      return { top: 0 }
    }
  },
})

// 離開頁面前保存滾動位置
router.beforeEach((to, from) => {
  if (from.meta.saveScrollPosition) {
    cachedScrollY = window.scrollY
  }
})

router.beforeResolve(async (to, from) => {
  if (!to.meta?.initData) return

  try {
    await (to.meta.initData as Types.InitData)(to, from)
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 200))

    if (isAxiosError(error) && error.response?.status === 429) {
      Swal.fire({
        title: 'Oops...',
        text: '請求過於頻繁，請稍後再試',
        icon: 'error',
        footer: '存取頻率：5 次/分',
      })
    }

    console.error(error)
    return false
  }
})

export default router
