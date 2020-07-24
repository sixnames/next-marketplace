import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import {
  CreateProductInput,
  CreateProductMutation,
  useCreateProductMutation,
  useGetRubricsTreeQuery,
} from '../../../generated/apolloComponents';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikDropZone from '../../FormElements/Upload/FormikDropZone';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import RubricsTree from '../../../routes/Rubrics/RubricsTree';
import FormikArrayCheckbox from '../../FormElements/Checkbox/FormikArrayCheckbox';
import InputLine from '../../FormElements/Input/InputLine';
import ProductAttributes from './ProductAttributes';
import { MutationUpdaterFn, PureQueryOptions } from 'apollo-client';
import { RefetchQueriesFunction } from '@apollo/react-common';
import classes from './CreateNewProductModal.module.css';
import { createProductSchema } from '../../../validation';
import { useLanguageContext } from '../../../context/languageContext';
import FormikTranslationsInput from '../../FormElements/Input/FormikTranslationsInput';

export interface CreateNewProductModalInterface {
  rubricId?: string;
  update?: MutationUpdaterFn<CreateProductMutation>;
  refetchQueries?: (string | PureQueryOptions)[] | RefetchQueriesFunction;
}

const CreateNewProductModal: React.FC<CreateNewProductModalInterface> = ({
  rubricId,
  update,
  refetchQueries,
}) => {
  const {
    getLanguageFieldInitialValue,
    getLanguageFieldInputValue,
    defaultLang,
  } = useLanguageContext();
  const { data, loading, error } = useGetRubricsTreeQuery({
    skip: Boolean(rubricId),
    fetchPolicy: 'network-only',
    variables: {
      counters: {},
    },
  });

  const { onErrorCallback, onCompleteCallback, hideModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const [createProductMutation] = useCreateProductMutation({
    awaitRefetchQueries: true,
    refetchQueries,
    update,
    onCompleted: (data) => onCompleteCallback(data.createProduct),
    onError: onErrorCallback,
  });

  if (loading && !rubricId) return <Spinner />;
  if ((error || !data || !data.getRubricsTree) && !rubricId) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const initialValues: CreateProductInput = {
    name: getLanguageFieldInitialValue(),
    cardName: getLanguageFieldInitialValue(),
    price: 0,
    description: getLanguageFieldInitialValue(),
    assets: [],
    rubrics: rubricId ? [rubricId] : [],
    attributesGroups: [],
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik
        validationSchema={() => createProductSchema(defaultLang)}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return createProductMutation({
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

              {!rubricId && data && data.getRubricsTree && (
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

              <ModalButtons>
                <Button type={'submit'} testId={'submit-new-product'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal} testId={'product-decline'}>
                  Отмена
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateNewProductModal;
