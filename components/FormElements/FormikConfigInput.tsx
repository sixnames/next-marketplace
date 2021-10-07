import Accordion from 'components/Accordion';
import Button from 'components/Button';
import ButtonCross from 'components/ButtonCross';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikAddressInput from 'components/FormElements/Input/FormikAddressInput';
import FormikInput, { FormikInputPropsInterface } from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Icon from 'components/Icon';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import PageEditor from 'components/PageEditor';
import Tooltip from 'components/Tooltip';
import {
  CONFIG_VARIANT_ADDRESS,
  CONFIG_VARIANT_BOOLEAN,
  CONFIG_VARIANT_CATEGORIES_TREE,
  CONFIG_VARIANT_CONSTRUCTOR,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  GEO_POINT_TYPE,
} from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { AddressModel, ConfigModel, JSONObjectModel, TranslationModel } from 'db/dbModels';
import { CategoryInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik, useField, useFormikContext } from 'formik';
import {
  useUpdateConfigMutation,
  useUpdateVisibleCategoriesInNavDropdownMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { alwaysArray } from 'lib/arrayUtils';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
import { GeocodeResultInterface } from 'lib/geocode';
import { noNaN } from 'lib/numbers';
import { get } from 'lodash';
import * as React from 'react';
import { InputType } from 'types/clientTypes';
import { updateConfigSchema } from 'validation/configSchema';

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
    width: 'calc(100% - 40px)',
  } as React.CSSProperties;

  return (
    <div className='mb-[var(--lineGap-200)]'>
      {(field.value || ['']).map((_: any, index: number) => {
        const isFirst = index === 0;
        const fieldName = `${name}[${index}]`;
        const fieldTestId = `${testId}-${index}`;

        return (
          <div className='flex items-center justify-center' key={index}>
            {variant === 'boolean' ? (
              <React.Fragment>
                <FormikCheckboxLine label={'Показывать'} name={fieldName} testId={fieldTestId} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={multi ? inputWithStyles : inputFullWithStyles}>
                  <FormikInput name={fieldName} testId={fieldTestId} type={type} low />
                </div>

                {multi ? (
                  <div className='flex items-center justify-end flex-shrink-0 w-[40px]'>
                    {isFirst ? (
                      <Button
                        onClick={addFieldHandler}
                        size={'small'}
                        theme={'secondary'}
                        icon={'plus'}
                        testId={`${fieldTestId}-add`}
                        circle
                      />
                    ) : (
                      <ButtonCross
                        testId={`${fieldTestId}-remove`}
                        onClick={() => removeFieldHandler(index)}
                      />
                    )}
                  </div>
                ) : null}
              </React.Fragment>
            )}
          </div>
        );
      })}
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
            <Accordion
              testId={`${testId}-accordion-${localeSlug}`}
              isOpen={localeSlug === defaultLocale}
              title={localeSlug}
              titleRight={
                <Tooltip title={accordionIconTooltip}>
                  <div>
                    <Icon className={`w-4 h-4 ${accordionIconClass}`} name={accordionIcon} />
                  </div>
                </Tooltip>
              }
              key={`${inputName}-${localeSlug}`}
            >
              <div className='mt-3 mb-6'>
                <ConfigInput {...props} name={name} testId={`${testId}-${localeSlug}`} />
              </div>
            </Accordion>
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
  categoryIds: string[];
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
  const { onErrorCallback, onCompleteCallback } = useMutationCallbacks({
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
                        point: {
                          type: GEO_POINT_TYPE,
                          coordinates: [initialValue.point.lng, initialValue.point.lat],
                        },
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

  const renderCategories = React.useCallback(
    ({ category, rubricId, citySlug, categoryIds }: RenderCategoriesInterface) => {
      const { name, categories } = category;
      const configValue = alwaysArray(get(config.cities, `${citySlug}.${DEFAULT_LOCALE}`));
      const categoryValue = `${rubricId}${FILTER_SEPARATOR}${category._id}`;
      const isSelected = configValue.includes(categoryValue);

      return (
        <div>
          <div className='cms-option flex gap-4 items-center'>
            <div>
              <Checkbox
                testId={`${category.name}`}
                checked={isSelected}
                value={category._id}
                name={`${category._id}`}
                onChange={() => {
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
                        categoryIds,
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
                    categoryIds: [...categoryIds, `${category._id}`],
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
      updateVisibleCategoriesInNavDropdownMutation,
    ],
  );

  if (isCategoriesTree) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='flex items-start min-h-[1.3rem] mb-3 font-medium overflow-ellipsis whitespace-nowrap text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <Tooltip title={description}>
                <div className='inline-block cursor-pointer ml-3'>
                  <Icon className='w-5 h-5' name={'question-circle'} />
                </div>
              </Tooltip>
            </React.Fragment>
          ) : null}
        </div>
        {cities.map(({ name, slug }) => {
          const cityTestId = `${configSlug}-${slug}`;
          return (
            <Accordion
              isOpen={slug === DEFAULT_CITY}
              testId={cityTestId}
              title={`${name}`}
              key={slug}
            >
              <div className='ml-8 pt-[var(--lineGap-200)]'>
                {(rubrics || []).map((rubric) => {
                  return (
                    <div className='mb-8' key={`${rubric._id}`}>
                      <div className='font-medium text-lg'>{rubric.name}</div>

                      {(rubric.categories || []).map((category) => (
                        <div className='border-b border-border-300 py-6' key={`${category._id}`}>
                          {renderCategories({
                            category,
                            citySlug: slug,
                            rubricId: `${rubric._id}`,
                            categoryIds: [`${category._id}`],
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Accordion>
          );
        })}
      </div>
    );
  }

  if (isAddress) {
    return (
      <div className='mb-24' data-cy={`${configSlug}-config`} key={configSlug}>
        <div
          className='flex items-start min-h-[1.3rem] mb-3 font-medium overflow-ellipsis whitespace-nowrap text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <Tooltip title={description}>
                <div className='inline-block cursor-pointer ml-3'>
                  <Icon className='w-5 h-5' name={'question-circle'} />
                </div>
              </Tooltip>
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
                    <Accordion
                      isOpen={slug === DEFAULT_CITY}
                      testId={cityTestId}
                      title={`${name}`}
                      key={slug}
                    >
                      <div className='ml-8 pt-[var(--lineGap-200)]'>
                        <FormikAddressInput name={fieldName} />
                      </div>
                    </Accordion>
                  );
                })}
                <div className='flex mb-12 mt-4'>
                  <Button
                    theme={'secondary'}
                    size={'small'}
                    type={'submit'}
                    testId={`${configSlug}-submit`}
                  >
                    Сохранить
                  </Button>
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
          className='flex items-start min-h-[1.3rem] mb-3 font-medium overflow-ellipsis whitespace-nowrap text-secondary-text'
          data-cy={`${configSlug}-config-name`}
        >
          <span>{name}</span>
          {description ? (
            <React.Fragment>
              {' '}
              <Tooltip title={description}>
                <div className='inline-block cursor-pointer ml-3'>
                  <Icon className='w-5 h-5' name={'question-circle'} />
                </div>
              </Tooltip>
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
                              formData.append('companySlug', config.companySlug);

                              const responseFetch = await fetch('/api/add-seo-text-asset', {
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
                    </Accordion>
                  );
                })}
                <div className='flex mb-12 mt-4'>
                  <Button
                    theme={'secondary'}
                    size={'small'}
                    type={'submit'}
                    testId={`${configSlug}-submit`}
                  >
                    Сохранить
                  </Button>
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
        className='flex items-start min-h-[1.3rem] mb-3 font-medium overflow-ellipsis whitespace-nowrap text-secondary-text'
        data-cy={`${configSlug}-config-name`}
      >
        <span>{name}</span>
        {description ? (
          <React.Fragment>
            {' '}
            <Tooltip title={description}>
              <div className='inline-block cursor-pointer ml-3'>
                <Icon className='w-5 h-5' name={'question-circle'} />
              </div>
            </Tooltip>
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
                  <Accordion
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
                  </Accordion>
                );
              })}
              <div className='flex mb-12 mt-4'>
                <Button
                  theme={'secondary'}
                  size={'small'}
                  type={'submit'}
                  testId={`${configSlug}-submit`}
                >
                  Сохранить
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormikConfigInput;
