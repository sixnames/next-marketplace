import * as React from 'react';
import FormikFilter from 'components/FormElements/Filter/FormikFilter';
import FormikSearch from 'components/FormElements/Search/FormikSearch';
import Button from 'components/Buttons/Button';
import HorizontalList from 'components/HorizontalList/HorizontalList';

const ShopsFilter: React.FC = () => {
  const initialValues = { search: '' };

  return (
    <FormikFilter initialValues={initialValues}>
      {({ onResetHandler }) => (
        <React.Fragment>
          <FormikSearch testId={'shops'} />

          <HorizontalList>
            <Button type={'submit'} size={'small'}>
              Применить
            </Button>
            <Button onClick={onResetHandler} theme={'secondary'} size={'small'}>
              Сбросить
            </Button>
          </HorizontalList>
        </React.Fragment>
      )}
    </FormikFilter>
  );
};

export default ShopsFilter;
