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
  const additionalQuery = Object.keys(args).reduce((acc, key) => {
    const value = args[key];

    if (!!value && key === 'query') {
      return {
        ...acc,
        $text: {
          $search: value,
          $caseSensitive: false,
        },
      };
    }

    if (!!value && key === 'rubric') {
      return { ...acc, 'node.rubrics': { $in: [value] } };
    }

    if (!!value && key === 'notInRubric') {
      return { ...acc, 'node.rubrics': { $nin: [value] } };
    }

    if (!!value && key === 'noRubrics') {
      return { ...acc, 'node.rubrics': { $exists: true, $size: 0 } };
    }

    if (!!value && key === 'active') {
      return { ...acc, 'node.active': value };
    }

    return acc;
  }, {});

  return {
    cities: {
      $elemMatch: {
        key: city,
        ...additionalQuery,
      },
    },
  };
}
