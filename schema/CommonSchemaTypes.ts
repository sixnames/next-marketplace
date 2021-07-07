import { enumType, inputObjectType, interfaceType, objectType } from 'nexus';
import { CoordinatesModel } from 'db/dbModels';
import {
  GENDER_ENUMS,
  PAGE_DEFAULT,
  PAGINATION_DEFAULT_LIMIT,
  SORT_ASC,
  SORT_BY_CREATED_AT,
  SORT_DESC,
} from 'config/common';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';

export const Gender = enumType({
  name: 'Gender',
  members: GENDER_ENUMS,
  description: 'Gender enum.',
});

export const MapMarker = objectType({
  name: 'MapMarker',
  definition(t) {
    t.string('lightTheme');
    t.string('darkTheme');
  },
});

export const FormattedPhone = objectType({
  name: 'FormattedPhone',
  definition(t) {
    t.nonNull.string('raw');
    t.nonNull.string('readable');
  },
});

export const Contacts = objectType({
  name: 'Contacts',
  definition(t) {
    t.nonNull.list.nonNull.email('emails');
    t.nonNull.list.nonNull.phone('phones');
    t.nonNull.list.nonNull.field('formattedPhones', {
      type: 'FormattedPhone',
      resolve: (source) => {
        try {
          const { phones } = source;
          return phones.map((phone) => {
            return {
              raw: phoneToRaw(phone),
              readable: phoneToReadable(phone),
            };
          });
        } catch (e) {
          console.log(e);
          return [];
        }
      },
    });
  },
});

export const ContactsInput = inputObjectType({
  name: 'ContactsInput',
  definition(t) {
    t.nonNull.list.nonNull.email('emails');
    t.nonNull.list.nonNull.phone('phones');
  },
});

export const Asset = objectType({
  name: 'Asset',
  definition(t) {
    t.nonNull.string('url');
    t.nonNull.int('index');
  },
});

export const Coordinates = objectType({
  name: 'Coordinates',
  definition(t) {
    t.nonNull.float('lat');
    t.nonNull.float('lng');
  },
});

export const PointGeoJSON = objectType({
  name: 'PointGeoJSON',
  definition(t) {
    t.nonNull.string('type', {
      description: 'Field that specifies the GeoJSON object type.',
    });
    t.nonNull.list.nonNull.float('coordinates', {
      description:
        'Coordinates that specifies the object’s coordinates. If specifying latitude and longitude coordinates, list the longitude first and then latitude.',
    });
  },
});

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.string('formattedAddress');
    t.nonNull.field('point', {
      type: 'PointGeoJSON',
    });
    t.nonNull.field('formattedCoordinates', {
      type: 'Coordinates',
      resolve: (source): CoordinatesModel => {
        const { coordinates } = source.point;
        return {
          lat: coordinates[1],
          lng: coordinates[0],
        };
      },
    });
  },
});

export const CoordinatesInput = inputObjectType({
  name: 'CoordinatesInput',
  definition(t) {
    t.nonNull.float('lat');
    t.nonNull.float('lng');
  },
});

export const AddressInput = inputObjectType({
  name: 'AddressInput',
  definition(t) {
    t.nonNull.string('formattedAddress');
    t.nonNull.field('point', {
      type: 'CoordinatesInput',
    });
  },
});

export const Base = interfaceType({
  name: 'Base',
  resolveType: (source) => {
    return source.type;
  },
  definition(t) {
    t.nonNull.objectId('_id');
    t.nonNull.string('itemId');
  },
});

export const Timestamp = interfaceType({
  name: 'Timestamp',
  resolveType: (source) => {
    return source.type;
  },
  definition(t) {
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
  },
});

export const Payload = interfaceType({
  name: 'Payload',
  resolveType: (source) => {
    return source.type;
  },
  definition(t) {
    t.nonNull.boolean('success');
    t.nonNull.string('message');
  },
});

export const SelectOption = objectType({
  name: 'SelectOption',
  description: 'Type for all selects options.',
  definition(t) {
    t.nonNull.string('_id');
    t.nonNull.string('name');
    t.string('icon');
  },
});

export const SortDirection = enumType({
  name: 'SortDirection',
  members: {
    ASC: SORT_ASC,
    DESC: SORT_DESC,
  },
  description: 'Sort direction enum.',
});

export const PaginationInput = inputObjectType({
  name: 'PaginationInput',
  definition(t) {
    t.string('search');
    t.string('sortBy', {
      default: SORT_BY_CREATED_AT,
    });
    t.field('sortDir', {
      type: 'SortDirection',
      default: SORT_DESC,
    });
    t.int('page', {
      default: PAGE_DEFAULT,
    });
    t.int('limit', {
      default: PAGINATION_DEFAULT_LIMIT,
    });
  },
});

export const PaginationPayload = interfaceType({
  name: 'PaginationPayload',
  resolveType: (source) => {
    return source.type;
  },
  definition(t) {
    t.nonNull.string('sortBy');
    t.nonNull.field('sortDir', {
      type: 'SortDirection',
    });
    t.nonNull.int('totalDocs');
    t.nonNull.int('totalActiveDocs');
    t.nonNull.int('page');
    t.nonNull.int('limit');
    t.nonNull.int('totalPages');
    t.nonNull.boolean('hasPrevPage');
    t.nonNull.boolean('hasNextPage');
  },
});

export const AlphabetList = interfaceType({
  name: 'AlphabetList',
  resolveType: (source) => {
    return source.type;
  },
  definition(t) {
    t.nonNull.string('letter');
  },
});
