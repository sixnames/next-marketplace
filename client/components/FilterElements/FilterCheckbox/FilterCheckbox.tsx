import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import classes from './FilterCheckbox.module.css';
import { ObjectType } from '../../../types';
import { alwaysArray } from '../../../utils/alwaysArray';
import Icon from '../../Icon/Icon';

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
  additionalQuery = {},
  asPath,
  excludedQueries = [],
}) => {
  const { pathname = '', query = {} } = useRouter();
  const queryValue = alwaysArray(query[queryKey]);
  const isCurrent = queryValue && queryValue.includes(id);
  const filteredQuery = Object.keys(query).reduce((acc: ObjectType, key: string) => {
    if (excludedQueries?.includes(key) || !key || !query[key]) {
      return acc;
    }

    return { ...acc, [key]: query[key] };
  }, {});

  let nextQuery = {
    ...filteredQuery,
    [queryKey]: [...queryValue, id],
  };

  if (isCurrent) {
    nextQuery = Object.keys(filteredQuery).reduce((acc: ObjectType, key: string) => {
      if (key === queryKey) {
        if (queryValue.length === 1) {
          return acc;
        }

        return {
          ...acc,
          [key]: queryValue.filter((value) => value !== id),
        };
      }
      return {
        ...acc,
        [key]: query[key],
      };
    }, {});
  }

  const iconName = isCurrent ? 'CheckBox' : 'CheckBoxOutlineBlank';

  return (
    <Fragment>
      <Link
        href={{
          pathname,
          query: { ...nextQuery, ...additionalQuery },
        }}
        as={
          asPath
            ? {
                pathname: asPath,
                query: { ...nextQuery, ...additionalQuery },
              }
            : {}
        }
      >
        <a
          data-cy={testId}
          className={`${classes.frame} ${isCurrent ? classes.current : ''} ${
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
