import React from 'react';
import classes from './FilterLink.module.css';
import TagLink, { TagLinkInterface } from './TagLink';
import { RubricFilterAttributeOption } from '../../generated/apolloComponents';
import { useRouter } from 'next/router';
import { alwaysArray } from '@yagu/shared';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: Partial<RubricFilterAttributeOption>;
  attributeSlug: string;
}

const FilterLink: React.FC<FilterLinkInterface> = ({
  className,
  option,
  attributeSlug = '',
  counter,
  ...props
}) => {
  const router = useRouter();
  const { query = {}, pathname = '', asPath = '' } = router;
  const { slug, filterNameString } = option;

  const currentQuery = alwaysArray(query.catalogue) || [];
  const optionPath = `${attributeSlug}-${slug}`;
  const isActive = currentQuery.includes(optionPath);

  let nextAsPath = `${asPath}/${optionPath}`;

  if (isActive) {
    const filteredQuery = currentQuery.filter((item) => {
      return item !== optionPath;
    });
    nextAsPath = `/${filteredQuery.join('/')}`;
  }

  return (
    <TagLink
      href={{
        pathname,
      }}
      as={{
        pathname: nextAsPath,
      }}
      isActive={isActive}
      className={`${classes.filterLink} ${className ? className : ''}`}
      {...props}
    >
      <span>{filterNameString}</span>
      {counter ? <span>{counter}</span> : null}
    </TagLink>
  );
};

export default FilterLink;
