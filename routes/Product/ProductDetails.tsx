import { PRODUCT_ATTRIBUTES_AST_QUERY, PRODUCT_QUERY } from 'graphql/complex/productsQueries';
import { omit } from 'lodash';
import Image from 'next/image';
import * as React from 'react';
import { CmsProductFragment, useUpdateProductMutation } from 'generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import FormikCheckboxLine from '../../components/FormElements/Checkbox/FormikCheckboxLine';
import { updateProductSchema } from 'validation/productSchema';
import classes from './ProductDetails.module.css';
import ProductMainFields, {
  ProductFormValuesInterface,
} from 'components/FormTemplates/ProductMainFields';

interface ProductDetailsInterface {
  product: CmsProductFragment;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });

  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({});
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProduct),
    refetchQueries: [
      {
        query: PRODUCT_QUERY,
        variables: {
          _id: product._id,
        },
      },
      {
        query: PRODUCT_ATTRIBUTES_AST_QUERY,
        variables: {
          input: {
            productId: product._id,
            rubricId: product.rubricId,
          },
        },
      },
    ],
  });

  const {
    nameI18n,
    originalName,
    descriptionI18n,
    rubricId,
    active,
    brandCollectionSlug,
    brandSlug,
    manufacturerSlug,
    mainImage,
    name,
  } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: product._id,
    nameI18n,
    originalName,
    descriptionI18n,
    rubricId,
    active,
    brandSlug,
    brandCollectionSlug,
    manufacturerSlug,
    attributes: [],
  };

  return (
    <InnerWide testId={'product-details'}>
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
                attributes: values.attributes.map((productAttribute) => {
                  return omit(productAttribute, ['attribute', '__typename', 'attributeName']);
                }),
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <div className={classes.image}>
                <Image src={mainImage} alt={name} title={name} layout='fill' objectFit='contain' />
              </div>

              <FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />

              <ProductMainFields productId={product._id} />

              <Button testId={'submit-product'} type={'submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

export default ProductDetails;
