import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { alwaysArray } from '../../../utils/alwaysArray';
import Icon from '../../Icon/Icon';
import classes from './FilterCheckbox.module.css';

export interface FilterCheckboxItem {
  id: string;
  color?: string | null;
  nameString: string;
  slug: string;
}

export interface FilterCheckboxInterface {
  option: FilterCheckboxItem;
  counter: number;
  attributeSlug: string;
  testId?: string;
  className?: string;
  excludedQueries?: string[];
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  option,
  attributeSlug = '',
  testId,
  className,
  counter = 0,
}) => {
  const router = useRouter();
  const { pathname = '', query = {}, asPath = '' } = router;
  const { slug, nameString } = option;

  // TODO change id to slug and queryKey to slug
  const currentQuery = alwaysArray(query.catalogue) || [];
  const optionPath = `${attributeSlug}-${slug}`;
  const isChecked = currentQuery.includes(optionPath);
  const iconName = isChecked ? 'CheckBox' : 'CheckBoxOutlineBlank';

  let nextAsPath = `${asPath}/${optionPath}`;

  if (isChecked) {
    const filteredQuery = currentQuery.filter((item) => {
      return item !== optionPath;
    });
    nextAsPath = `/${filteredQuery.join('/')}`;
  }

  return (
    <Fragment>
      <Link
        href={{
          pathname,
        }}
        as={{
          pathname: nextAsPath,
        }}
      >
        <a
          data-cy={testId}
          className={`${classes.frame} ${isChecked ? classes.current : ''} ${
            className ? className : ''
          }`}
        >
          <span className={classes.checkbox}>
            <Icon name={iconName} />
          </span>

          <span className={classes.label}>
            <span>{nameString}</span>
            <span>{counter}</span>
          </span>
        </a>
      </Link>
    </Fragment>
  );
};

export default FilterCheckbox;
