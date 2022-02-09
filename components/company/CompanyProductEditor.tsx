import { Form, Formik } from 'formik';
import * as React from 'react';
import { DEFAULT_CITY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { CompanyInterface, ProductFacetInterface, RubricInterface } from 'db/uiInterfaces';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import WpAccordion from '../WpAccordion';

export interface CompanyProductEditorInterface {
  product: ProductFacetInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyProductEditor: React.FC<CompanyProductEditorInterface> = ({ product }) => {
  const { cities } = useConfigContext();

  const initialValues = {};

  return (
    <Inner testId={'product-card-editor'}>
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
                  <WpAccordion
                    isOpen={slug === DEFAULT_CITY}
                    testId={cityTestId}
                    title={`${name}`}
                    key={slug}
                  >
                    <div className='ml-8 pt-[var(--lineGap-200)]'>{slug}</div>
                  </WpAccordion>
                );
              })}
              <div className='mb-12 mt-4 flex'>
                <WpButton size={'small'} type={'submit'} testId={`card-content-submit`}>
                  Сохранить
                </WpButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CompanyProductEditor;
