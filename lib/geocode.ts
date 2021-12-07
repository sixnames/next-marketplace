import { AddressComponentModel } from 'db/dbModels';
import fetch from 'node-fetch';
import { ReverseGeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/reversegeocode';

export type ReverseGeocodePayload = ReverseGeocodeResponseData;

interface ReverseGeocodeInterface {
  lat: number;
  lng: number;
  locale: string;
}

export const reverseGeocode = async ({
  lat,
  lng,
  locale,
}: ReverseGeocodeInterface): Promise<ReverseGeocodePayload> => {
  const coordinates = `latlng=${lat},${lng}`;
  const settings = `language=${locale}&location_type=ROOFTOP&result_type=street_address`;
  const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${coordinates}&${settings}&${apiKey}`;
  const res = await fetch(url);
  const json = (await res.json()) as ReverseGeocodePayload;
  return json;
};

interface GeocodeInterface {
  value: string;
  locale: string;
}

export interface GeocodeResultInterface {
  addressComponents: AddressComponentModel[];
  formattedAddress: string;
  point: {
    lat: number;
    lng: number;
  };
}

export const geocode = async ({
  value,
  locale,
}: GeocodeInterface): Promise<GeocodeResultInterface[]> => {
  const address = `address=${value}`;
  const settings = `language=${locale}&location_type=ROOFTOP&result_type=street_address`;
  const apiKey = `key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${address}&${settings}&${apiKey}`;
  const res = await fetch(url);
  const json = (await res.json()) as ReverseGeocodeResponseData;
  return json.results.map(({ formatted_address, geometry, address_components }) => {
    return {
      formattedAddress: formatted_address,
      point: {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
      },
      addressComponents: address_components.map((component) => {
        return {
          shortName: component.short_name,
          longName: component.long_name,
          types: component.types,
        };
      }),
    };
  });
};
