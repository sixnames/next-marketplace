import { useAppContext } from 'components/context/appContext';
import { EventSummaryInterface, OptionInterface, ProductAttributeInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  useUpdateEventNumberAttribute,
  useUpdateEventSelectAttribute,
  useUpdateEventTextAttribute,
} from 'hooks/mutations/useEventMutations';
import { alwaysString } from 'lib/arrayUtils';
import { ATTRIBUTE_OPTIONS_MODAL } from 'lib/config/modalVariants';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FakeInput from '../FormElements/Input/FakeInput';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import Inner from '../Inner';
import { AttributeOptionsModalInterface } from '../Modal/AttributeOptionsModal';
import { OptionsModalOptionInterface } from '../Modal/OptionsModal';

function castSelectedOptions(option: OptionInterface): OptionsModalOptionInterface {
  return {
    _id: option._id,
    slug: option.slug,
    name: `${option.name}`,
    options: (option.options || []).map(castSelectedOptions),
  };
}

const selectsListClassName = 'grid sm:grid-cols-2 md:grid-cols-3 gap-x-8';

interface EventAttributesInterface {
  event: EventSummaryInterface;
}

const EventAttributes: React.FC<EventAttributesInterface> = ({ event }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const { attributesGroups } = event;

  const [updateEventSelectAttributeMutation] = useUpdateEventSelectAttribute();
  const [updateEventNumberAttributeMutation] = useUpdateEventNumberAttribute();
  const [updateEventTextAttributeMutation] = useUpdateEventTextAttribute();

  const clearSelectFieldHandler = React.useCallback(
    (eventAttribute: ProductAttributeInterface) => {
      if (eventAttribute.attribute?.optionsGroupId) {
        updateEventSelectAttributeMutation({
          taskId: alwaysString(router.query.taskId),
          eventId: `${event._id}`,
          attributeId: `${eventAttribute.attributeId}`,
          productAttributeId: `${eventAttribute._id}`,
          selectedOptionsIds: [],
        }).catch(console.log);
      }
    },
    [event._id, router.query.taskId, updateEventSelectAttributeMutation],
  );

  return (
    <Inner testId={'event-attributes-list'}>
      {(attributesGroups || []).map((attributesGroup) => {
        const {
          stringAttributesAST,
          numberAttributesAST,
          selectAttributesAST,
          multipleSelectAttributesAST,
        } = attributesGroup;

        if (
          (stringAttributesAST || []).length < 1 &&
          (numberAttributesAST || []).length < 1 &&
          (selectAttributesAST || []).length < 1 &&
          (multipleSelectAttributesAST || []).length < 1
        ) {
          return null;
        }
        return (
          <div className='relative mb-16' key={`${attributesGroup._id}`}>
            <div className='mb-4 text-xl font-medium'>{attributesGroup.name}</div>
            {selectAttributesAST && selectAttributesAST.length > 0 ? (
              <div>
                <div className={selectsListClassName}>
                  {(selectAttributesAST || []).map((eventAttribute) => {
                    const { attribute, readableValue } = eventAttribute;
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
                          readableValue ? () => clearSelectFieldHandler(eventAttribute) : undefined
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
                                  updateEventSelectAttributeMutation({
                                    taskId: alwaysString(router.query.taskId),
                                    eventId: `${event._id}`,
                                    attributeId: `${attribute._id}`,
                                    productAttributeId: `${eventAttribute._id}`,
                                    selectedOptionsIds: value.map(({ _id }) => `${_id}`),
                                  }).catch(console.log);
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
                  {(multipleSelectAttributesAST || []).map((eventAttribute) => {
                    const { attribute } = eventAttribute;
                    if (!attribute) {
                      return null;
                    }
                    return (
                      <FakeInput
                        value={`${eventAttribute.readableValue || ''}`}
                        label={`${attribute.name}`}
                        key={`${eventAttribute.attributeId}`}
                        testId={`${attribute.name}-attribute`}
                        onClear={
                          eventAttribute.readableValue
                            ? () => clearSelectFieldHandler(eventAttribute)
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
                                  updateEventSelectAttributeMutation({
                                    taskId: alwaysString(router.query.taskId),
                                    eventId: `${event._id}`,
                                    attributeId: `${eventAttribute.attributeId}`,
                                    productAttributeId: `${eventAttribute._id}`,
                                    selectedOptionsIds: value.map(({ _id }) => `${_id}`),
                                  }).catch(console.log);
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
                  updateEventNumberAttributeMutation({
                    taskId: alwaysString(router.query.taskId),
                    eventId: `${event._id}`,
                    attributes: (values.attributes || []).map((attribute) => {
                      return {
                        attributeId: `${attribute.attributeId}`,
                        productAttributeId: `${attribute._id}`,
                        number:
                          attribute.number && `${attribute.number}`.length > 0
                            ? noNaN(attribute.number)
                            : null,
                      };
                    }),
                  }).catch(console.log);
                }}
              >
                {() => {
                  return (
                    <Form>
                      <div>
                        <div className='relative'>
                          <div className={selectsListClassName}>
                            {(numberAttributesAST || []).map((eventAttribute, index) => {
                              const { attribute } = eventAttribute;
                              if (!attribute) {
                                return null;
                              }
                              return (
                                <FormikInput
                                  type={'number'}
                                  label={`${attribute.name}`}
                                  name={`attributes[${index}].number`}
                                  key={`${eventAttribute.attributeId}`}
                                  testId={`${attribute.name}-attribute`}
                                />
                              );
                            })}
                          </div>

                          <FixedButtons lowTop>
                            <WpButton
                              testId={'submit-number-attributes'}
                              size={'small'}
                              type={'submit'}
                            >
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
                  updateEventTextAttributeMutation({
                    taskId: alwaysString(router.query.taskId),
                    eventId: `${event._id}`,
                    attributes: (values.attributes || []).map((attribute) => {
                      return {
                        attributeId: `${attribute.attributeId}`,
                        productAttributeId: `${attribute._id}`,
                        textI18n: attribute.textI18n || null,
                      };
                    }),
                  }).catch(console.log);
                }}
              >
                {() => {
                  return (
                    <Form>
                      <div>
                        <div className='relative'>
                          {(stringAttributesAST || []).map((eventAttribute, index) => {
                            const { attribute } = eventAttribute;
                            if (!attribute) {
                              return null;
                            }
                            return (
                              <FormikTranslationsInput
                                variant={'textarea'}
                                className='h-[15rem]'
                                label={`${attribute.name}`}
                                name={`attributes[${index}].textI18n`}
                                key={`${eventAttribute.attributeId}`}
                                testId={`${attribute.name}-attribute`}
                              />
                            );
                          })}

                          <FixedButtons lowTop>
                            <WpButton
                              testId={'submit-text-attributes'}
                              size={'small'}
                              type={'submit'}
                            >
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

export default EventAttributes;
