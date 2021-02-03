import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import classes from './FilterRadio.module.css';
import { ObjectType } from 'types/clientTypes';

export interface FilterRadioInterface {
  name?: string;
  _id: string;
  queryKey: string;
  testId?: string;
  className?: string;
  additionalQuery?: ParsedUrlQueryInput;
  excludedQueries?: string[];
}

const FilterRadio: React.FC<FilterRadioInterface> = ({
  name = '',
  _id = '',
  queryKey = '',
  testId,
  className,
  additionalQuery = {},
  excludedQueries = [],
}) => {
  const { pathname, query } = useRouter();
  const queryValue = query[queryKey];
  const isCurrent = queryValue && queryValue === _id;
  const filteredQuery = Object.keys(query).reduce((acc: ObjectType, key: string) => {
    if (excludedQueries.includes(key)) {
      return acc;
    }
    return { ...acc, [key]: query[key] };
  }, {});

  let nextQuery = {
    ...filteredQuery,
    [queryKey]: _id,
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
    <React.Fragment>
      <Link
        href={{
          pathname,
          query: { ...nextQuery, ...additionalQuery },
        }}
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
    </React.Fragment>
  );
};

export default FilterRadio;
