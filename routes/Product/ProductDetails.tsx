import Image from 'next/image';
import * as React from 'react';
import {
  CmsProductFragment,
  ProductAttributeInput,
  useGetRubricsTreeQuery,
  useUpdateProductMutation,
} from 'generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
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

  const { data, loading, error } = useGetRubricsTreeQuery({
    fetchPolicy: 'network-only',
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({});
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProduct),
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getRubricsTree || !product) {
    return <RequestError />;
  }

  const {
    nameI18n,
    originalName,
    descriptionI18n,
    rubricsIds,
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
    rubricsIds,
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
          const attributes = values.attributes.reduce(
            (acc: ProductAttributeInput[], attributesGroup) => {
              const groupAttributes: ProductAttributeInput[] = attributesGroup.astAttributes.map(
                (attribute) => {
                  return {
                    attributeId: attribute.attributeId,
                    attributesGroupId: attribute.attributesGroupId,
                    attributeSlug: attribute.attributeSlug,
                    number: attribute.number,
                    textI18n: attribute.textI18n,
                    selectedOptionsSlugs: attribute.selectedOptionsSlugs,
                    showAsBreadcrumb: attribute.showAsBreadcrumb,
                    showInCard: attribute.showInCard,
                  };
                },
              );
              return [...acc, ...groupAttributes];
            },
            [],
          );
          return updateProductMutation({
            variables: {
              input: {
                productId: product._id,
                ...values,
                attributes,
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

              <ProductMainFields productId={product._id} rubricsTree={data?.getRubricsTree} />

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
