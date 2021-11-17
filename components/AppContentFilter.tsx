import Accordion from 'components/Accordion';
import CheckBoxFilter, { CheckBoxFilterInterface } from 'components/CheckBoxFilter';
import Link from 'components/Link/Link';
import * as React from 'react';

interface AppContentFilterInterface extends Omit<CheckBoxFilterInterface, 'filterListClassName'> {}

const AppContentFilter: React.FC<AppContentFilterInterface> = (props) => {
  return (
    <Accordion
      title={'Фильтр'}
      titleRight={
        props.selectedAttributes.length > 0 ? (
          <Link href={props.clearSlug}>Сбросить фильтр</Link>
        ) : null
      }
    >
      <div className='mt-8'>
        <CheckBoxFilter
          {...props}
          filterListClassName='grid gap-x-12 gap-y-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
        />
      </div>
    </Accordion>
  );
};

export default AppContentFilter;
