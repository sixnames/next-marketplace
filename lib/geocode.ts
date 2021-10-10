import fetch from 'node-fetch';
import { ReverseGeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/reversegeocode';

export type ReverseGeocodePayload = ReverseGeocodeResponseData;

interface ReverseGeocodeInterface {
  lat: number;
  lng: number;
  language: string;
}

export const reverseGeocode = async ({
  lat,
  lng,
  language,
}: ReverseGeocodeInterface): Promise<ReverseGeocodePayload> => {
  const coordinates = `latlng=${lat},${lng}`;
  const settings = `language=${language}&location_type=ROOFTOP&result_type=street_address`;
  const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${coordinates}&${settings}&${apiKey}`;
  const res = await fetch(url);
  const json = (await res.json()) as ReverseGeocodePayload;
  return json;
};

interface GeocodeInterface {
  value: string;
  language: string;
}

export interface GeocodeResultInterface {
  formattedAddress: string;
  point: {
    lat: number;
    lng: number;
  };
}

export const geocode = async ({
  value,
  language,
}: GeocodeInterface): Promise<GeocodeResultInterface[]> => {
  const address = `address=${value}`;
  const settings = `language=${language}&location_type=ROOFTOP&result_type=street_address`;
  const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${address}&${settings}&${apiKey}`;
  const res = await fetch(url);
  const json = (await res.json()) as ReverseGeocodeResponseData;
  return json.results.map(({ formatted_address, geometry }) => {
    return {
      formattedAddress: formatted_address,
      point: {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
      },
    };
  });
};
