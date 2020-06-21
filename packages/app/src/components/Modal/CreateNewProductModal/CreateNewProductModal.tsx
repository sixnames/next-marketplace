import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import {
  CreateProductInput,
  CreateProductMutation,
  useCreateProductMutation,
  useGetRubricsTreeQuery,
} from '../../../generated/apolloComponents';
import useMutationCallbacks from '../../../hooks/mutations/useMutationCallbacks';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikTextarea from '../../FormElements/Textarea/FormikTextarea';
import FormikDropZone from '../../FormElements/Upload/FormikDropZone';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import RubricsTree from '../../../routes/Rubrics/RubricsTree';
import FormikArrayCheckbox from '../../FormElements/Checkbox/FormikArrayCheckbox';
import InputLine from '../../FormElements/Input/InputLine';
import ProductAttributes from './ProductAttributes';
import { MutationUpdaterFn, PureQueryOptions, RefetchQueriesFunction } from '@apollo/client';
import classes from './CreateNewProductModal.module.css';
import { createProductSchema, minPrice } from '@rg/validation';

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
  const { data, loading, error } = useGetRubricsTreeQuery({
    skip: Boolean(rubricId),
    fetchPolicy: 'network-only',
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
    name: [{ key: 'ru', value: '' }],
    cardName: [{ key: 'ru', value: '' }],
    price: 0,
    description: [{ key: 'ru', value: '' }],
    assets: [],
    rubrics: rubricId ? [rubricId] : [],
    attributesSource: '',
    attributesGroups: [],
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik
        validationSchema={createProductSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          return createProductMutation({
            variables: {
              input: {
                name: values.name,
                cardName: values.cardName,
                description: values.description,
                price: values.price,
                assets: values.assets,
                rubrics: values.rubrics || [],
                attributesSource: `${values.attributesSource}`,
                attributesGroups: values.attributesGroups,
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

              {values.name.map((_, index) => {
                return (
                  <FormikInput
                    isRequired
                    key={index}
                    label={'Имя'}
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
                    label={'Имя страницы товара'}
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
                min={minPrice}
                showInlineError
              />

              {values.cardName.map((_, index) => {
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

              {!rubricId && data && data.getRubricsTree && (
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

              {showFeatures && <ProductAttributes />}

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
