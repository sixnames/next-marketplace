import { UpdateProductCardContentInputInterface } from 'db/dao/product/updateProductCardContent';
import { ProductSummaryInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProductCardContent } from 'hooks/mutations/useProductMutations';
import { alwaysString } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import SeoContentEditor from '../SeoContentEditor';

export interface ConsoleRubricProductEditorInterface {
  product: ProductSummaryInterface;
  seoContentsList: SeoContentCitiesInterface;
  companySlug: string;
}

const ConsoleRubricProductEditor: React.FC<ConsoleRubricProductEditorInterface> = ({
  seoContentsList,
  companySlug,
  product,
}) => {
  const router = useRouter();
  const [updateProductCardContentMutation] = useUpdateProductCardContent();

  return (
    <Inner testId={'product-card-editor'}>
      <Formik<UpdateProductCardContentInputInterface>
        initialValues={{
          seoContentsList,
          companySlug,
          productId: `${product._id}`,
        }}
        onSubmit={(values) => {
          updateProductCardContentMutation({
            taskId: alwaysString(router.query.taskId),
            ...values,
          }).catch(console.log);
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

export default ConsoleRubricProductEditor;
