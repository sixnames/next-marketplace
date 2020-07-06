import React, { Fragment } from 'react';
import { Form, Formik } from 'formik';
import FormikInput from '../../../components/FormElements/Input/FormikInput';
import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icon/Icon';
import HeaderSearchResult from './HeaderSearchResult';
import classes from './HeaderSearch.module.css';

function HeaderSearch() {
  return (
    <Fragment>
      <Formik
        initialValues={{ query: '' }}
        onSubmit={({ query }) => {
          console.log(query);
        }}
      >
        {({ values, setFieldValue }) => {
          const { query } = values;

          function clearSearch() {
            setFieldValue('query', '');
          }

          return (
            <div className={classes.frame}>
              <Form className={classes.holder}>
                <FormikInput
                  frameClass={classes.line}
                  className={classes.input}
                  name={'query'}
                  low
                />

                <Button theme={'secondary'} className={classes.butn} type={'submit'}>
                  <Icon name={'Search'} />
                </Button>
              </Form>

              {query.length > 1 && <HeaderSearchResult clearSearch={clearSearch} query={query} />}
            </div>
          );
        }}
      </Formik>
    </Fragment>
  );
}

export default HeaderSearch;
