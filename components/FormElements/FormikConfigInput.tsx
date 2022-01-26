import { Form, Formik, useField, useFormikContext } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import {
  CONFIG_VARIANT_ADDRESS,
  CONFIG_VARIANT_BOOLEAN,
  CONFIG_VARIANT_CATEGORIES_TREE,
  CONFIG_VARIANT_CONSTRUCTOR,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_RUBRICS,
  CONFIG_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  GEO_POINT_TYPE,
} from '../../config/common';
import { CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { useLocaleContext } from '../../context/localeContext';
import { AddressModel, ConfigModel, JSONObjectModel, TranslationModel } from '../../db/dbModels';
import { CategoryInterface, RubricInterface } from '../../db/uiInterfaces';
import {
  useUpdateConfigMutation,
  useUpdateRubricNavItemConfigMutation,
  useUpdateVisibleCategoriesInNavDropdownMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { getReadableAddress } from '../../lib/addressUtils';
import { alwaysArray } from '../../lib/arrayUtils';
import { getConstructorDefaultValue } from '../../lib/constructorUtils';
import { GeocodeResultInterface } from '../../lib/geocode';
import { noNaN } from '../../lib/numbers';
import { InputType } from '../../types/clientTypes';
import { updateConfigSchema } from '../../validation/configSchema';
import ButtonCross from '../button/ButtonCross';
import WpButton from '../button/WpButton';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import PageEditor from '../PageEditor';
import WpAccordion from '../WpAccordion';
import WpIcon from '../WpIcon';
import WpTooltip from '../WpTooltip';
import FormikCheckboxLine from './Checkbox/FormikCheckboxLine';
import WpCheckbox from './Checkbox/WpCheckbox';
import FormikAddressInput from './Input/FormikAddressInput';
import FormikInput, { FormikInputPropsInterface } from './Input/FormikInput';
import InputLine from './Input/InputLine';

interface ConfigInputInterface extends FormikInputPropsInterface {
  onRemoveHandler?: (values: any) => void;
  multi?: boolean;
  variant: string;
}

const ConfigInput: React.FC<ConfigInputInterface> = ({ name, multi, variant, testId, type }) => {
  const { showModal } = useAppContext();
  const [field, meta, { setValue }] = useField(name);

  function addFieldHandler() {
    setValue([...meta.value, '']);
  }

  function removeFieldHandler(removeIndex: number) {
    showModal<ConfirmModalInterface>({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'remove-field-modal',
        message: (
          <React.Fragment>
            Вы уверены, что хотите удалить поле настройки? Удаление будет сохранено только после
            нажатия кнопки <span>Сохранить</span>
          </React.Fragment>
        ),
        confirm: () => {
          const newValue = (meta.value || []).filter(
            (_: string, fieldIndex: number) => fieldIndex !== removeIndex,
          );
          setValue(newValue);
        },
      },
    });
  }

  const inputFullWithStyles = {
    width: '100%',
  } as React.CSSProperties;

  const inputWithStyles = {
    width: 'calc(100% - 50px)',
  } as React.CSSProperties;

  return (
    <div className='mb-[var(--lineGap-200)]'>
      {(field.value || ['']).map((_: any, index: number) => {
        const isFirst = index === 0;
        const fieldName = `${name}[${index}]`;
        const fieldTestId = `${testId}-${index}`;

        return (
          <div key={index}>
            {variant === 'boolean' ? (
              <React.Fragment>
                <FormikCheckboxLine label={'Показывать'} name={fieldName} testId={fieldTestId} />
              </React.Fragment>
            ) : (
              <div className={`flex items-center justify-center ${multi ? 'mb-8' : ''}`}>
                <div style={multi ? inputWithStyles : inputFullWithStyles}>
                  <FormikInput name={fieldName} testId={fieldTestId} type={type} low />
                </div>

                {multi ? (
                  <div className='flex w-[50px] flex-shrink-0 items-center justify-center'>
                    {isFirst ? (
                      <div />
                    ) : (
                      <ButtonCross
                        testId={`${fieldTestId}-remove`}
                        onClick={() => removeFieldHandler(index)}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        );
      })}

      {multi ? (
        <WpButton
          frameClassName={'w-auto'}
          onClick={addFieldHandler}
          size={'small'}
          theme={'gray'}
          testId={`${name}-add`}
        >
          Добавить
        </WpButton>
      ) : null}
    </div>
  );
};

interface ConfigTranslationInputInterface extends FormikInputPropsInterface {
  multi?: boolean;
  variant: string;
}

const ConfigTranslationInput: React.FC<ConfigTranslationInputInterface> = ({
  name: inputName,
  testId,
  ...props
}) => {
  const { dbLocales, defaultLocale } = useLocaleContext();
  const { values } = useFormikContext();
  const currentField: TranslationModel = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (dbLocales.length < minimalLanguagesCount) {
    return (
      <ConfigInput
        {...props}
        name={`${inputName}.${defaultLocale}`}
        testId={`${testId}-${defaultLocale}`}
      />
    );
  }

  return (
    <InputLine name={inputName} labelTag={'div'} labelClass='mt-3'>
      {dbLocales.map((localeSlug, index) => {
        const value: string | undefined = currentField[localeSlug];
        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty
          ? 'fill-current text-green-700'
          : 'fill-current text-red-700';
        const name = `${inputName}.${localeSlug}`;
        const isNotLast = index !== dbLocales.length - 1;

        return (
          <div className={isNotLast ? 'mb-6' : ''} key={name}>
            <WpAccordion
              testId={`${testId}-accordion-${localeSlug}`}
              isOpen={localeSlug === defaultLocale}
              title={localeSlug}
              titleRight={
                <WpTooltip title={accordionIconTooltip}>
                  <div>
                    <WpIcon className={`h-4 w-4 ${accordionIconClass}`} name={accordionIcon} />
                  </div>
                </WpTooltip>
              }
              key={`${inputName}-${localeSlug}`}
            >
              <div className='mt-3 mb-6'>
                <ConfigInput {...props} name={name} testId={`${testId}-${localeSlug}`} />
              </div>
            </WpAccordion>
          </div>
        );
      })}
    </InputLine>
  );
};

interface RenderCategoriesInterface {
  category: CategoryInterface;
  rubricId: string;
  citySlug: string;
  isParentSelected: boolean;
}

interface InitialValues {
  configId: string;
  cities: JSONObjectModel;
}

interface FormikConfigInputInterface {
  config: ConfigModel;
  rubrics?: RubricInterface[];
}

const FormikConfigInput: React.FC<FormikConfigInputInterface> = ({ config, rubrics }) => {
  const { cities } = useConfigContext();
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateConfigMutation] = useUpdateConfigMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateConfig),
  });
  const notAssetSchema = useValidationSchema({
    schema: updateConfigSchema,
  });
  const { slug: configSlug, name, cities: configCities, _id, multi, description, variant } = config;
  const initialType = variant === CONFIG_VARIANT_STRING ? 'text' : variant;
  const type = initialType as InputType;
  const isConstructor = variant === CONFIG_VARIANT_CONSTRUCTOR;
  const isBoolean = variant === CONFIG_VARIANT_BOOLEAN;
  const isAddress = variant === CONFIG_VARIANT_ADDRESS;
  const isNumber = variant === CONFIG_VARIANT_NUMBER;
  const isCategoriesTree = variant === CONFIG_VARIANT_CATEGORIES_TREE;
  const isRubrics = variant === CONFIG_VARIANT_RUBRICS;

  const initialCities = Object.keys(configCities).reduce((acc: JSONObjectModel, cityKey) => {
    const cityLocales = configCities[cityKey] as JSONObjectModel | undefined;
    if (!cityLocales) {
      return acc;
    }
    acc[cityKey] = Object.keys(cityLocales).reduce((localesAcc: JSONObjectModel, localeKey) => {
      const locale = cityLocales[localeKey] as string[];
      if (!locale) {
        return localesAcc;
      }

      if (isNumber) {
        localesAcc[localeKey] = locale.map((value) => noNaN(value));
        return localesAcc;
      }

      if (isBoolean) {
        localesAcc[localeKey] = locale.map((value) => value === 'true');
        return localesAcc;
      }

      if (isAddress) {
        const value = locale[0];
        if (!value) {
          localesAcc[localeKey] = [];
          return localesAcc;
        }

        const parsedValue = JSON.parse(value) as AddressModel;
        if (!parsedValue?.formattedAddress || !parsedValue?.point) {
          localesAcc[localeKey] = [];
          return localesAcc;
        }

        const geocodeResult: GeocodeResultInterface = {
          formattedAddress: parsedValue.formattedAddress,
          point: {
            lat: parsedValue.point.coordinates[1],
            lng: parsedValue.point.coordinates[0],
          },
          addressComponents: parsedValue.addressComponents.map((component) => {
            return {
              shortName: component.shortName,
              longName: component.longName,
              types: component.types,
            };
          }),
        };
        localesAcc[localeKey] = [geocodeResult];
        return localesAcc;
      }

      localesAcc[localeKey] = locale;
      return localesAcc;
    }, {});

    return acc;
  }, {});

  const initialValues: InitialValues = { configId: `${_id}`, cities: initialCities };

  const updateConfigMutationHandler = React.useCallback(
    (values: InitialValues) => {
      updateConfigMutation({
        variables: {
          input: {
            _id: config._id,
            slug: config.slug,
            companySlug: config.companySlug,
            description: config.description,
            variant: config.variant as any,
            acceptedFormats: config.acceptedFormats,
            group: config.group,
            multi: config.multi,
            name: config.name,
            cities: Object.keys(values.cities).reduce((cityAcc: Record<string, any>, cityKey) => {
              const city = values.cities[cityKey];
              if (!city) {
                return cityAcc;
              }

              cityAcc[cityKey] = Object.keys(city).reduce(
                (localeAcc: Record<string, any>, localeKey) => {
                  const localeValueArray = city[localeKey];
                  if (!localeValueArray) {
                    localeAcc[localeKey] = [''];
                    return localeAcc;
                  }

                  const localeValue = alwaysArray(localeValueArray).map((value) => {
                    if (isBoolean) {
                      if (!value) {
                        return 'false';
                      }
                      return `${value}`;
                    }

                    if (isAddress) {
                      if (!value) {
                        return '{}';
                      }
                      const initialValue = value as GeocodeResultInterface;
                      const finalValue: AddressModel = {
                        formattedAddress: initialValue.formattedAddress,
                        readableAddress: getReadableAddress(initialValue.addressComponents),
                        mapCoordinates: {
                          lat: initialValue.point.lat,
                          lng: initialValue.point.lng,
                        },
                        point: {
                          type: GEO_POINT_TYPE,
                          coordinates: [initialValue.point.lng, initialValue.point.lat],
                        },
                        addressComponents: initialValue.addressComponents.map((component) => {
                          return {
                            shortName: component.shortName,
                            longName: component.longName,
                            types: component.types,
                          };
                        }),
                      };
                      return JSON.stringify(finalValue);
                    }

                    return `${value}`;
                  });
                  localeAcc[localeKey] = localeValue;
                  return localeAcc;
                },
                {},
              );

              return cityAcc;
            }, {}),
          },
        },
      }).catch((e) => console.log(e));
    },
    [
      config._id,
      config.acceptedFormats,
      config.companySlug,
      config.description,
      config.group,
      config.multi,
      config.name,
      config.slug,
      config.variant,
      isAddress,
      isBoolean,
      updateConfigMutation,
    ],
  );

  const [updateVisibleCategoriesInNavDropdownMutation] =
    useUpdateVisibleCategoriesInNavDropdownMutation({
      onCompleted: (data) => onCompleteCallback(data.updateVisibleCategoriesInNavDropdown),
      onError: onErrorCallback,
    });

  const [updateRubricNavItemConfigMutation] = useUpdateRubricNavItemConfigMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRubricNavItemConfig),
    onError: onErrorCallback,
  });

  const renderCategories = React.useCallback(
    ({ category, rubricId, citySlug, isParentSelected }: RenderCategoriesInterface) => {
      const { name, categories } = category;
      const configValue = alwaysArray(get(config.cities, `${citySlug}.${DEFAULT_LOCALE}`));
      const categoryValue = `${rubricId}${FILTER_SEPARATOR}${category._id}`;
      const isSelected = configValue.includes(categoryValue);

      return (
        <div>
          <div className='cms-option flex items-center gap-4'>
            <div>
              <WpCheckbox
                disabled={!isParentSelected}
                testId={`${category.name}`}
                checked={isSelected}
                value={category._id}
                name={`${category._id}`}
                onChange={() => {
                  showLoading();
                  updateVisibleCategoriesInNavDropdownMutation({
                    variables: {
                      input: {
                        _id: config._id,
                        slug: config.slug,
                        companySlug: config.companySlug,
                        description: config.description,
                        variant: config.variant as any,
                        acceptedFormats: config.acceptedFormats,
                        group: config.group,
                        multi: config.multi,
                        name: config.name,
                        cities: config.cities,
                        categoryId: category._id,
                        citySlug,
                        rubricId,
                      },
                    },
                  }).catch(console.log);
                }}
              />
            </div>
            <div className='font-medium' data-cy={`category-${name}`}>
              {name}
            </div>
          </div>
          {categories && categories.length > 0 ? (
            <div className='ml-4'>
              {categories.map((category) => (
                <div className='mt-4' key={`${category._id}`}>
                  {renderCategories({
                    category,
                    rubricId,
                    citySlug,
                    isParentSelected: isSelected,
                  })}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    [
      config._id,
      config.acceptedFormats,
      config.cities,
      config.companySlug,
      config.description,
      config.group,
      config.multi,
      config.name,
      config.slug,
      config.variant,
      showLoading,
      updateVisibleCategoriesInNavDropdownMutation,
    ],
  );

  if (isRubrics) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='mb-3 flex min-h-[1.3rem] items-start overflow-ellipsis whitespace-nowrap font-medium text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <WpTooltip title={description}>
                <div className='ml-3 inline-block cursor-pointer'>
                  <WpIcon className='h-5 w-5' name={'question-circle'} />
                </div>
              </WpTooltip>
            </React.Fragment>
          ) : null}
        </div>
        {cities.map(({ name, slug }) => {
          const cityTestId = `${configSlug}-${slug}`;
          return (
            <WpAccordion
              isOpen={slug === DEFAULT_CITY}
              testId={cityTestId}
              title={`${name}`}
              key={slug}
            >
              <div className='ml-8 grid gap-4 py-[var(--lineGap-200)]'>
                {(rubrics || []).map((rubric) => {
                  const configValue = alwaysArray(get(config.cities, `${slug}.${DEFAULT_LOCALE}`));
                  const categoryValue = `${rubric._id}`;
                  const isSelected = configValue.includes(categoryValue);

                  return (
                    <div className='cms-option flex items-center gap-4' key={`${rubric._id}`}>
                      <div>
                        <WpCheckbox
                          testId={`${rubric.name}`}
                          checked={isSelected}
                          value={rubric._id}
                          name={`${rubric._id}`}
                          onChange={() => {
                            showLoading();
                            updateRubricNavItemConfigMutation({
                              variables: {
                                input: {
                                  _id: config._id,
                                  slug: config.slug,
                                  companySlug: config.companySlug,
                                  description: config.description,
                                  variant: config.variant as any,
                                  acceptedFormats: config.acceptedFormats,
                                  group: config.group,
                                  multi: config.multi,
                                  name: config.name,
                                  cities: config.cities,
                                  citySlug: slug,
                                  rubricId: rubric._id,
                                },
                              },
                            }).catch(console.log);
                          }}
                        />
                      </div>
                      <div className='font-medium' data-cy={`rubric-${rubric.name}`}>
                        {rubric.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </WpAccordion>
          );
        })}
      </div>
    );
  }

  if (isCategoriesTree) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='mb-3 flex min-h-[1.3rem] items-start overflow-ellipsis whitespace-nowrap font-medium text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <WpTooltip title={description}>
                <div className='ml-3 inline-block cursor-pointer'>
                  <WpIcon className='h-5 w-5' name={'question-circle'} />
                </div>
              </WpTooltip>
            </React.Fragment>
          ) : null}
        </div>
        {cities.map(({ name, slug }) => {
          const cityTestId = `${configSlug}-${slug}`;
          return (
            <WpAccordion
              isOpen={slug === DEFAULT_CITY}
              testId={cityTestId}
              title={`${name}`}
              key={slug}
            >
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                {(rubrics || []).map((rubric) => {
                  return (
                    <div className='mb-8' key={`${rubric._id}`}>
                      <div className='text-lg font-medium'>{rubric.name}</div>

                      {(rubric.categories || []).map((category) => (
                        <div className='border-b border-border-300 py-6' key={`${category._id}`}>
                          {renderCategories({
                            category,
                            citySlug: slug,
                            rubricId: `${rubric._id}`,
                            isParentSelected: true,
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </WpAccordion>
          );
        })}
      </div>
    );
  }

  if (isAddress) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='mb-3 flex min-h-[1.3rem] items-start overflow-ellipsis whitespace-nowrap font-medium text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <WpTooltip title={description}>
                <div className='ml-3 inline-block cursor-pointer'>
                  <WpIcon className='h-5 w-5' name={'question-circle'} />
                </div>
              </WpTooltip>
            </React.Fragment>
          ) : null}
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            updateConfigMutationHandler(values);
          }}
        >
          {() => {
            const fieldName = `cities.${DEFAULT_CITY}.${DEFAULT_LOCALE}[0]`;

            return (
              <Form>
                {cities.map(({ name, slug }) => {
                  const cityTestId = `${configSlug}-${slug}`;
                  return (
                    <WpAccordion
                      isOpen={slug === DEFAULT_CITY}
                      testId={cityTestId}
                      title={`${name}`}
                      key={slug}
                    >
                      <div className='ml-8 pt-[var(--lineGap-200)]'>
                        <FormikAddressInput name={fieldName} />
                      </div>
                    </WpAccordion>
                  );
                })}
                <div className='mb-12 mt-4 flex'>
                  <WpButton
                    theme={'secondary'}
                    size={'small'}
                    type={'submit'}
                    testId={`${configSlug}-submit`}
                  >
                    Сохранить
                  </WpButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }

  if (isConstructor) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='mb-3 flex min-h-[1.3rem] items-start overflow-ellipsis whitespace-nowrap font-medium text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <WpTooltip title={description}>
                <div className='ml-3 inline-block cursor-pointer'>
                  <WpIcon className='h-5 w-5' name={'question-circle'} />
                </div>
              </WpTooltip>
            </React.Fragment>
          ) : null}
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            updateConfigMutationHandler(values);
          }}
        >
          {({ values, setFieldValue }) => {
            const fieldName = `cities.${DEFAULT_CITY}.${DEFAULT_LOCALE}`;
            const fieldValue = get(values, fieldName);
            const constructorValue = getConstructorDefaultValue(fieldValue);

            return (
              <Form>
                {cities.map(({ name, slug }) => {
                  const cityTestId = `${configSlug}-${slug}`;
                  return (
                    <WpAccordion
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
                              formData.append('companySlug', config.companySlug);

                              const responseFetch = await fetch('/api/config/add-seo-text-asset', {
                                method: 'POST',
                                body: formData,
                              });
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
                    </WpAccordion>
                  );
                })}
                <div className='mb-12 mt-4 flex'>
                  <WpButton
                    theme={'secondary'}
                    size={'small'}
                    type={'submit'}
                    testId={`${configSlug}-submit`}
                  >
                    Сохранить
                  </WpButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }

  return (
    <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
      <div
        className='mb-3 flex min-h-[1.3rem] items-start overflow-ellipsis whitespace-nowrap font-medium text-secondary-text'
        data-cy={`${configSlug}-config-name`}
      >
        <span>{name}</span>
        {description ? (
          <React.Fragment>
            {' '}
            <WpTooltip title={description}>
              <div className='ml-3 inline-block cursor-pointer'>
                <WpIcon className='h-5 w-5' name={'question-circle'} />
              </div>
            </WpTooltip>
          </React.Fragment>
        ) : null}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={notAssetSchema}
        onSubmit={(values) => {
          updateConfigMutationHandler(values);
        }}
      >
        {() => {
          return (
            <Form>
              {cities.map(({ name, slug }) => {
                const cityTestId = `${configSlug}-${slug}`;
                return (
                  <WpAccordion
                    isOpen={slug === DEFAULT_CITY}
                    testId={cityTestId}
                    title={`${name}`}
                    key={slug}
                  >
                    <div className='ml-8 pt-[var(--lineGap-200)]'>
                      <ConfigTranslationInput
                        name={`cities.${slug}`}
                        testId={`${configSlug}-${slug}`}
                        multi={multi}
                        type={type}
                        variant={variant}
                      />
                    </div>
                  </WpAccordion>
                );
              })}
              <div className='mb-12 mt-4 flex'>
                <WpButton
                  theme={'secondary'}
                  size={'small'}
                  type={'submit'}
                  testId={`${configSlug}-submit`}
                >
                  Сохранить
                </WpButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormikConfigInput;
