import { useRouter } from 'next/router';
import * as React from 'react';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from '../db/uiInterfaces';
import WpIcon from './WpIcon';

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
  const router = useRouter();
  if (!selectedAttributes || selectedAttributes.length < 1) {
    return null;
  }

  return (
    <div className='px-4 py-6 rounded-lg mb-6 shadow-sm border-2 border-theme'>
      <div className='flex items-baseline mb-3 justify-between'>
        <span className={`font-medium text-lg`}>Выбранные фильтры</span>
        <div
          className='ml-4 text-theme cursor-pointer hover:underline'
          onClick={() => {
            router.push(`${clearSlug}`).then(() => {
              if (onClick) {
                onClick();
              }
            });
          }}
        >
          Сбросить
        </div>
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
                      <div
                        className='text-secondary-text hover:no-underline hover:text-theme transition-all cursor-pointer flex items-baseline justify-between'
                        onClick={() => {
                          router.push(`${option.nextSlug}`).then(() => {
                            if (onClick) {
                              onClick();
                            }
                          });
                        }}
                      >
                        <span className='hover:text-theme'>
                          <WpIcon name={'cross'} className='w-[0.75rem] h-[0.75rem]' />
                        </span>
                        <span className='block w-[calc(100%-1.25rem)]'>
                          {getSelectedOptionName(option)}
                        </span>
                      </div>
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
