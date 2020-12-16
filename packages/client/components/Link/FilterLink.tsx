import React from 'react';
import classes from './FilterLink.module.css';
import TagLink, { TagLinkInterface } from './TagLink';
import { RubricFilterAttributeOption } from '../../generated/apolloComponents';
import Icon from '../Icon/Icon';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: Partial<RubricFilterAttributeOption>;
  attributeSlug: string;
  withCross?: boolean;
}

const FilterLink: React.FC<FilterLinkInterface> = ({
  className,
  option,
  attributeSlug = '',
  counter,
  withCross,
  ...props
}) => {
  const { filterNameString, optionNextSlug, isSelected } = option;

  return (
    <TagLink
      href={optionNextSlug}
      isActive={isSelected}
      className={`${classes.filterLink} ${className ? className : ''}`}
      {...props}
    >
      <span>{filterNameString}</span>
      {withCross ? <Icon name={'cross'} /> : null}
      {counter ? <span>{counter}</span> : null}
    </TagLink>
  );
};

export default FilterLink;
