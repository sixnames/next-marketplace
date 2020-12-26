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
  key: string;
}

export const getCatalogueFilterValueByKey = ({
  asPath,
  key,
}: GetCatalogueFilterValueByKeyInterface): string | null => {
  const pathOptions = asPath.split('/');
  const optionsObjects = pathOptions.map((option) => {
    const optionObject = option.split('-');
    return {
      key: optionObject[0],
      value: optionObject[1],
    };
  });
  const currentOption = optionsObjects.find((option) => {
    return option.key === key;
  });

  if (!currentOption) {
    return null;
  }
  return currentOption.value;
};
