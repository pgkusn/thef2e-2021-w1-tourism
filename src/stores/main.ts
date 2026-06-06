import * as api from '@/api'
import * as apiAdapter from '@/api/adapter'
import * as Types from '@/types'

export const useMainStore = defineStore('main', () => {
  const orderby = ref(0)
  const isOpenModal = ref(false)
  const isLoading = ref(false)

  const token = ref('')

  // 取得 token (每6小時)
  const getToken = async () => {
    try {
      const { data } = await api.getToken()
      token.value = `Bearer ${data.token}`
      setTimeout(getToken, 21600000)
    } catch (error) {
      throw error
    }
  }

  const cityList = ref<Types.City[]>([])

  // 取得縣市列表
  const getCityList = async () => {
    try {
      cityList.value = await api.getCityList().then(res => res.data)
    } catch (error) {
      throw error
    }
  }

  const itemCount = 100
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

  // 將縣市英文代碼轉為 V2.1 PostalAddress.City 使用的中文縣市名
  const toCityName = async (city: string) => {
    if (!city) return ''
    if (!cityList.value.length) await getCityList()
    return cityList.value.find((c: Types.City) => c.City === city)?.CityName ?? city
  }
  // 組裝列表 OData 查詢字串(city 改以 $filter 篩選,keyword 以 contains 比對)
  const buildListParams = (fields: string, nameField: string, cityName: string, keyword: string) => {
    const filters: string[] = []
    if (cityName) filters.push(`PostalAddress/City eq '${cityName}'`)
    if (keyword) filters.push(`contains(${nameField}, '${keyword}')`)
    const filter = filters.length ? `&$filter=${filters.join(' and ')}` : ''
    return `?$top=${itemCount}&$select=${fields}${filter}&$format=JSON`
  }
  const config = () => ({ headers: { Authorization: token.value } })

  // 取得所有景點資料
  const getScenicSpotList = async (city = '', keyword = '') => {
    const fields = 'AttractionID,AttractionName,PostalAddress,Images,Tags'
    const params = buildListParams(fields, 'AttractionName', await toCityName(city), keyword)
    try {
      const { data } = await api.getScenicSpot(params, config())
      scenicSpotList.value = apiAdapter.getScenicSpotList(data.value)
    } catch (error) {
      throw error
    }
  }
  // 取得所有餐飲資料
  const getRestaurantList = async (city = '', keyword = '') => {
    const fields = 'RestaurantID,RestaurantName,PostalAddress,Images'
    const params = buildListParams(fields, 'RestaurantName', await toCityName(city), keyword)
    try {
      const { data } = await api.getRestaurant(params, config())
      restaurantList.value = apiAdapter.getRestaurantList(data.value)
    } catch (error) {
      throw error
    }
  }
  // 取得所有旅宿資料
  const getHotelList = async (city = '', keyword = '') => {
    const fields = 'HotelID,HotelName,PostalAddress,Images'
    const params = buildListParams(fields, 'HotelName', await toCityName(city), keyword)
    try {
      const { data } = await api.getHotel(params, config())
      hotelList.value = apiAdapter.getHotelList(data.value)
    } catch (error) {
      throw error
    }
  }
  // 取得所有活動資料
  const getActivityList = async (city = '', keyword = '') => {
    const fields = 'EventID,EventName,PostalAddress,Images,Tags'
    const params = buildListParams(fields, 'EventName', await toCityName(city), keyword)
    try {
      const { data } = await api.getActivity(params, config())
      activityList.value = apiAdapter.getActivityList(data.value)
    } catch (error) {
      throw error
    }
  }

  const detailData = ref()

  // ServiceTimeInfo 與 Tags 並非所有資源皆有(Event 無 ServiceTimeInfo,Restaurant/Hotel 無 Tags),故以 extra 個別帶入
  const detailFields = (nameField: string, extra = '') =>
    `${nameField},PostalAddress,Images,Description,Telephones,WebsiteUrl${extra}`

  // 取得指定景點資料
  const getScenicSpot = async (id: string) => {
    const params = `?$select=${detailFields('AttractionName', ',ServiceTimeInfo,Tags')}&$filter=AttractionID eq '${id}'&$format=JSON`
    try {
      const { data } = await api.getScenicSpot(params, config())
      if (!data.value.length) throw new Error('找不到網頁')
      detailData.value = apiAdapter.getScenicSpot(data.value[0])
    } catch (error) {
      throw error
    }
  }
  // 取得指定餐飲資料
  const getRestaurant = async (id: string) => {
    const params = `?$select=${detailFields('RestaurantName', ',ServiceTimeInfo')}&$filter=RestaurantID eq '${id}'&$format=JSON`
    try {
      const { data } = await api.getRestaurant(params, config())
      if (!data.value.length) throw new Error('找不到網頁')
      detailData.value = apiAdapter.getRestaurant(data.value[0])
    } catch (error) {
      throw error
    }
  }
  // 取得指定旅宿資料
  const getHotel = async (id: string) => {
    const params = `?$select=${detailFields('HotelName', ',ServiceTimeInfo')}&$filter=HotelID eq '${id}'&$format=JSON`
    try {
      const { data } = await api.getHotel(params, config())
      if (!data.value.length) throw new Error('找不到網頁')
      detailData.value = apiAdapter.getHotel(data.value[0])
    } catch (error) {
      throw error
    }
  }
  // 取得指定活動資料
  const getActivity = async (id: string) => {
    const params = `?$select=${detailFields('EventName', ',Tags,StartDateTime,EndDateTime')}&$filter=EventID eq '${id}'&$format=JSON`
    try {
      const { data } = await api.getActivity(params, config())
      if (!data.value.length) throw new Error('找不到網頁')
      detailData.value = apiAdapter.getActivity(data.value[0])
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    getToken,
    cityList,
    orderby,
    isOpenModal,
    isLoading,
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
