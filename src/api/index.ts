import axios from 'axios'
import qs from 'qs'
import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import * as Types from '@/types'

const $loading = useLoading()

let loader: ActiveLoader | null = null

const hideLoader = () => {
  loader && loader.hide()
  loader = null
}

const tdxApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

tdxApi.interceptors.request.use(
  function (config) {
    if (loader || config.url === '/auth/realms/TDXConnect/protocol/openid-connect/token') {
      return config
    }
    loader = $loading.show()
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
tdxApi.interceptors.response.use(
  async function (response) {
    await new Promise(resolve => setTimeout(resolve, 200))
    hideLoader()
    return response
  },
  function (error) {
    hideLoader()
    return Promise.reject(error)
  }
)

export const getToken = (data: Types.TokenApiRequest) => {
  return tdxApi.post('/auth/realms/TDXConnect/protocol/openid-connect/token', qs.stringify(data))
}
export const getCityList = (config: Types.ApiConfig) => {
  return tdxApi.get('/api/basic/v2/Basic/City?$select=CityName,City', config)
}
export const getScenicSpot = (params: string, config: Types.ApiConfig) => {
  return tdxApi.get(`/api/basic/v2/Tourism/ScenicSpot/${params}`, config)
}
export const getRestaurant = (params: string, config: Types.ApiConfig) => {
  return tdxApi.get(`/api/basic/v2/Tourism/Restaurant/${params}`, config)
}
export const getHotel = (params: string, config: Types.ApiConfig) => {
  return tdxApi.get(`/api/basic/v2/Tourism/Hotel/${params}`, config)
}
export const getActivity = (params: string, config: Types.ApiConfig) => {
  return tdxApi.get(`/api/basic/v2/Tourism/Activity/${params}`, config)
}
