import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import { alwaysArray } from '../../../utils/alwaysArray';
import Icon from '../../Icon/Icon';
import classes from './FilterCheckbox.module.css';

export interface FilterCheckboxInterface {
  name?: string;
  id: string;
  queryKey: string;
  testId?: string;
  className?: string;
  additionalQuery?: ParsedUrlQueryInput;
  asPath?: string;
  excludedQueries?: string[];
}

const FilterCheckbox: React.FC<FilterCheckboxInterface> = ({
  name = '',
  id = '',
  queryKey = '',
  testId,
  className,
}) => {
  const router = useRouter();
  const { pathname = '', query = {}, asPath = '' } = router;

  // TODO change id to slug and queryKey to slug
  const currentQuery = alwaysArray(query.catalogue) || [];
  const optionPath = `${queryKey}-${id}`;
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

          <span className={classes.label}>{name}</span>
        </a>
      </Link>
    </Fragment>
  );
};

export default FilterCheckbox;
