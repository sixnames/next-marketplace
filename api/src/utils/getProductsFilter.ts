import { alwaysArray } from './alwaysArray';

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
    if (!!value) {
      if (key === 'search') {
        return acc;
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
