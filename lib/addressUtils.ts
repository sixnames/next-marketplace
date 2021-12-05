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
    const cityType = 'administrative_area_level_2' as AddressType | GeocodingAddressComponentType;

    if (types.includes(streetNumberType)) {
      streetNumber = shortName;
    }

    if (types.includes(streetType)) {
      street = shortName;
    }

    if (types.includes(cityType)) {
      city = shortName;
    }
  });

  return `${street}${streetNumber ? ` ${streetNumber}` : ''}${city ? `, ${city}` : ''}`;
}
