import type { RouteLocation } from 'vue-router'

type PictureUrl = {
  PictureUrl1: string
  PictureUrl2: string
  PictureUrl3: string
}
type PictureDescription = {
  PictureDescription1: string
  PictureDescription2: string
  PictureDescription3: string
}
export type KeysOfPictureUrl = keyof PictureUrl
export type KeysOfPictureDescription = keyof PictureDescription
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
export interface TokenApiRequest {
  grant_type: string
  client_id: string
  client_secret: string
}
export interface ScenicSpotListApiResponse {
  ScenicSpotID: string
  ScenicSpotName: string
  Address: string
  City: string
  Picture: PictureUrl & PictureDescription
  Class1: string
  Class2: string
  Class3: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface ScenicSpotApiResponse extends ScenicSpotListApiResponse {
  OpenTime: string
  DescriptionDetail: string
  Phone: string
  WebsiteUrl: string
}
export interface RestaurantListApiResponse {
  RestaurantID: string
  RestaurantName: string
  Address: string
  City: string
  Picture: PictureUrl & PictureDescription
  Class: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface RestaurantApiResponse extends RestaurantListApiResponse {
  OpenTime: string
  Phone: string
  WebsiteUrl: string
}
export interface HotelListApiResponse {
  HotelID: string
  HotelName: string
  Address: string
  City: string
  Picture: PictureUrl & PictureDescription
  Class: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface HotelApiResponse extends HotelListApiResponse {
  Phone: string
  WebsiteUrl: string
}
export interface ActivityListApiResponse {
  ActivityID: string
  ActivityName: string
  Address: string
  City: string
  Picture: PictureUrl & PictureDescription
  Class1: string
  Class2: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface ActivityApiResponse extends ActivityListApiResponse {
  Phone: string
  WebsiteUrl: string
}
