import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import { useGetRubricsTreeQuery } from '../../../generated/apolloComponents';
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

  const initialValues = {
    name: null,
    cardName: null,
    price: null,
    description: null,
    images: [],
    rubrics: rubricId ? [rubricId] : [],
    attributesSource: null,
    attributesGroups: [],
  };

  return (
    <ModalFrame testId={'create-new-product-modal'}>
      <ModalTitle>Создание товара</ModalTitle>
      <Formik
        // validationSchema={newProductSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          createProductMutation({
            variables: {
              input: {
                name: values.name || '',
                cardName: values.cardName || '',
                description: values.description || '',
                price: values.price || 0,
                images: values.images || [],
                rubrics: values.rubrics || [],
                attributesSource: `${values.attributesSource}`,
                attributesGroups: values.attributesGroups.map(
                  (attributesGroup: ProductAttributesGroupInterface) => ({
                    ...attributesGroup,
                    attributes: attributesGroup.attributes.map((attribute) => {
                      const slug = Object.keys(attribute.value)[0];

                      return {
                        ...attribute,
                        value: {
                          [`${slug}`]: attribute.value[slug].map((value: any) => `${value}`),
                        },
                      };
                    }),
                  }),
                ),
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
                name={'images'}
                testId={'product-images'}
                isRequired
                showInlineError
              />

              <FormikInput
                isRequired
                label={'Имя'}
                name={'name'}
                testId={'product-name'}
                showInlineError
              />

              <FormikInput
                isRequired
                label={'Имя страницы товара'}
                name={'cardName'}
                testId={'product-card-name'}
                showInlineError
              />

              <FormikInput
                isRequired
                label={'Цена'}
                name={'price'}
                testId={'product-price'}
                type={'number'}
                min={minPrice}
                showInlineError
              />

              <FormikTextarea
                isRequired
                label={'Описание'}
                name={'description'}
                testId={'product-description'}
                showInlineError
              />

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
