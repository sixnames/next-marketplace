import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import { COL_PRODUCTS } from 'db/collectionNames';
import { ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Form, Formik } from 'formik';
import { useUpdateProductMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateProductSchema } from 'validation/productSchema';

interface ProductDetailsInterface {
  product: ProductModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
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

  const { nameI18n, originalName, descriptionI18n, active, mainImage, barcode } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n,
    originalName,
    descriptionI18n,
    active,
    barcode,
  };

  return (
    <CmsProductLayout product={product}>
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
                  productId: product._id,
                  ...values,
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

                <FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />

                <ProductMainFields />

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

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails product={product} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $project: {
          attributes: false,
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      product: castDbData(product),
    },
  };
};

export default Product;
