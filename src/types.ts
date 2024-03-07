import type { RouteLocation } from 'vue-router'

export type TourismType = 'ScenicSpot' | 'Restaurant' | 'Hotel' | 'Activity'
export type PictureUrlKey = 'PictureUrl1' | 'PictureUrl2' | 'PictureUrl3'
export type PictureDescriptionKey =
  | 'PictureDescription1'
  | 'PictureDescription2'
  | 'PictureDescription3'
export type InitData = (to: RouteLocation, from: RouteLocation) => Promise<void>

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
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class1: string
  Class2: string
  Class3: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface ScenicSpotApiResponse {
  ScenicSpotName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class1: string
  Class2: string
  Class3: string
  OpenTime: string
  DescriptionDetail: string
  Phone: string
  SrcUpdateTime: string
  UpdateTime: string
  WebsiteUrl: string
}
export interface RestaurantListApiResponse {
  RestaurantID: string
  RestaurantName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface RestaurantApiResponse {
  RestaurantName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class: string
  OpenTime: string
  Phone: string
  SrcUpdateTime: string
  UpdateTime: string
  WebsiteUrl: string
}
export interface HotelListApiResponse {
  HotelID: string
  HotelName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface HotelApiResponse {
  HotelName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class: string
  Phone: string
  SrcUpdateTime: string
  UpdateTime: string
  WebsiteUrl: string
}
export interface ActivityListApiResponse {
  ActivityID: string
  ActivityName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class1: string
  Class2: string
  SrcUpdateTime: string
  UpdateTime: string
}
export interface ActivityApiResponse {
  ActivityName: string
  Address: string
  City: string
  Picture: {
    PictureUrl1: string
    PictureDescription1: string
    PictureUrl2: string
    PictureDescription2: string
    PictureUrl3: string
    PictureDescription3: string
  }
  Class1: string
  Class2: string
  Phone: string
  SrcUpdateTime: string
  UpdateTime: string
  WebsiteUrl: string
}
