import Icon from 'components/Icon';
import Link from 'components/Link/Link';
import { useConfigContext } from 'context/configContext';
import { useThemeContext } from 'context/themeContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import * as React from 'react';

interface FilterSelectedAttributesInterface {
  selectedAttributes?: CatalogueFilterAttributeInterface[] | null;
  onClick?: () => void | null;
  clearSlug: string;
}

function getSelectedOptionName(option: CatalogueFilterAttributeOptionInterface): string {
  function getNamesArray(option: CatalogueFilterAttributeOptionInterface, acc: string[]): string[] {
    const { name, options, isSelected } = option;
    const newAcc = [...acc];
    if (!newAcc.includes(name) && isSelected) {
      newAcc.push(name);
    }
    if (!options || options.length < 1) {
      return newAcc;
    }
    return options.reduce((innerAcc: string[], option) => {
      return [...innerAcc, ...getNamesArray(option, [])];
    }, newAcc);
  }

  const namesArray = getNamesArray(option, []);
  return namesArray.join(' - ');
}

const FilterSelectedAttributes: React.FC<FilterSelectedAttributesInterface> = ({
  selectedAttributes,
  onClick,
  clearSlug,
}) => {
  const { isDark } = useThemeContext();
  const { configs } = useConfigContext();
  const style = React.useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor:
        (isDark ? configs.siteNavBarBgDarkTheme : configs.siteNavBarBgLightTheme) ||
        'var(--secondaryBackground)',
    };
  }, [configs.siteNavBarBgDarkTheme, configs.siteNavBarBgLightTheme, isDark]);

  if (!selectedAttributes || selectedAttributes.length < 1) {
    return null;
  }

  return (
    <div style={style} className='px-4 py-6 rounded-lg mb-6 shadow-sm'>
      <div className='flex items-baseline mb-3 justify-between'>
        <span className={`font-medium text-lg`}>Выбранные фильтры</span>
        <Link onClick={onClick} href={clearSlug} className={`ml-4`}>
          Очистить
        </Link>
      </div>
      <div className='space-y-5'>
        {selectedAttributes.map((attribute) => {
          return (
            <div key={`${attribute._id}`}>
              <div className='font-medium mb-1'>{attribute.name}</div>
              <div className='space-y-1'>
                {attribute.options.map((option) => {
                  return (
                    <div key={`${option._id}`}>
                      <Link
                        href={option.nextSlug}
                        className='text-secondary-text hover:no-underline flex items-baseline justify-between'
                      >
                        <span className='hover:text-theme'>
                          <Icon name={'cross'} className='w-[0.75rem] h-[0.75rem]' />
                        </span>
                        <span className='block w-[calc(100%-1.25rem)]'>
                          {getSelectedOptionName(option)}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSelectedAttributes;
