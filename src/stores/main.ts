import * as api from '@/api'
import * as apiAdapter from '@/api/adapter'
import * as Types from '@/types'

export const useMainStore = defineStore('main', () => {
  const token = ref('')
  const cityList = ref([])
  const orderby = ref(0)
  const scrollY = ref(0)

  const scenicSpotList = ref<Types.Card[]>([])
  const restaurantList = ref<Types.Card[]>([])
  const hotelList = ref<Types.Card[]>([])
  const activityList = ref<Types.Card[]>([])
  const sortedCardList = computed(() => {
    const sortList = (listData: Types.Card[]) => {
      if (!orderby.value) return listData
      return [...listData].sort((a: Types.Card, b: Types.Card) => {
        return a.name.localeCompare(b.name, 'zh-Hans-TW')
      })
    }
    return {
      ScenicSpot: sortList(scenicSpotList.value),
      Restaurant: sortList(restaurantList.value),
      Hotel: sortList(hotelList.value),
      Activity: sortList(activityList.value),
    }
  })

  const detailData = ref()

  // 取得 token (每六小時)
  const getToken = async () => {
    try {
      const data = {
        grant_type: 'client_credentials',
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
      }
      const { access_token } = await api.getToken(data).then(res => res.data)
      token.value = `Bearer ${access_token}`
      setTimeout(getToken, 21600000)
    } catch (error) {
      throw error
    }
  }
  // 取得縣市列表
  const getCityList = async () => {
    try {
      cityList.value = await api
        .getCityList({
          headers: { Authorization: token.value },
        })
        .then(res => res.data)
    } catch (error) {
      throw error
    }
  }
  // 取得所有景點資料
  const getScenicSpotList = async (city = '', keyword = '') => {
    const fields = 'ScenicSpotID,Picture,ScenicSpotName,Address,City,Class1,Class2,Class3'
    const params = `${city}?$top=100&$select=${fields}&$filter=contains(ScenicSpotName,'${keyword}')`
    try {
      const { data } = await api.getScenicSpot(params, {
        headers: { Authorization: token.value },
      })
      scenicSpotList.value = apiAdapter.getScenicSpotList(data)
    } catch (error) {
      throw error
    }
  }
  // 取得指定景點資料
  const getScenicSpot = async (id: string) => {
    const fields =
      'Picture,ScenicSpotName,Address,City,Class1,Class2,Class3,OpenTime,DescriptionDetail,Phone,WebsiteUrl'
    const params = `?$select=${fields}&$filter=ScenicSpotID eq '${id}'`
    try {
      const { data } = await api.getScenicSpot(params, {
        headers: { Authorization: token.value },
      })
      if (!data.length) throw new Error('找不到資料')
      detailData.value = apiAdapter.getScenicSpot(data[0])
    } catch (error) {
      throw error
    }
  }
  // 取得所有餐飲資料
  const getRestaurantList = async (city = '', keyword = '') => {
    const fields = 'RestaurantID,Picture,RestaurantName,Address,City,Class'
    const params = `${city}?$top=100&$select=${fields}&$filter=contains(RestaurantName,'${keyword}')`
    try {
      const { data } = await api.getRestaurant(params, {
        headers: { Authorization: token.value },
      })
      restaurantList.value = apiAdapter.getRestaurantList(data)
    } catch (error) {
      throw error
    }
  }
  // 取得指定餐飲資料
  const getRestaurant = async (id: string) => {
    const fields = 'Picture,RestaurantName,Address,City,Class,OpenTime,Phone,WebsiteUrl'
    const params = `?$select=${fields}&$filter=RestaurantID eq '${id}'`
    try {
      const { data } = await api.getRestaurant(params, {
        headers: { Authorization: token.value },
      })
      if (!data.length) throw new Error('找不到資料')
      detailData.value = apiAdapter.getRestaurant(data[0])
    } catch (error) {
      throw error
    }
  }
  // 取得所有旅宿資料
  const getHotelList = async (city = '', keyword = '') => {
    const fields = 'HotelID,Picture,HotelName,Address,City,Class'
    const params = `${city}?$top=100&$select=${fields}&$filter=contains(HotelName,'${keyword}')`
    try {
      const { data } = await api.getHotel(params, {
        headers: { Authorization: token.value },
      })
      hotelList.value = apiAdapter.getHotelList(data)
    } catch (error) {
      throw error
    }
  }
  // 取得指定旅宿資料
  const getHotel = async (id: string) => {
    const fields = 'Picture,HotelName,Address,City,Class,Phone,WebsiteUrl'
    const params = `?$select=${fields}&$filter=HotelID eq '${id}'`
    try {
      const { data } = await api.getHotel(params, {
        headers: { Authorization: token.value },
      })
      if (!data.length) throw new Error('找不到資料')
      detailData.value = apiAdapter.getHotel(data[0])
    } catch (error) {
      throw error
    }
  }
  // 取得所有活動資料
  const getActivityList = async (city = '', keyword = '') => {
    const fields = 'ActivityID,Picture,ActivityName,Address,City,Class1,Class2'
    const params = `${city}?$top=100&$select=${fields}&$filter=contains(ActivityName,'${keyword}')`
    try {
      const { data } = await api.getActivity(params, {
        headers: { Authorization: token.value },
      })
      activityList.value = apiAdapter.getActivityList(data)
    } catch (error) {
      throw error
    }
  }
  // 取得指定活動資料
  const getActivity = async (id: string) => {
    const fields = 'Picture,ActivityName,Address,City,Class1,Class2,Phone,WebsiteUrl'
    const params = `?$select=${fields}&$filter=ActivityID eq '${id}'`
    try {
      const { data } = await api.getActivity(params, {
        headers: { Authorization: token.value },
      })
      if (!data.length) throw new Error('找不到資料')
      detailData.value = apiAdapter.getActivity(data[0])
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    getToken,
    cityList,
    orderby,
    scrollY,
    sortedCardList,
    detailData,
    getCityList,
    getScenicSpotList,
    getScenicSpot,
    getRestaurantList,
    getRestaurant,
    getHotelList,
    getHotel,
    getActivityList,
    getActivity,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
