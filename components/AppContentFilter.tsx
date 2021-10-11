import Accordion from 'components/Accordion';
import CheckBoxFilter, { CheckBoxFilterInterface } from 'components/CheckBoxFilter';
import Link from 'components/Link/Link';
import * as React from 'react';

interface AppContentFilterInterface extends CheckBoxFilterInterface {
  excludedParams: string[];
}

const AppContentFilter: React.FC<AppContentFilterInterface> = (props) => {
  return (
    <Accordion
      title={'Фильтр'}
      titleRight={
        props.selectedAttributes.length > 0 ? (
          <Link href={props.clearSlug}>Очистить фильтр</Link>
        ) : null
      }
    >
      <div className='mt-8'>
        <CheckBoxFilter {...props} />
      </div>
    </Accordion>
  );
};

export default AppContentFilter;
