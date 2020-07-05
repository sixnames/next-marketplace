import React from 'react';
import {
  GetProductQuery,
  useGetRubricsTreeQuery,
  useUpdateProductMutation,
} from '../../generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { Form, Formik } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikTextarea from '../../components/FormElements/Textarea/FormikTextarea';
import InputLine from '../../components/FormElements/Input/InputLine';
import RubricsTree from '../Rubrics/RubricsTree';
import FormikArrayCheckbox from '../../components/FormElements/Checkbox/FormikArrayCheckbox';
import ProductAttributes from '../../components/Modal/CreateNewProductModal/ProductAttributes';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import useUrlFiles from '../../hooks/useUrlFiles';
import classes from './ProductDetails.module.css';
import { updateProductSchema } from '../../validation';

interface ProductDetailsInterface {
  product: GetProductQuery['getProduct'];
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
  const files = useUrlFiles(product.assets);
  const { data, loading, error } = useGetRubricsTreeQuery({
    fetchPolicy: 'network-only',
    variables: {
      counters: {},
    },
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({});
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProduct),
  });

  if (loading) return <Spinner />;
  if (error || !data || !data.getRubricsTree || !product) {
    return <RequestError />;
  }

  const initialValues = {
    id: product.id,
    name: [{ key: 'ru', value: product.name }],
    cardName: [{ key: 'ru', value: product.cardName }],
    price: product.price,
    description: [{ key: 'ru', value: product.description }],
    assets: files,
    rubrics: product.rubrics,
    attributesSource: product.attributesSource,
    attributesGroups: product.attributesGroups.map((group) => {
      return {
        showInCard: group.showInCard,
        node: group.node.id,
        attributes: group.attributes.map((attribute) => {
          return {
            showInCard: attribute.showInCard,
            node: attribute.node.id,
            key: attribute.node.itemId,
            value: attribute.value.map((value) => `${value}`),
          };
        }),
      };
    }),
  };

  return (
    <InnerWide testId={'product-details'}>
      <Formik
        enableReinitialize
        validationSchema={updateProductSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return updateProductMutation({
            variables: {
              input: {
                id: values.id,
                name: values.name,
                cardName: values.cardName,
                description: values.description,
                price: values.price,
                assets: values.assets,
                rubrics: values.rubrics || [],
                attributesSource: `${values.attributesSource}`,
                attributesGroups: values.attributesGroups.map((group) => {
                  return {
                    ...group,
                    attributes: group.attributes.map((attribute) => {
                      return {
                        ...attribute,
                        value: attribute.value.map((value) => `${value}`),
                      };
                    }),
                  };
                }),
              },
            },
          });
        }}
      >
        {({ values }) => {
          const { rubrics, attributesSource } = values;
          const showFeatures = rubrics.length > 0;

          return (
            <Form>
              <FormikDropZone
                tooltip={'Подсказка для загрузки изображения'}
                label={'Изображения'}
                name={'assets'}
                testId={'product-images'}
                isRequired
                showInlineError
              />

              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    isRequired
                    key={index}
                    label={'Название'}
                    name={`name[${index}].value`}
                    testId={'product-name'}
                    showInlineError
                  />
                );
              })}

              {values.cardName.map((_, index) => {
                return (
                  <FormikInput
                    isRequired
                    key={index}
                    label={'Название страницы товара'}
                    name={`cardName[${index}].value`}
                    testId={'product-card-name'}
                    showInlineError
                  />
                );
              })}

              <FormikInput
                isRequired
                label={'Цена'}
                name={'price'}
                testId={'product-price'}
                type={'number'}
                showInlineError
              />

              {values.description.map((_, index) => {
                return (
                  <FormikTextarea
                    isRequired
                    key={index}
                    label={'Описание'}
                    name={`description[${index}].value`}
                    testId={'product-description'}
                    showInlineError
                  />
                );
              })}

              {data && data.getRubricsTree && (
                <InputLine label={'Рубрики'} labelTag={'div'} name={'rubrics'} isRequired low>
                  <RubricsTree
                    low
                    isLastDisabled
                    tree={data.getRubricsTree}
                    lastTitleLeft={(id, testId) => (
                      <FormikArrayCheckbox
                        className={classes.rubricCheckbox}
                        name={'rubrics'}
                        testId={testId}
                        value={id}
                      />
                    )}
                  />
                </InputLine>
              )}

              {showFeatures && <ProductAttributes disabled={Boolean(attributesSource)} />}

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
