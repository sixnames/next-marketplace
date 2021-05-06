import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import * as React from 'react';
import TagLink, { TagLinkInterface } from './TagLink';
import Icon from '../Icon/Icon';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: CatalogueFilterAttributeOptionInterface;
  withCross?: boolean;
  disabled?: boolean;
  postfix?: string | null;
}

const FilterLink: React.FC<FilterLinkInterface> = ({
  className,
  option,
  counter,
  withCross,
  disabled,
  postfix,
  ...props
}) => {
  const { name, nextSlug, isSelected } = option;

  return (
    <TagLink
      href={nextSlug}
      isActive={isSelected}
      prefetch={false}
      className={`${disabled ? 'cursor-default pointer-events-none opacity-50' : ''} ${
        className ? className : ''
      }`}
      {...props}
    >
      <span>
        {name}
        {postfix ? postfix : null}
      </span>
      {counter ? <span>{counter}</span> : null}
      {withCross ? (
        <Icon className='w-2 h-2 ml-2 fill-theme cursor-pointer' name={'cross'} />
      ) : null}
    </TagLink>
  );
};

export default FilterLink;
