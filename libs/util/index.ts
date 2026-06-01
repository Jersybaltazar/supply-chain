export const MAX_AGE = 1 * 24 * 60 * 60

export const initialViewState = {
  longitude: -77.0428,
  latitude: -12.0464,
  zoom: 5,
}

export const initialBounds = {
  ne_lat: -0.038777,
  ne_lng: -68.652329,
  sw_lat: -18.349728,
  sw_lng: -81.326744,
}

export type Location = {
  latitude: number
  longitude: number
}

type LngLatLike = {
  lng: number
  lat: number
}

export const initialBoundsArray = [
  { lat: -18.349728, lng: -81.326744 },
  { lat: -0.038777, lng: -68.652329 },
] as [LngLatLike, LngLatLike]
