import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import Inner from 'components/Inner';
import { DEFAULT_CITY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import * as React from 'react';

export interface CompanyProductConstructorInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyProductConstructor: React.FC<CompanyProductConstructorInterface> = ({ product }) => {
  const { cities } = useConfigContext();

  const initialValues = {};

  return (
    <Inner testId={'product-card-constructor'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          /*showLoading();
          updateProductCardContentMutation({
            variables: {
              input: values,
            },
          }).catch(console.log);*/
        }}
      >
        {() => {
          return (
            <Form>
              {cities.map(({ name, slug }) => {
                const cityTestId = `${product.slug}-${slug}`;

                return (
                  <Accordion
                    isOpen={slug === DEFAULT_CITY}
                    testId={cityTestId}
                    title={`${name}`}
                    key={slug}
                  >
                    <div className='ml-8 pt-[var(--lineGap-200)]'>{slug}</div>
                  </Accordion>
                );
              })}
              <div className='flex mb-12 mt-4'>
                <Button size={'small'} type={'submit'} testId={`card-content-submit`}>
                  Сохранить
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CompanyProductConstructor;
