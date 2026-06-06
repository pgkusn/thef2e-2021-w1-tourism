import * as Types from '@/types'

const listPlaceholder = () => `https://picsum.photos/354/190?random=${Math.random()}`
const detailPlaceholder = () => `https://picsum.photos/610/389?random=${Math.random()}`

const toCard = (
  type: string,
  id: string,
  name: string,
  item: { PostalAddress?: Types.PostalAddress; Images?: Types.Image[]; Tags?: string[] }
): Types.Card => ({
  type,
  id,
  name,
  city: item.PostalAddress?.City || '',
  picture: item.Images?.[0]?.URL || listPlaceholder(),
  pictureDescription: item.Images?.[0]?.Name || '',
  classes: (item.Tags || []).filter(Boolean),
})

const toPictures = (images?: Types.Image[]): Types.Picture[] => {
  if (!images?.length) return [{ url: detailPlaceholder(), description: '' }]
  return images.map(img => ({ url: img.URL || detailPlaceholder(), description: img.Name || '' }))
}

const firstPhone = (telephones?: Types.Telephone[]) => telephones?.[0]?.Tel || ''

export const getScenicSpotList = (data: Types.AttractionApiResponse[]) =>
  data.map(item => toCard('ScenicSpot', item.AttractionID, item.AttractionName, item))

export const getScenicSpot = (data: Types.AttractionApiResponse) => ({
  name: data.AttractionName,
  city: data.PostalAddress?.City || '',
  picture: toPictures(data.Images),
  classes: (data.Tags || []).filter(Boolean),
  openTime: data.ServiceTimeInfo || '',
  descriptionDetail: data.Description || '',
  phone: firstPhone(data.Telephones),
  websiteUrl: data.WebsiteUrl || '',
})

export const getRestaurantList = (data: Types.RestaurantApiResponse[]) =>
  data.map(item => toCard('Restaurant', item.RestaurantID, item.RestaurantName, item))

export const getRestaurant = (data: Types.RestaurantApiResponse) => ({
  name: data.RestaurantName,
  city: data.PostalAddress?.City || '',
  picture: toPictures(data.Images),
  classes: (data.Tags || []).filter(Boolean),
  openTime: data.ServiceTimeInfo || '',
  descriptionDetail: data.Description || '',
  phone: firstPhone(data.Telephones),
  websiteUrl: data.WebsiteUrl || '',
})

export const getHotelList = (data: Types.HotelApiResponse[]) =>
  data.map(item => toCard('Hotel', item.HotelID, item.HotelName, item))

export const getHotel = (data: Types.HotelApiResponse) => ({
  name: data.HotelName,
  city: data.PostalAddress?.City || '',
  picture: toPictures(data.Images),
  classes: (data.Tags || []).filter(Boolean),
  openTime: data.ServiceTimeInfo || '',
  descriptionDetail: data.Description || '',
  phone: firstPhone(data.Telephones),
  websiteUrl: data.WebsiteUrl || '',
})

export const getActivityList = (data: Types.EventApiResponse[]) =>
  data.map(item => toCard('Activity', item.EventID, item.EventName, item))

export const getActivity = (data: Types.EventApiResponse) => {
  const period =
    data.StartDateTime && data.EndDateTime ? `${data.StartDateTime} ~ ${data.EndDateTime}` : ''
  return {
    name: data.EventName,
    city: data.PostalAddress?.City || '',
    picture: toPictures(data.Images),
    classes: (data.Tags || []).filter(Boolean),
    openTime: data.ServiceTimeInfo || period,
    descriptionDetail: data.Description || '',
    phone: firstPhone(data.Telephones),
    websiteUrl: data.WebsiteUrl || '',
  }
}
