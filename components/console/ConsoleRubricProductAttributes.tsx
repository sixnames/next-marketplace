import WpButton from 'components/button/WpButton';
import FixedButtons from 'components/button/FixedButtons';
import FakeInput from 'components/FormElements/Input/FakeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import { AttributeOptionsModalInterface } from 'components/Modal/AttributeOptionsModal';
import { OptionsModalOptionInterface } from 'components/Modal/OptionsModal';
import { ATTRIBUTE_OPTIONS_MODAL } from 'config/modalVariants';
import { OptionInterface, ProductAttributeInterface, ProductInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useUpdateProductNumberAttributeMutation,
  useUpdateProductSelectAttributeMutation,
  useUpdateProductTextAttributeMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

function castSelectedOptions(option: OptionInterface): OptionsModalOptionInterface {
  return {
    _id: option._id,
    slug: option.slug,
    name: `${option.name}`,
    options: (option.options || []).map(castSelectedOptions),
  };
}

const attributesGroupClassName = 'relative mb-16';
const attributesGroupTitleClassName = 'mb-4 font-medium text-xl';
const selectsListClassName = 'grid sm:grid-cols-2 md:grid-cols-3 gap-x-8';

interface ConsoleRubricProductAttributesInterface {
  product: ProductInterface;
}

const ConsoleRubricProductAttributes: React.FC<ConsoleRubricProductAttributesInterface> = ({
  product,
}) => {
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    // withModal: true,
    reload: true,
  });
  const { attributesGroups } = product;

  const [updateProductSelectAttributeMutation] = useUpdateProductSelectAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductSelectAttribute),
  });

  const [updateProductNumberAttributeMutation] = useUpdateProductNumberAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductNumberAttribute),
  });

  const [updateProductTextAttributeMutation] = useUpdateProductTextAttributeMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductTextAttribute),
  });

  const clearSelectFieldHandler = React.useCallback(
    (productAttribute: ProductAttributeInterface) => {
      if (productAttribute.attribute?.optionsGroupId) {
        showLoading();
        updateProductSelectAttributeMutation({
          variables: {
            input: {
              productId: product._id,
              attributeId: productAttribute.attributeId,
              productAttributeId: productAttribute._id,
              selectedOptionsIds: [],
            },
          },
        }).catch((e) => console.log(e));
      }
    },
    [product._id, showLoading, updateProductSelectAttributeMutation],
  );

  return (
    <Inner testId={'product-attributes-list'}>
      {(attributesGroups || []).map((attributesGroup) => {
        const {
          stringAttributesAST,
          numberAttributesAST,
          selectAttributesAST,
          multipleSelectAttributesAST,
        } = attributesGroup;
        return (
          <div className={attributesGroupClassName} key={`${attributesGroup._id}`}>
            <div className={attributesGroupTitleClassName}>{attributesGroup.name}</div>
            {selectAttributesAST && selectAttributesAST.length > 0 ? (
              <div>
                <div className={selectsListClassName}>
                  {(selectAttributesAST || []).map((productAttribute) => {
                    const { attribute, readableValue } = productAttribute;
                    if (!attribute) {
                      return null;
                    }
                    return (
                      <FakeInput
                        value={`${readableValue || ''}`}
                        label={`${attribute.name}`}
                        key={`${attribute._id}`}
                        testId={`${attribute.name}-attribute`}
                        onClear={
                          readableValue
                            ? () => clearSelectFieldHandler(productAttribute)
                            : undefined
                        }
                        onClick={() => {
                          if (attribute.optionsGroupId) {
                            showModal<AttributeOptionsModalInterface>({
                              variant: ATTRIBUTE_OPTIONS_MODAL,
                              props: {
                                testId: 'select-attribute-options-modal',
                                optionsGroupId: `${attribute.optionsGroupId}`,
                                optionVariant: 'radio',
                                title: `${attribute.name}`,
                                notShowAsAlphabet: attribute.notShowAsAlphabet,
                                initiallySelectedOptions: (attribute.options || []).map(
                                  castSelectedOptions,
                                ),
                                onSubmit: (value) => {
                                  showLoading();
                                  updateProductSelectAttributeMutation({
                                    variables: {
                                      input: {
                                        productId: product._id,
                                        attributeId: attribute._id,
                                        productAttributeId: productAttribute._id,
                                        selectedOptionsIds: value.map(({ _id }) => _id),
                                      },
                                    },
                                  }).catch((e) => console.log(e));
                                },
                              },
                            });
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {multipleSelectAttributesAST && multipleSelectAttributesAST.length > 0 ? (
              <div>
                <div className={selectsListClassName}>
                  {(multipleSelectAttributesAST || []).map((productAttribute) => {
                    const { attribute } = productAttribute;
                    if (!attribute) {
                      return null;
                    }
                    return (
                      <FakeInput
                        value={`${productAttribute.readableValue || ''}`}
                        label={`${attribute.name}`}
                        key={`${productAttribute.attributeId}`}
                        testId={`${attribute.name}-attribute`}
                        onClear={
                          productAttribute.readableValue
                            ? () => clearSelectFieldHandler(productAttribute)
                            : undefined
                        }
                        onClick={() => {
                          if (attribute.optionsGroupId) {
                            showModal<AttributeOptionsModalInterface>({
                              variant: ATTRIBUTE_OPTIONS_MODAL,
                              props: {
                                testId: 'multi-select-attribute-options-modal',
                                optionsGroupId: `${attribute.optionsGroupId}`,
                                title: `${attribute.name}`,
                                notShowAsAlphabet: attribute.notShowAsAlphabet,
                                initiallySelectedOptions: (attribute.options || []).map(
                                  castSelectedOptions,
                                ),
                                onSubmit: (value) => {
                                  showLoading();
                                  updateProductSelectAttributeMutation({
                                    variables: {
                                      input: {
                                        productId: product._id,
                                        attributeId: productAttribute.attributeId,
                                        productAttributeId: productAttribute._id,
                                        selectedOptionsIds: value.map(({ _id }) => _id),
                                      },
                                    },
                                  }).catch((e) => console.log(e));
                                },
                              },
                            });
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {numberAttributesAST && numberAttributesAST.length > 0 ? (
              <Formik
                initialValues={{ attributes: numberAttributesAST }}
                onSubmit={(values) => {
                  showLoading();
                  updateProductNumberAttributeMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        attributes: (values.attributes || []).map((attribute) => {
                          return {
                            attributeId: attribute.attributeId,
                            productAttributeId: attribute._id,
                            number:
                              attribute.number && `${attribute.number}`.length > 0
                                ? noNaN(attribute.number)
                                : null,
                          };
                        }),
                      },
                    },
                  }).catch((e) => console.log(e));
                }}
              >
                {() => {
                  return (
                    <Form>
                      <div>
                        <div className='relative'>
                          <div className={selectsListClassName}>
                            {(numberAttributesAST || []).map((productAttribute, index) => {
                              const { attribute } = productAttribute;
                              if (!attribute) {
                                return null;
                              }
                              return (
                                <FormikInput
                                  type={'number'}
                                  label={`${attribute.name}`}
                                  name={`attributes[${index}].number`}
                                  key={`${productAttribute.attributeId}`}
                                  testId={`${attribute.name}-attribute`}
                                />
                              );
                            })}
                          </div>

                          <FixedButtons>
                            <WpButton testId={'submit-number-attributes'} type={'submit'}>
                              Сохранить
                            </WpButton>
                          </FixedButtons>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            ) : null}

            {stringAttributesAST && stringAttributesAST.length > 0 ? (
              <Formik
                initialValues={{ attributes: stringAttributesAST }}
                onSubmit={(values) => {
                  showLoading();
                  updateProductTextAttributeMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        attributes: (values.attributes || []).map((attribute) => {
                          return {
                            attributeId: attribute.attributeId,
                            productAttributeId: attribute._id,
                            textI18n: attribute.textI18n || null,
                          };
                        }),
                      },
                    },
                  }).catch((e) => console.log(e));
                }}
              >
                {() => {
                  return (
                    <Form>
                      <div>
                        <div className='relative'>
                          {(stringAttributesAST || []).map((productAttribute, index) => {
                            const { attribute } = productAttribute;
                            if (!attribute) {
                              return null;
                            }
                            return (
                              <FormikTranslationsInput
                                variant={'textarea'}
                                className='h-[15rem]'
                                label={`${attribute.name}`}
                                name={`attributes[${index}].textI18n`}
                                key={`${productAttribute.attributeId}`}
                                testId={`${attribute.name}-attribute`}
                              />
                            );
                          })}

                          <FixedButtons>
                            <WpButton testId={'submit-text-attributes'} type={'submit'}>
                              Сохранить
                            </WpButton>
                          </FixedButtons>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            ) : null}
          </div>
        );
      })}
    </Inner>
  );
};

export default ConsoleRubricProductAttributes;
