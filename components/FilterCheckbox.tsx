import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Link from 'next/link';
import Icon from 'components/Icon';

export interface FilterCheckboxInterface {
  option: CatalogueFilterAttributeOptionInterface;
  testId?: string;
  className?: string;
  postfix?: string | null;
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  option,
  testId,
  className,
  postfix,
  // counter = 0,
}) => {
  const { name, nextSlug, isSelected } = option;

  return (
    <Link href={nextSlug}>
      <a
        data-cy={testId}
        className={`flex items-center gap-2 w-full min-h-[var(--formInputHeight)] cursor-pointer text-primary-text hover:text-theme hover:no-underline ${
          className ? className : ''
        }`}
      >
        <span className='relative text-theme w-[18px] h-[18px] rounded border-1 bg-secondary overflow-hidden text-theme`'>
          {isSelected ? (
            <Icon className='absolute w-[10px] h-[10px] top-[4px] left-[4px] z-10' name={'check'} />
          ) : null}
        </span>

        <span className=''>
          <span>
            {name}
            {postfix ? ` ${postfix}` : ''}
          </span>
          {/*<span className='text-sm'>{counter}</span>*/}
        </span>
      </a>
    </Link>
  );
};

export default FilterCheckbox;
