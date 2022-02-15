import {
  AddressType,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js/dist/common';
import { ReverseGeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/reversegeocode';
import { AddressComponentModel } from 'db/dbModels';
import fetch from 'node-fetch';

export function getReadableAddress(addressComponents: AddressComponentModel[]): string {
  let streetNumber = '';
  let street = '';
  let city: string[] = [];

  const streetNumberType = 'street_number' as AddressType | GeocodingAddressComponentType;
  const streetType = 'route' as AddressType | GeocodingAddressComponentType;
  const excludedTypes = [
    'administrative_area_level_1',
    'administrative_area_level_3',
    'sublocality_level_1',
    'sublocality',
    'country',
  ] as Array<AddressType | GeocodingAddressComponentType>;
  const cityTypes = ['administrative_area_level_2', 'locality', 'political'] as Array<
    AddressType | GeocodingAddressComponentType
  >;

  addressComponents.forEach((component) => {
    const types = component.types as Array<AddressType | GeocodingAddressComponentType>;
    const shortName = component.shortName;

    const excluded = types.some((type) => {
      return excludedTypes.includes(type);
    });

    if (excluded) {
      return;
    }

    if (types.includes(streetNumberType)) {
      streetNumber = shortName;
      return;
    }

    if (types.includes(streetType)) {
      street = shortName;
      return;
    }

    const isCity = types.some((type) => {
      return cityTypes.includes(type);
    });
    if (isCity && !city.includes(shortName)) {
      city.push(shortName);
    }
  });

  return `${street}${streetNumber ? ` ${streetNumber}` : ''}${
    city.length > 0 ? `, ${city.join(', ')}` : ''
  }`;
}

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
