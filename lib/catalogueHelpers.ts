import { FILTER_SEPARATOR } from 'config/common';

interface GetCatalogueFilterNextPathInterface {
  filters: string[];
  excludedKeys: string[];
}

export const getCatalogueFilterNextPath = ({
  filters,
  excludedKeys,
}: GetCatalogueFilterNextPathInterface): string => {
  if (filters.length < 1) {
    return '';
  }
  return `/${filters
    .filter((option) => {
      if (!option || option.length < 1) {
        return false;
      }
      const optionArray = option.split('-');
      return !excludedKeys.includes(optionArray[0]);
    })
    .join('/')}`;
};

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
    const splittedOption = param.split(FILTER_SEPARATOR);
    const attributeSlug = splittedOption[0];
    const optionSlug = splittedOption[1];
    return {
      attributeSlug,
      optionSlug,
    };
  });
  const currentOption = optionsObjects.find((option) => {
    return option.attributeSlug === slug;
  });

  if (!currentOption) {
    return null;
  }
  return currentOption.optionSlug;
};
