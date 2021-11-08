import Accordion from 'components/Accordion';
import Button from 'components/button/Button';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { DEFAULT_CITY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { ProductCardContentModel } from 'db/dbModels';
import { ProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateProductCardContentInput,
  useUpdateProductCardContentMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { get } from 'lodash';
import * as React from 'react';

interface ConsoleRubricProductConstructorInterface {
  product: ProductInterface;
  cardContent: ProductCardContentModel;
}

const ConsoleRubricProductConstructor: React.FC<ConsoleRubricProductConstructorInterface> = ({
  product,
  cardContent,
}) => {
  const { cities } = useConfigContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCardContentMutation] = useUpdateProductCardContentMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCardContent),
    onError: onErrorCallback,
  });

  const initialValues: UpdateProductCardContentInput = cardContent;

  return (
    <Inner testId={'product-card-constructor'}>
      <Formik<UpdateProductCardContentInput>
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          updateProductCardContentMutation({
            variables: {
              input: values,
            },
          }).catch(console.log);
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              {cities.map(({ name, slug }) => {
                const cityTestId = `${product.slug}-${slug}`;
                const fieldName = `content.${slug}`;
                const fieldValue = get(values, fieldName);
                const constructorValue = getConstructorDefaultValue(fieldValue);

                return (
                  <Accordion
                    isOpen={slug === DEFAULT_CITY}
                    testId={cityTestId}
                    title={`${name}`}
                    key={slug}
                  >
                    <div className='ml-8 pt-[var(--lineGap-200)]'>
                      <PageEditor
                        value={constructorValue}
                        setValue={(value) => {
                          setFieldValue(fieldName, JSON.stringify(value));
                        }}
                        imageUpload={async (file) => {
                          try {
                            const formData = new FormData();
                            formData.append('assets', file);
                            formData.append('productId', `${product._id}`);
                            formData.append('productCardContentId', `${cardContent._id}`);

                            const responseFetch = await fetch(
                              '/api/product/add-card-content-asset',
                              {
                                method: 'POST',
                                body: formData,
                              },
                            );
                            const responseJson = await responseFetch.json();

                            return {
                              url: responseJson.url,
                            };
                          } catch (e) {
                            console.log(e);
                            return {
                              url: '',
                            };
                          }
                        }}
                      />
                    </div>
                  </Accordion>
                );
              })}
              <div className='flex mb-12 mt-4'>
                <Button
                  theme={'secondary'}
                  size={'small'}
                  type={'submit'}
                  testId={`card-content-submit`}
                >
                  Сохранить
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default ConsoleRubricProductConstructor;
