import Accordion from 'components/Accordion';
import Button from 'components/Button';
import ButtonCross from 'components/ButtonCross';
import FormikInput, { FormikInputPropsInterface } from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Icon from 'components/Icon';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Tooltip from 'components/Tooltip';
import { DEFAULT_CITY } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useLocaleContext } from 'context/localeContext';
import { ConfigModel, TranslationModel } from 'db/dbModels';
import { Form, Formik, useField, useFormikContext } from 'formik';
import { useUpdateConfigMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { get } from 'lodash';
import * as React from 'react';
import { InputType } from 'types/clientTypes';
import { updateConfigSchema } from 'validation/configSchema';

interface ConfigInputInterface extends FormikInputPropsInterface {
  onRemoveHandler?: (values: any) => void;
  multi?: boolean;
}

const ConfigInput: React.FC<ConfigInputInterface> = ({ name, multi, testId, type }) => {
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
            <div style={multi ? inputWithStyles : inputFullWithStyles}>
              <FormikInput name={fieldName} testId={fieldTestId} type={type} low />
            </div>

            {multi && (
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
            )}
          </div>
        );
      })}
    </div>
  );
};

interface ConfigTranslationInputInterface extends FormikInputPropsInterface {
  multi?: boolean;
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
        initialValues={{ configId: _id, cities: configCities }}
        onSubmit={(values) => {
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
                cities: values.cities,
              },
            },
          }).catch((e) => console.log(e));
        }}
        validationSchema={notAssetSchema}
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
