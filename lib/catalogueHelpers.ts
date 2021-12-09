import { FILTER_SEPARATOR } from 'config/common';

interface GetCatalogueFilterNextPathInterface {
  filters: string[];
  excludedKeys: string[];
}

export const getCatalogueFilterNextPath = ({
  filters,
  excludedKeys,
}: GetCatalogueFilterNextPathInterface): string => {
  return filters
    .filter((option) => {
      if (!option || option.length < 1) {
        return false;
      }
      const optionArray = option.split('-');
      return !excludedKeys.includes(optionArray[0]);
    })
    .join('/');
};

interface CastCatalogueFilterPayloadInterface {
  attributeSlug: string;
  optionSlug: string;
}

export function castCatalogueFilter(filter: string): CastCatalogueFilterPayloadInterface {
  const splittedOption = filter.split(FILTER_SEPARATOR);

  return {
    attributeSlug: `${splittedOption[0]}`,
    optionSlug: splittedOption[1],
  };
}

interface GetCatalogueFilterValueByKeyInterface {
  asPath: string;
  slug: string;
}

export const getCatalogueFilterValueByKey = ({
  asPath,
  slug,
}: GetCatalogueFilterValueByKeyInterface): string | null => {
  const pathOptions = asPath.split('/');
  const optionsObjects = pathOptions.map((param) => {
    return castCatalogueFilter(param);
  });
  const currentOption = optionsObjects.find((option) => {
    return option.attributeSlug === slug;
  });

  if (!currentOption) {
    return null;
  }
  return currentOption.optionSlug;
};
