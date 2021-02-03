import * as React from 'react';
import classes from './FilterLink.module.css';
import TagLink, { TagLinkInterface } from './TagLink';
import { CatalogueFilterAttributeOptionFragment } from 'generated/apolloComponents';
import Icon from '../Icon/Icon';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: CatalogueFilterAttributeOptionFragment;
  withCross?: boolean;
}

const FilterLink: React.FC<FilterLinkInterface> = ({
  className,
  option,
  counter,
  withCross,
  ...props
}) => {
  const { name, nextSlug, isSelected, isDisabled } = option;

  return (
    <TagLink
      href={nextSlug}
      isActive={isSelected}
      className={`${classes.filterLink} ${isDisabled ? classes.filterLinkDisabled : ''} ${
        className ? className : ''
      }`}
      {...props}
    >
      <span>{name}</span>
      {withCross ? <Icon name={'cross'} /> : null}
      {counter ? <span>{counter}</span> : null}
    </TagLink>
  );
};

export default FilterLink;