import React, { Fragment } from 'react';
import FormikFilter from '../../components/FormElements/Filter/FormikFilter';
import FormikSearch from '../../components/FormElements/Search/FormikSearch';
import Button from '../../components/Buttons/Button';
import useWithFilterQuery from '../../hooks/useWithFilterQuery';
import HorizontalList from '../../components/HorizontalList/HorizontalList';
// import classes from './ProductsFilter.module.css';

const CompaniesFilter: React.FC = () => {
  const initialValues = { search: '' };
  const withFilterQuery = useWithFilterQuery();

  return (
    <FormikFilter initialValues={initialValues} initialQueryValue={withFilterQuery}>
      {({ onResetHandler }) => (
        <Fragment>
          <FormikSearch testId={'products'} />

          <HorizontalList>
            <Button type={'submit'} size={'small'}>
              Применить
            </Button>
            <Button onClick={onResetHandler} theme={'secondary'} size={'small'}>
              Сбросить
            </Button>
          </HorizontalList>
        </Fragment>
      )}
    </FormikFilter>
  );
};

export default CompaniesFilter;
