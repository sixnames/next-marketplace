import Accordion from 'components/Accordion';
import Button from 'components/Button';
import ButtonCross from 'components/ButtonCross';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput, { FormikInputPropsInterface } from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Icon from 'components/Icon';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import PageEditor from 'components/PageEditor';
import Tooltip from 'components/Tooltip';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { ConfigModel, JSONObjectModel, TranslationModel } from 'db/dbModels';
import { Form, Formik, useField, useFormikContext } from 'formik';
import { useUpdateConfigMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { alwaysArray } from 'lib/arrayUtils';
import { getConstructorDefaultValue } from 'lib/constructorUtils';
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

interface InitialValues {
  configId: string;
  cities: JSONObjectModel;
}

interface FormikConfigInputInterface {
  config: ConfigModel;
}

const FormikConfigInput: React.FC<FormikConfigInputInterface> = ({ config }) => {
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
  const initialType = variant === 'string' ? 'text' : variant;
  const type = initialType as InputType;
  const isConstructor = variant === 'constructor';

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

      if (variant === 'number') {
        localesAcc[localeKey] = locale.map((value) => noNaN(value));
        return localesAcc;
      }

      if (variant === 'boolean') {
        localesAcc[localeKey] = locale.map((value) => value === 'true');
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
                    if (config.variant === 'boolean') {
                      if (!value) {
                        return 'false';
                      }
                      return `${value}`;
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
      updateConfigMutation,
    ],
  );

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
