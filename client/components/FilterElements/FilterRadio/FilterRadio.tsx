import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import classes from './FilterRadio.module.css';
import { ObjectType } from '../../../types';

export interface FilterRadioInterface {
  name?: string;
  id: string;
  queryKey: string;
  testId?: string;
  className?: string;
  additionalQuery?: ParsedUrlQueryInput;
  asPath?: string;
  excludedQueries?: string[];
}

const FilterRadio: React.FC<FilterRadioInterface> = ({
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
  const queryValue = query[queryKey];
  const isCurrent = queryValue && queryValue === id;
  const filteredQuery = Object.keys(query).reduce((acc: ObjectType, key: string) => {
    if (excludedQueries?.includes(key)) {
      return acc;
    }
    return { ...acc, [key]: query[key] };
  }, {});

  let nextQuery = {
    ...filteredQuery,
    [queryKey]: id,
  };

  if (isCurrent) {
    nextQuery = Object.keys(filteredQuery).reduce((acc: ObjectType, key: string) => {
      if (key === queryKey) {
        return acc;
      }
      return {
        ...acc,
        [key]: query[key],
      };
    }, {});
  }

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
          <span className={classes.radio}>
            <span />
          </span>

          {name}
        </a>
      </Link>
    </Fragment>
  );
};

export default FilterRadio;
