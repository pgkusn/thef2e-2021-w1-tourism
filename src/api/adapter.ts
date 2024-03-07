import * as Types from '@/types'

export const getScenicSpotList = (data: Types.ScenicSpotListApiResponse[]) => {
  return data.map(item => ({
    type: 'ScenicSpot',
    id: item.ScenicSpotID,
    name: item.ScenicSpotName,
    city: item.City || item.Address?.slice(0, 3),
    picture: item.Picture.PictureUrl1 || `https://picsum.photos/354/190?random=${Math.random()}`,
    pictureDescription: item.Picture.PictureDescription1,
    classes: [item.Class1, item.Class2, item.Class3].filter(Boolean),
  }))
}
export const getScenicSpot = (data: Types.ScenicSpotApiResponse) => {
  const picture = Array.from({ length: 3 }, (_, i) => {
    const key = `PictureUrl${i + 1}` as Types.PictureUrlKey
    return {
      url: data.Picture[key] || `https://picsum.photos/610/389?random=${Math.random()}`,
      description: data.Picture[`PictureDescription${i + 1}` as Types.PictureDescriptionKey],
    }
  })
  return {
    name: data.ScenicSpotName,
    city: data.City || data.Address?.slice(0, 3),
    picture,
    classes: [data.Class1, data.Class2, data.Class3].filter(Boolean),
    openTime: data.OpenTime,
    descriptionDetail: data.DescriptionDetail,
    phone: data.Phone,
    websiteUrl: data.WebsiteUrl,
  }
}
export const getRestaurantList = (data: Types.RestaurantListApiResponse[]) => {
  return data.map(item => ({
    type: 'Restaurant',
    id: item.RestaurantID,
    name: item.RestaurantName,
    city: item.City || item.Address?.slice(0, 3) || '',
    picture: item.Picture.PictureUrl1 || `https://picsum.photos/354/190?random=${Math.random()}`,
    pictureDescription: item.Picture.PictureDescription1 || '',
    classes: [item.Class].filter(Boolean) as string[],
  }))
}
export const getRestaurant = (data: Types.RestaurantApiResponse) => {
  const picture = Array.from({ length: 3 }, (_, i) => {
    const key = `PictureUrl${i + 1}` as Types.PictureUrlKey
    return {
      url: data.Picture[key] || `https://picsum.photos/610/389?random=${Math.random()}`,
      description: data.Picture[`PictureDescription${i + 1}` as Types.PictureDescriptionKey],
    }
  })
  return {
    name: data.RestaurantName,
    city: data.City || data.Address?.slice(0, 3),
    picture,
    classes: [data.Class].filter(Boolean),
    openTime: data.OpenTime,
    phone: data.Phone,
    websiteUrl: data.WebsiteUrl,
  }
}
export const getHotelList = (data: Types.HotelListApiResponse[]) => {
  return data.map(item => ({
    type: 'Hotel',
    id: item.HotelID,
    name: item.HotelName,
    city: item.City || item.Address?.slice(0, 3) || '',
    picture: item.Picture.PictureUrl1 || `https://picsum.photos/354/190?random=${Math.random()}`,
    pictureDescription: item.Picture.PictureDescription1 || '',
    classes: [item.Class].filter(Boolean) as string[],
  }))
}
export const getHotel = (data: Types.HotelApiResponse) => {
  const picture = Array.from({ length: 3 }, (_, i) => {
    const key = `PictureUrl${i + 1}` as Types.PictureUrlKey
    return {
      url: data.Picture[key] || `https://picsum.photos/610/389?random=${Math.random()}`,
      description: data.Picture[`PictureDescription${i + 1}` as Types.PictureDescriptionKey],
    }
  })
  return {
    name: data.HotelName,
    city: data.City || data.Address?.slice(0, 3),
    picture,
    classes: [data.Class].filter(Boolean),
    phone: data.Phone,
    websiteUrl: data.WebsiteUrl,
  }
}
export const getActivityList = (data: Types.ActivityListApiResponse[]) => {
  return data.map(item => ({
    type: 'Activity',
    id: item.ActivityID,
    name: item.ActivityName,
    city: item.City || item.Address?.slice(0, 3) || '',
    picture: item.Picture.PictureUrl1 || `https://picsum.photos/354/190?random=${Math.random()}`,
    pictureDescription: item.Picture.PictureDescription1 || '',
    classes: [item.Class1, item.Class2].filter(Boolean) as string[],
  }))
}
export const getActivity = (data: Types.ActivityApiResponse) => {
  const picture = Array.from({ length: 3 }, (_, i) => {
    const key = `PictureUrl${i + 1}` as Types.PictureUrlKey
    return {
      url: data.Picture[key] || `https://picsum.photos/610/389?random=${Math.random()}`,
      description: data.Picture[`PictureDescription${i + 1}` as Types.PictureDescriptionKey],
    }
  })
  return {
    name: data.ActivityName,
    city: data.City || data.Address?.slice(0, 3),
    picture,
    classes: [data.Class1, data.Class2].filter(Boolean),
    phone: data.Phone,
    websiteUrl: data.WebsiteUrl,
  }
}
