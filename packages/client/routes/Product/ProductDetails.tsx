import React from 'react';
import {
  CmsProductFragment,
  useGetRubricsTreeQuery,
  useUpdateProductMutation,
} from '../../generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { Form, Formik } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import RubricsTree from '../Rubrics/RubricsTree';
import FormikArrayCheckbox from '../../components/FormElements/Checkbox/FormikArrayCheckbox';
import ProductAttributes from '../../components/Modal/CreateNewProductModal/ProductAttributes';
import Button from '../../components/Buttons/Button';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import useUrlFiles from '../../hooks/useUrlFiles';
import classes from './ProductDetails.module.css';
import { updateProductSchema } from '@yagu/validation';
import { useLanguageContext } from '../../context/languageContext';
import FormikTranslationsInput from '../../components/FormElements/Input/FormikTranslationsInput';
import useValidationSchema from '../../hooks/useValidationSchema';
import FormikCheckboxLine from '../../components/FormElements/Checkbox/FormikCheckboxLine';

interface ProductDetailsInterface {
  product: CmsProductFragment;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product }) => {
  const files = useUrlFiles(product.assets);
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });

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
    name: getLanguageFieldInitialValue(product.name),
    cardName: getLanguageFieldInitialValue(product.cardName),
    price: product.price,
    description: getLanguageFieldInitialValue(product.description),
    assets: files,
    rubrics: product.rubrics,
    active: product.active,
    attributesGroups: product.attributesGroups.map((group) => {
      return {
        showInCard: group.showInCard,
        node: group.node.id,
        attributes: group.attributes.map((attribute) => {
          return {
            showInCard: attribute.showInCard,
            node: attribute.node.id,
            key: attribute.node.slug,
            viewVariant: attribute.viewVariant,
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
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return updateProductMutation({
            variables: {
              input: {
                ...values,
                name: getLanguageFieldInputValue(values.name),
                cardName: getLanguageFieldInputValue(values.cardName),
                description: getLanguageFieldInputValue(values.description),
                rubrics: values.rubrics || [],
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
          const { rubrics } = values;
          const showFeatures = rubrics.length > 0;

          return (
            <Form>
              <FormikCheckboxLine label={'Активен'} name={'active'} testId={'active'} />

              <FormikDropZone
                tooltip={'Подсказка для загрузки изображения'}
                label={'Изображения'}
                name={'assets'}
                testId={'product-images'}
                isRequired
                showInlineError
              />

              <FormikTranslationsInput
                label={'Название'}
                name={'name'}
                testId={'name'}
                showInlineError
                isRequired
              />

              <FormikTranslationsInput
                label={'Название страницы товара'}
                name={'cardName'}
                testId={'cardName'}
                showInlineError
                isRequired
              />

              <FormikInput
                isRequired
                label={'Цена'}
                name={'price'}
                testId={'product-price'}
                type={'number'}
                showInlineError
              />

              <FormikTranslationsInput
                label={'Описание'}
                name={'description'}
                testId={'description'}
                showInlineError
                isRequired
              />

              {data && data.getRubricsTree && (
                <InputLine label={'Рубрики'} labelTag={'div'} name={'rubrics'} isRequired low>
                  <RubricsTree
                    low
                    isLastDisabled
                    tree={data.getRubricsTree}
                    titleLeft={(id, testId) => (
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

              {showFeatures && <ProductAttributes rubrics={rubrics} />}

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
