interface GetCatalogueFilterNextPathInterface {
  asPath: string;
  excludedKeys: string[];
}

export const getCatalogueFilterNextPath = ({
  asPath,
  excludedKeys,
}: GetCatalogueFilterNextPathInterface): string => {
  return asPath
    .split('/')
    .filter((option) => {
      const optionArray = option.split('-');
      return !excludedKeys.includes(optionArray[0]);
    })
    .join('/');
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
  const optionsObjects = pathOptions.map((option) => {
    const optionObject = option.split('-');
    return {
      slug: optionObject[0],
      value: optionObject[1],
    };
  });
  const currentOption = optionsObjects.find((option) => {
    return option.slug === slug;
  });

  if (!currentOption) {
    return null;
  }
  return currentOption.value;
};
