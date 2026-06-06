import type { RouteLocation } from 'vue-router'

export type InitData = (to: RouteLocation, from: RouteLocation) => Promise<void>
export type TourismType = 'ScenicSpot' | 'Restaurant' | 'Hotel' | 'Activity'

export interface City {
  CityName: string
  City: string
}
export interface Card {
  type: string
  id: string
  name: string
  city: string
  picture: string
  pictureDescription: string
  classes: string[]
  isFavorite?: boolean
}
export interface Picture {
  url: string
  description: string
}
export interface ApiConfig {
  headers: {
    Authorization: string
  }
}

// 觀光資料 V2.1 巢狀結構
export interface Image {
  Name: string
  Description: string
  URL: string
}
export interface PostalAddress {
  City: string
  CityCode: string
  Town: string
  ZipCode: string
  StreetAddress: string
}
export interface Telephone {
  Tel: string
  Ext: number | null
}

// V2.1 採 OData V4,資料包在 value 陣列
export interface ODataResponse<T> {
  value: T[]
}

interface TourismCommon {
  PositionLat: number
  PositionLon: number
  PostalAddress: PostalAddress
  Telephones: Telephone[]
  Images: Image[]
  Tags: string[]
  Description: string
  WebsiteUrl: string
  ServiceTimeInfo?: string
  UpdateTime: string
}

export interface AttractionApiResponse extends TourismCommon {
  AttractionID: string
  AttractionName: string
  AttractionClasses: number[]
}
export interface RestaurantApiResponse extends TourismCommon {
  RestaurantID: string
  RestaurantName: string
  CuisineClasses: number[]
}
export interface HotelApiResponse extends TourismCommon {
  HotelID: string
  HotelName: string
  HotelClasses: number[]
}
export interface EventApiResponse extends TourismCommon {
  EventID: string
  EventName: string
  EventClasses: number[]
  StartDateTime: string
  EndDateTime: string
}
