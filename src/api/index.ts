import axios from 'axios'
import qs from 'qs'
import { isLoading } from '@/composables/loading'
import * as Types from '@/types'

let requestCount = 0

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use(
  function (config) {
    requestCount++
    if (requestCount === 1) {
      isLoading.value = true
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  async function (response) {
    await new Promise(resolve => setTimeout(resolve, 200))
    requestCount--
    if (requestCount === 0) {
      isLoading.value = false
    }
    return response
  },
  function (error) {
    requestCount--
    if (requestCount === 0) {
      isLoading.value = false
    }
    return Promise.reject(error)
  }
)

export const getToken = () => {
  return instance.get('/tdx/token/tourism', {
    baseURL: import.meta.env.VITE_TOKEN_API_URL,
  })
}
export const getCityList = () => {
  return instance.get('https://kenge-hsieh.firebaseio.com/city.json')
}
const TOURISM_V2 = '/api/tourism/service/odata/V2/Tourism'

export const getScenicSpot = (params: string, config: Types.ApiConfig) => {
  return instance.get<Types.ODataResponse<Types.AttractionApiResponse>>(
    `${TOURISM_V2}/Attraction${params}`,
    config
  )
}
export const getRestaurant = (params: string, config: Types.ApiConfig) => {
  return instance.get<Types.ODataResponse<Types.RestaurantApiResponse>>(
    `${TOURISM_V2}/Restaurant${params}`,
    config
  )
}
export const getHotel = (params: string, config: Types.ApiConfig) => {
  return instance.get<Types.ODataResponse<Types.HotelApiResponse>>(
    `${TOURISM_V2}/Hotel${params}`,
    config
  )
}
export const getActivity = (params: string, config: Types.ApiConfig) => {
  return instance.get<Types.ODataResponse<Types.EventApiResponse>>(
    `${TOURISM_V2}/Event${params}`,
    config
  )
}
