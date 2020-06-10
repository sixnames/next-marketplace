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
  [key: string]: any;
}

export function getProductsFilter(
  args: { [key: string]: any } = {},
  city: string,
): ProductsFiltersInterface {
  return Object.keys(args).reduce(
    (acc, key) => {
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
        return { ...acc, ['cities.node.rubrics']: { $in: [value] } };
      }

      if (!!value && key === 'notInRubric') {
        return { ...acc, ['cities.node.rubrics']: { $nin: [value] } };
      }

      if (!!value && key === 'noRubrics') {
        return { ...acc, ['cities.node.rubrics']: { $exists: true, $size: 0 } };
      }

      return acc;
    },
    {
      ['cities.key']: city,
    },
  );
}
