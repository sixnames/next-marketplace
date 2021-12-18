import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import SeoContentEditor from 'components/SeoContentEditor';
import { UpdateProductCardContentInputInterface } from 'db/dao/product/updateProductCardContent';
import { ProductInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProductCardContent } from 'hooks/mutations/useProductMutations';
import * as React from 'react';

export interface ConsoleRubricProductConstructorInterface {
  product: ProductInterface;
  cardContent: SeoContentCitiesInterface;
  companySlug: string;
}

const ConsoleRubricProductConstructor: React.FC<ConsoleRubricProductConstructorInterface> = ({
  cardContent,
  companySlug,
}) => {
  const initialValues = {
    cardContent,
    companySlug,
  };
  const [updateProductCardContentMutation] = useUpdateProductCardContent();

  return (
    <Inner testId={'product-card-constructor'}>
      <Formik<UpdateProductCardContentInputInterface>
        initialValues={initialValues}
        onSubmit={(values) => {
          updateProductCardContentMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <SeoContentEditor filedName={'cardContent'} />

              <div className='flex mb-12 mt-4'>
                <WpButton
                  theme={'secondary'}
                  size={'small'}
                  type={'submit'}
                  testId={`card-content-submit`}
                >
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

export default ConsoleRubricProductConstructor;
