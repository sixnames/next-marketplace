import * as React from 'react';
import WpAccordion from './WpAccordion';
import CheckBoxFilter, { CheckBoxFilterInterface } from './CheckBoxFilter';
import WpLink from './Link/WpLink';

interface AppContentFilterInterface extends Omit<CheckBoxFilterInterface, 'filterListClassName'> {}

const AppContentFilter: React.FC<AppContentFilterInterface> = (props) => {
  return (
    <WpAccordion
      title={'Фильтр'}
      titleRight={
        props.selectedAttributes.length > 0 ? (
          <WpLink href={props.clearSlug}>Сбросить фильтр</WpLink>
        ) : null
      }
    >
      <div className='mt-8'>
        <CheckBoxFilter
          {...props}
          filterListClassName='grid gap-x-12 gap-y-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
        />
      </div>
    </WpAccordion>
  );
};

export default AppContentFilter;
