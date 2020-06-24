import React, { Fragment } from 'react';
import { ParsedUrlQueryInput } from 'querystring';
import useRouterQuery from '../../../hooks/useRouterQuery';
import { Link } from 'react-router-dom';
import qs from 'querystring';
import classes from './FilterRadio.module.css';

export interface FilterRadioInterface {
  name?: string;
  id: string;
  queryKey: string;
  testId?: string;
  className?: string;
  additionalQuery?: ParsedUrlQueryInput;
}

const FilterRadio: React.FC<FilterRadioInterface> = ({
  name = '',
  id = '',
  queryKey = '',
  testId,
  className,
  additionalQuery = {},
}) => {
  const { pathname = '', query = {} } = useRouterQuery();
  const queryValue = query[queryKey];
  const isCurrent = queryValue && queryValue === id;

  let nextQuery = {
    ...query,
    [queryKey]: id,
  };

  if (isCurrent) {
    nextQuery = Object.keys(query).reduce((acc: {}, key: string) => {
      if (key === queryKey) {
        return acc;
      }
      return {
        ...acc,
        [key]: query[key],
      };
    }, {});
  }

  const search = qs.stringify({
    ...nextQuery,
    ...additionalQuery,
  });

  return (
    <Fragment>
      <Link
        to={{
          pathname,
          search: `?${search}`,
        }}
        className={`${classes.frame} ${isCurrent ? classes.current : ''} ${
          className ? className : ''
        }`}
        data-cy={testId}
      >
        <span className={classes.radio}>
          <span />
        </span>

        {name}
      </Link>
    </Fragment>
  );
};

export default FilterRadio;
