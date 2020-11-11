import fetch from 'node-fetch';
import { ReverseGeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/reversegeocode';

interface ReverseGeocodeInterface {
  lat: number;
  lng: number;
  language: string;
}

export const reverseGeocode = async ({
  lat,
  lng,
  language,
}: ReverseGeocodeInterface): Promise<ReverseGeocodeResponseData> => {
  const coordinates = `latlng=${lat},${lng}`;
  const settings = `language=${language}&location_type=ROOFTOP&result_type=street_address`;
  const apiKey = `key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${coordinates}&${settings}&${apiKey}`;
  const res = await fetch(url);
  return res.json();
};
