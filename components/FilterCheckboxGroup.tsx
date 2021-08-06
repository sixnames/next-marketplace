import Link from 'components/Link/Link';
import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import * as React from 'react';
import FilterCheckbox from 'components/FilterCheckbox';

interface FilterCheckboxGroupInterface {
  checkboxItems: CatalogueFilterAttributeOptionInterface[];
  className?: string;
  checkboxClassName?: string;
  label?: string;
  attributeSlug: string;
  clearSlug?: string;
  isSelected?: boolean;
  showMoreHandler?: () => void;
}

const FilterCheckboxGroup: React.FC<FilterCheckboxGroupInterface> = ({
  label,
  checkboxItems,
  className,
  attributeSlug,
  checkboxClassName,
  clearSlug,
  isSelected,
  showMoreHandler,
}) => {
  return (
    <div className={`mb-8 ${className ? className : ''}`}>
      {label ? (
        <div className='flex items-baseline mb-2 justify-between'>
          <span className={`font-medium text-lg`}>{label}</span>
          {isSelected && clearSlug ? (
            <Link href={clearSlug} className={`ml-4`}>
              Очистить
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className='space-y-1'>
        {checkboxItems.map((option) => {
          const key = `${attributeSlug}-${option.slug}`;
          return (
            <div key={key}>
              <FilterCheckbox
                option={option}
                testId={key}
                className={`${checkboxClassName ? checkboxClassName : ''}`}
              />
            </div>
          );
        })}
      </div>

      {showMoreHandler ? (
        <div className='uppercase cursor-pointer hover:text-theme mt-6' onClick={showMoreHandler}>
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

export default FilterCheckboxGroup;
