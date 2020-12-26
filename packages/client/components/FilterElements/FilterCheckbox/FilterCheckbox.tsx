import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Icon from '../../Icon/Icon';
import classes from './FilterCheckbox.module.css';
import { RubricFilterAttributeOption } from '../../../generated/apolloComponents';
import { alwaysArray } from '../../../utils/alwaysArray';

export interface FilterCheckboxInterface {
  option: Partial<RubricFilterAttributeOption>;
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
  // counter = 0,
}) => {
  const router = useRouter();
  const { pathname = '', query = {}, asPath = '' } = router;
  const { slug, filterNameString } = option;

  const currentQuery = alwaysArray(query.catalogue) || [];
  const optionPath = `${attributeSlug}-${slug}`;
  const isChecked = currentQuery.includes(optionPath);

  let nextAsPath = `${asPath}/${optionPath}`;

  if (isChecked) {
    const filteredQuery = currentQuery.filter((item) => {
      return item !== optionPath;
    });
    nextAsPath = `/${filteredQuery.join('/')}`;
  }

  return (
    <Link
      href={{
        pathname,
      }}
      as={{
        pathname: nextAsPath,
      }}
    >
      <a data-cy={testId} className={`${classes.filterCheckbox} ${className ? className : ''}`}>
        <span className={`${classes.checkbox} ${isChecked ? classes.checked : ''}`}>
          <Icon name={'check'} />
        </span>

        <span className={classes.label}>
          <span>{filterNameString}</span>
          {/*<span className={classes.counter}>{counter}</span>*/}
        </span>
      </a>
    </Link>
  );
};

export default FilterCheckbox;
