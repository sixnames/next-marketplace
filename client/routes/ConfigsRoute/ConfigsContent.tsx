import React, { Fragment } from 'react';
import {
  ConfigLanguage,
  UpdateConfigInput,
  useUpdateConfigMutation,
} from '../../generated/apolloComponents';
import { CONFIG_VARIANT_ASSET, IS_BROWSER } from '../../config';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik, useField, useFormikContext } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateConfigSchema } from '../../validation/configSchema';
import Button from '../../components/Buttons/Button';
import classes from './ConfigsContent.module.css';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useConfigContext } from '../../context/configContext';
import ConfigsAssetForm from './ConfigsAssetForm';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Accordion from '../../components/Accordion/Accordion';
import { useLanguageContext } from '../../context/languageContext';
import FormikInput, {
  FormikInputPropsInterface,
} from '../../components/FormElements/Input/FormikInput';
import { get } from 'lodash';
import InputLine from '../../components/FormElements/Input/InputLine';
import TTip from '../../components/TTip/TTip';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from '../../context/appContext';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from '../../config/modals';
import ButtonCross from '../../components/Buttons/ButtonCross';
import Notification from '../../components/Notification/Notification';

interface ConfigInputInterface extends FormikInputPropsInterface {
  onRemoveHandler?: (values: any) => void;
  multi?: boolean;
}

const ConfigInput: React.FC<ConfigInputInterface> = ({ name, multi }) => {
  const { showModal } = useAppContext();
  const [field, meta, { setValue }] = useField(name);

  function addFieldHandler() {
    setValue([...meta.value, '']);
  }

  function removeFieldHandler(removeIndex: number) {
    showModal<ConfirmModalInterface>({
      type: CONFIRM_MODAL,
      props: {
        testId: 'remove-field-modal',
        message: (
          <div>
            <p>Вы уверены, что хотите удалить поле настройки?</p>
            <p>
              Удаление будет сохранено только после нажатия кнопки <span>Сохранить</span>
            </p>
          </div>
        ),
        confirm: () => {
          const newValue = meta.value.filter(
            (_: string, fieldIndex: number) => fieldIndex !== removeIndex,
          );
          setValue(newValue);
        },
      },
    });
  }

  return (
    <div className={classes.inputsFrame}>
      {field.value.map((_: any, index: number) => {
        const isFirst = index === 0;
        const fieldName = `${name}[${index}]`;

        return (
          <div
            className={`${classes.inputHolder} ${!isFirst ? classes.inputHolderWithGap : ''}`}
            key={index}
          >
            <div className={classes.input}>
              <FormikInput name={fieldName} testId={fieldName} low />
            </div>

            {multi && (
              <div className={classes.inputControl}>
                {isFirst ? (
                  <Button
                    onClick={addFieldHandler}
                    size={'small'}
                    theme={'secondary'}
                    icon={'plus'}
                    testId={`${fieldName}-add`}
                    circle
                  />
                ) : (
                  <ButtonCross
                    testId={`${fieldName}-remove`}
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
  const { languagesList } = useLanguageContext();
  const { values } = useFormikContext();
  const currentField: ConfigLanguage[] = get(values, inputName) || [];

  return (
    <InputLine name={inputName} labelTag={'div'} labelClass={classes.listLabel}>
      {currentField.map(({ key, value }, index) => {
        const currentLanguage = languagesList.find(({ key: languageKey }) => languageKey === key);
        if (!currentLanguage) {
          return null;
        }

        const notEmpty: boolean =
          value.reduce((acc: number, currentValue) => (currentValue ? acc + 1 : acc), 0) > 0;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty ? classes.iconDone : classes.iconEmpty;
        const { name, isDefault } = currentLanguage;

        return (
          <Accordion
            testId={`${testId}-accordion-${key}`}
            isOpen={isDefault}
            title={name}
            titleRight={
              <TTip
                title={accordionIconTooltip}
                className={`${classes.accordionIcon} ${accordionIconClass}`}
              >
                <Icon name={accordionIcon} />
              </TTip>
            }
            key={`${inputName}-${key}`}
          >
            <div className={classes.languageInput}>
              <ConfigInput
                {...props}
                name={`${inputName}[${index}].value`}
                testId={`${testId}-${key}`}
              />
            </div>
          </Accordion>
        );
      })}
    </InputLine>
  );
};

const ConfigsContent: React.FC = () => {
  const { languagesList } = useLanguageContext();
  const { configs, cities } = useConfigContext();
  const { onErrorCallback } = useMutationCallbacks({});
  const [updateConfigMutation] = useUpdateConfigMutation({
    onError: onErrorCallback,
    onCompleted: () => {
      if (IS_BROWSER) {
        window.location.reload();
      }
    },
  });
  const notAssetSchema = useValidationSchema({
    schema: updateConfigSchema,
  });

  const assetConfigs = configs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = configs
    .filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET)
    .map((config) => {
      // add initial value for all languages and cities
      return {
        ...config,
        cities: cities.map((city) => {
          const configCity = config.cities.find(({ key }) => key === city.slug);
          if (configCity) {
            return {
              key: configCity.key,
              translations: languagesList.map(({ key }) => {
                const configTranslation = configCity.translations.find(
                  ({ key: configTranslationKey }) => key === configTranslationKey,
                );
                return configTranslation &&
                  configTranslation.value.length &&
                  configTranslation.value[0]?.length
                  ? {
                      key: configTranslation.key,
                      value: configTranslation.value,
                    }
                  : {
                      key,
                      value: [''],
                    };
              }),
            };
          }
          return {
            key: city.slug,
            translations: languagesList.map(({ key }) => ({ key, value: [''] })),
          };
        }),
      };
    });

  function updateConfigHandler(config: UpdateConfigInput) {
    // remove all empty fields from translations.value then update
    return updateConfigMutation({
      variables: {
        input: {
          id: config.id,
          cities: config.cities.map((city) => ({
            ...city,
            translations: city.translations.map((translation) => ({
              ...translation,
              value: translation.value.filter((value) => {
                return value && value.length;
              }),
            })),
          })),
        },
      },
    });
  }

  return (
    <DataLayoutContentFrame>
      <InnerWide testId={'site-configs'}>
        {assetConfigs.map((config) => {
          const { slug } = config;
          const isSvg = slug !== 'pageDefaultPreviewImage';
          return (
            <ConfigsAssetForm
              key={config.id}
              config={config}
              isSvg={isSvg}
              format={isSvg ? 'svg' : 'jpg'}
            />
          );
        })}

        <div className={classes.warning}>
          <Notification
            type={'warning'}
            title={'Внимание!'}
            message={`Каждая настройка содержит города и языки созданные в базе данных.
              Обязательны к заполнению только основной город и основной язык.
              Если пользователь войдёт на сайт не основного города или будет использовать
              не основной язык и настройка не будет заполнена по этим параметрам,
              то значение настройки будет взято из основных полей.`}
          />
        </div>

        {notAssetConfigs.map(
          ({ slug: configSlug, nameString, cities: configCities, id, multi, description }) => {
            return (
              <div className={classes.config} data-cy={`${configSlug}-config`} key={configSlug}>
                <div className={classes.configName} data-cy={`${configSlug}-config-name`}>
                  <span>{nameString}</span>
                  {description && (
                    <Fragment>
                      {' '}
                      <TTip title={description} className={classes.configDescription}>
                        <Icon name={'question-circle'} />
                      </TTip>
                    </Fragment>
                  )}
                </div>
                <Formik
                  initialValues={{ id, cities: configCities }}
                  onSubmit={(values) => updateConfigHandler(values)}
                  validationSchema={notAssetSchema}
                >
                  {() => {
                    return (
                      <Form>
                        {cities.map(({ nameString, slug }, cityIndex) => {
                          const cityTestId = `${configSlug}-${slug}`;
                          return (
                            <Accordion testId={cityTestId} title={nameString} key={slug}>
                              <div className={classes.accordionContent}>
                                <ConfigTranslationInput
                                  name={`cities[${cityIndex}].translations`}
                                  testId={`${configSlug}-${slug}`}
                                  multi={multi}
                                />
                              </div>
                            </Accordion>
                          );
                        })}
                        <div className={classes.buttons}>
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
          },
        )}
      </InnerWide>
    </DataLayoutContentFrame>
  );
};

export default ConfigsContent;
