import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProductMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateProductSchema } from 'validation/productSchema';

interface ProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, rubric }) => {
  const { setReloadToTrue } = useReloadListener();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      setReloadToTrue();
      onCompleteCallback(data.updateProduct);
    },
  });

  const {
    nameI18n,
    originalName,
    descriptionI18n,
    active,
    mainImage,
    barcode,
    gender,
    cardDescriptionI18n,
    seo,
  } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n: nameI18n || {},
    originalName,
    descriptionI18n,
    active,
    barcode,
    gender: gender as any,
    cardDescriptionI18n,
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <Inner testId={'product-details'}>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            return updateProductMutation({
              variables: {
                input: {
                  ...values,
                  productId: product._id,
                  barcode: (values.barcode || []).filter((currentBarcode) => {
                    return Boolean(currentBarcode);
                  }),
                },
              },
            });
          }}
        >
          {() => {
            return (
              <Form noValidate>
                <div className='relative w-[15rem] h-[15rem] mb-8'>
                  <Image
                    src={mainImage}
                    alt={originalName}
                    title={originalName}
                    layout='fill'
                    objectFit='contain'
                  />
                </div>

                {/*<FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />*/}

                <ProductMainFields seo={seo} />

                <FixedButtons>
                  <Button testId={'submit-product'} type={'submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails product={product} rubric={rubric} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { props } = await getAppInitialData({ context });

  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      rubric: castDbData(payload.rubric),
    },
  };
};

export default Product;
