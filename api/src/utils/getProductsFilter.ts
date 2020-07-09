import { alwaysArray } from './alwaysArray';
import { RubricProductAttributesFilterInput } from '../resolvers/rubric/RubricProductPaginateInput';

interface InArrayInterface {
  $in: any[];
}

interface NotInArrayInterface {
  $nin: any[];
}

interface EmptyArrayInterface {
  $exists: boolean;
  $size: number;
}

interface ProductsFiltersInterface {
  query?: {
    $text: {
      $search: string;
      $caseSensitive: boolean;
    };
  };
  rubrics?: InArrayInterface | NotInArrayInterface | EmptyArrayInterface;
  active?: boolean;
  [key: string]: any;
}

export function getProductsFilter(
  args: { [key: string]: any } = {},
  city: string,
): ProductsFiltersInterface {
  const searchQuery = args.search
    ? {
        $text: {
          $search: args.search,
          $caseSensitive: false,
        },
      }
    : {};

  const additionalQuery = Object.keys(args).reduce((acc, key) => {
    const value = args[key];
    if (value) {
      if (key === 'search') {
        return acc;
      }

      if (key === 'attributes') {
        const attributesQuery = value.map(({ key, value }: RubricProductAttributesFilterInput) => {
          return {
            'node.attributesGroups.attributes': {
              $elemMatch: {
                key,
                value: { $in: value },
              },
            },
          };
        });

        return {
          ...acc,
          $and: attributesQuery,
        };
      }

      if (key === 'rubrics') {
        const query = alwaysArray(value);
        return { ...acc, 'node.rubrics': { $in: query } };
      }

      if (key === 'rubric') {
        const query = alwaysArray(value);
        return { ...acc, 'node.rubrics': { $in: query } };
      }

      if (key === 'notInRubric') {
        const query = alwaysArray(value);
        return { ...acc, 'node.rubrics': { $nin: query } };
      }

      if (key === 'noRubrics') {
        return { ...acc, 'node.rubrics': { $exists: true, $size: 0 } };
      }

      if (key === 'active') {
        return { ...acc, 'node.active': value };
      }
    }

    return acc;
  }, {});

  return {
    ...searchQuery,
    cities: {
      $elemMatch: {
        key: city,
        ...additionalQuery,
      },
    },
  };
}
