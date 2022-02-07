import { Form, Formik } from 'formik';
import * as React from 'react';
import { UpdateProductCardContentInputInterface } from 'db/dao/product/updateProductCardContent';
import { ProductSummaryInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { useUpdateProductCardContent } from 'hooks/mutations/useProductMutations';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import SeoContentEditor from '../SeoContentEditor';

export interface ConsoleRubricProductConstructorInterface {
  product: ProductSummaryInterface;
  cardContent: SeoContentCitiesInterface;
  companySlug: string;
}

const ConsoleRubricProductConstructor: React.FC<ConsoleRubricProductConstructorInterface> = ({
  cardContent,
  companySlug,
}) => {
  const [updateProductCardContentMutation] = useUpdateProductCardContent();

  return (
    <Inner testId={'product-card-constructor'}>
      <Formik<UpdateProductCardContentInputInterface>
        initialValues={{
          seoContentsList: cardContent,
          companySlug,
        }}
        onSubmit={(values) => {
          updateProductCardContentMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <SeoContentEditor filedName={'seoContentsList'} />

              <div className='mb-12 mt-4 flex'>
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
