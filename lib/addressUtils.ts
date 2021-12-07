import {
  AddressType,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js/dist/common';
import { AddressComponentModel } from 'db/dbModels';

export function getReadableAddress(addressComponents: AddressComponentModel[]): string {
  let streetNumber = '';
  let street = '';
  let city = '';
  addressComponents.forEach((component) => {
    const types = component.types as Array<AddressType | GeocodingAddressComponentType>;
    const shortName = component.shortName;

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
    if (isCity) {
      city = shortName;
    }
  });

  return `${street}${streetNumber ? ` ${streetNumber}` : ''}${city ? `, ${city}` : ''}`;
}
