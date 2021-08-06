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
  onClick?: () => void;
  isSelected?: boolean;
  showMoreHandler?: (() => void) | null;
  postfix?: string | null;
  testId?: string;
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
  postfix,
  testId,
  onClick,
}) => {
  return (
    <div className={`mb-8 ${className ? className : ''}`}>
      {label ? (
        <div className='flex items-baseline mb-2 justify-between'>
          <span className={`font-medium text-lg`}>{label}</span>
          {isSelected && clearSlug ? (
            <Link onClick={onClick} href={clearSlug} className={`ml-4`}>
              Очистить
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className='space-y-1'>
        {checkboxItems.map((option, optionIndex) => {
          const key = `${attributeSlug}-${option.slug}`;
          const optionTestId = `${testId}-${optionIndex}`;
          return (
            <div key={key}>
              <FilterCheckbox
                onClick={onClick}
                option={option}
                testId={optionTestId}
                className={`${checkboxClassName ? checkboxClassName : ''}`}
                postfix={postfix}
              />
            </div>
          );
        })}
      </div>

      {showMoreHandler ? (
        <div
          className='uppercase cursor-pointer hover:text-theme mt-2 text-secondary-text'
          onClick={showMoreHandler}
        >
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

export default FilterCheckboxGroup;
