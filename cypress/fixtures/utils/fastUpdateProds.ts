import {
  AddressType,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js/dist/common';
import { ReverseGeocodeResponseData } from '@googlemaps/google-maps-services-js/dist/geocode/reversegeocode';
import { Db } from 'mongodb';
import fetch from 'node-fetch';
import { DEFAULT_CITY, DEFAULT_LOCALE, ID_COUNTER_STEP } from '../../../config/common';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_CONFIGS, COL_ID_COUNTERS, COL_SHOPS } from '../../../db/collectionNames';
import {
  AddressComponentModel,
  AddressModel,
  ConfigModel,
  IdCounterModel,
  ShopModel,
} from '../../../db/dbModels';
require('dotenv').config();

export async function getFastNextNumberItemId(collectionName: string, db: Db): Promise<string> {
  const idCountersCollection = db.collection<IdCounterModel>(COL_ID_COUNTERS);

  const updatedCounter = await idCountersCollection.findOneAndUpdate(
    { collection: collectionName },
    {
      $inc: {
        counter: ID_COUNTER_STEP,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  );

  if (!updatedCounter.ok || !updatedCounter.value) {
    throw Error(`${collectionName} id counter update error`);
  }

  return `${updatedCounter.value.counter}`;
}

interface GeocodeInterface {
  value: string;
  language: string;
}

interface AddressComponentInterface {
  types: Array<AddressType | GeocodingAddressComponentType>;
  longName: string;
  shortName: string;
}

interface GeocodeResultInterface {
  formattedAddress: string;
  addressComponents: AddressComponentInterface[];
  readableAddress: string;
  point: {
    lat: number;
    lng: number;
  };
}

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
  return json.results.map(({ formatted_address, geometry, address_components }) => {
    const addressComponents = address_components.map((component) => {
      return {
        shortName: component.short_name,
        longName: component.long_name,
        types: component.types,
      };
    });
    return {
      formattedAddress: formatted_address,
      point: {
        lat: geometry.location.lat,
        lng: geometry.location.lng,
      },
      readableAddress: getReadableAddress(addressComponents),
      addressComponents,
    };
  });
};

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const shopsCollection = db.collection<ShopModel>(COL_SHOPS);
    const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

    // shops
    const shops = await shopsCollection.find({}).toArray();
    for await (const shop of shops) {
      const { address } = shop;
      if (address) {
        const geoCodeResult = await geocode({
          value: address.formattedAddress,
          language: 'ru',
        });
        const geoResult = geoCodeResult[0];
        if (geoResult) {
          const shopAddress: AddressModel = {
            formattedAddress: geoResult.formattedAddress,
            readableAddress: geoResult.readableAddress,
            mapCoordinates: geoResult.point,
            point: address.point,
            addressComponents: geoResult.addressComponents,
          };

          await shopsCollection.findOneAndUpdate(
            { _id: shop._id },
            {
              $set: {
                address: shopAddress,
              },
            },
          );
        }
      }
    }

    // configs
    const configs = await configsCollection.find({ slug: 'actualAddress' }).toArray();
    for await (const config of configs) {
      if (
        config.cities[DEFAULT_CITY] &&
        config.cities[DEFAULT_CITY][DEFAULT_LOCALE] &&
        config.cities[DEFAULT_CITY][DEFAULT_LOCALE][0]
      ) {
        const value = config.cities[DEFAULT_CITY][DEFAULT_LOCALE][0];
        if (value !== '{}') {
          const initialAddress = JSON.parse(value) as AddressModel;
          const geoCodeResult = await geocode({
            value: initialAddress.formattedAddress,
            language: 'ru',
          });
          const geoResult = geoCodeResult[0];
          if (geoResult) {
            const configAddress: AddressModel = {
              formattedAddress: geoResult.formattedAddress,
              readableAddress: geoResult.readableAddress,
              mapCoordinates: geoResult.point,
              point: initialAddress.point,
              addressComponents: geoResult.addressComponents,
            };

            await configsCollection.findOneAndUpdate(
              { _id: config._id },
              {
                $set: {
                  [`cities.msk.ru`]: [JSON.stringify(configAddress)],
                },
              },
            );
          }
        }
      }
    }

    /*const geoCodeResult = await geocode({
      value: 'Тверская ул., 27 строение 2, Москва, Россия, 125047',
      language: 'ru',
    });
    geoCodeResult.forEach((res) => {
      console.log(res.readableAddress);
    });*/

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
