import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Link from 'next/link';
import Icon from 'components/Icon';

interface FilterCheckboxLinkInterface {
  option: CatalogueFilterAttributeOptionInterface;
  testId?: string;
  className?: string;
  postfix?: string | null;
  onClick?: () => void;
}

const FilterCheckboxLink: React.FC<FilterCheckboxLinkInterface> = ({
  option,
  onClick,
  testId,
  postfix,
  className,
}) => {
  const { name, nextSlug, isSelected } = option;

  return (
    <Link href={nextSlug}>
      <a
        onClick={onClick}
        data-cy={testId}
        className={`flex items-center gap-2 w-full min-h-[2.5rem] cursor-pointer text-primary-text hover:text-theme hover:no-underline ${
          className ? className : ''
        }`}
      >
        <span className='relative text-theme w-[18px] h-[18px] border border-border-300 rounded border-1 bg-secondary overflow-hidden text-theme flex-shrink-0'>
          {isSelected ? (
            <Icon className='absolute w-[14px] h-[14px] top-[1px] left-[1px] z-10' name={'check'} />
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

export interface FilterCheckboxInterface extends FilterCheckboxLinkInterface {
  hidden?: (option: CatalogueFilterAttributeOptionInterface) => boolean;
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  option,
  testId,
  className,
  postfix,
  onClick,
  hidden,
}) => {
  const renderChildOption = (option: CatalogueFilterAttributeOptionInterface) => {
    const { options } = option;
    if (hidden && hidden(option)) {
      return null;
    }

    if (options && options.length > 0) {
      return (
        <div>
          <FilterCheckboxLink
            option={option}
            postfix={postfix}
            onClick={onClick}
            testId={testId}
            className={className}
          />

          {option.isSelected ? (
            <div className='ml-[18px]'>
              {options.map((option) => {
                if (hidden && hidden(option)) {
                  return null;
                }
                return <div key={option.slug}>{renderChildOption(option)}</div>;
              })}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div>
        <FilterCheckboxLink
          option={option}
          postfix={postfix}
          onClick={onClick}
          testId={testId}
          className={className}
        />
      </div>
    );
  };

  return renderChildOption(option);
};

export default FilterCheckbox;
