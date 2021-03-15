import ButtonCross from 'components/Buttons/ButtonCross';
import InputLine from 'components/FormElements/Input/InputLine';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from 'config/modals';
import { useAppContext } from 'context/appContext';
import { useLocaleContext } from 'context/localeContext';
import { TranslationModel } from 'db/dbModels';
import { get } from 'lodash';
import * as React from 'react';
import { UpdateConfigInput, useUpdateConfigMutation } from 'generated/apolloComponents';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik, useField, useFormikContext } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import Button from '../../components/Buttons/Button';
import classes from './ConfigsContent.module.css';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useConfigContext } from 'context/configContext';
import ConfigsAssetForm from './ConfigsAssetForm';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Accordion from '../../components/Accordion/Accordion';
import FormikInput, { FormikInputPropsInterface } from 'components/FormElements/Input/FormikInput';
import Icon from '../../components/Icon/Icon';
import Notification from '../../components/Notification/Notification';
import Tooltip from '../../components/TTip/Tooltip';
import { updateConfigSchema } from 'validation/configSchema';
import { useRouter } from 'next/router';
import { CONFIG_VARIANT_ASSET, DEFAULT_CITY } from 'config/common';

interface ConfigInputInterface extends FormikInputPropsInterface {
  onRemoveHandler?: (values: any) => void;
  multi?: boolean;
}

const ConfigInput: React.FC<ConfigInputInterface> = ({ name, multi, testId }) => {
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

  return (
    <div className={classes.inputsFrame}>
      {(field.value || ['']).map((_: any, index: number) => {
        const isFirst = index === 0;
        const fieldName = `${name}[${index}]`;
        const fieldTestId = `${testId}-${index}`;

        return (
          <div className={`${classes.inputHolder}`} key={index}>
            <div className={`${classes.input} ${multi ? classes.inputMulti : ''}`}>
              <FormikInput name={fieldName} testId={fieldTestId} low />
            </div>

            {multi && (
              <div className={classes.inputControl}>
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
    <InputLine name={inputName} labelTag={'div'} labelClass={classes.listLabel}>
      {dbLocales.map((localeSlug) => {
        const value: string | undefined = currentField[localeSlug];
        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty ? classes.iconDone : classes.iconEmpty;
        const name = `${inputName}.${localeSlug}`;

        return (
          <Accordion
            testId={`${testId}-accordion-${localeSlug}`}
            isOpen={localeSlug === defaultLocale}
            title={localeSlug}
            titleRight={
              <Tooltip title={accordionIconTooltip}>
                <div className={`${classes.accordionIcon} ${accordionIconClass}`}>
                  <Icon name={accordionIcon} />
                </div>
              </Tooltip>
            }
            key={`${inputName}-${localeSlug}`}
          >
            <div className={classes.languageInput}>
              <ConfigInput {...props} name={name} testId={`${testId}-${localeSlug}`} />
            </div>
          </Accordion>
        );
      })}
    </InputLine>
  );
};

const ConfigsContent: React.FC = () => {
  const router = useRouter();
  const { configs, cities } = useConfigContext();
  const { onErrorCallback } = useMutationCallbacks({});
  const [updateConfigMutation] = useUpdateConfigMutation({
    onError: onErrorCallback,
    onCompleted: () => {
      router.reload();
    },
  });
  const notAssetSchema = useValidationSchema({
    schema: updateConfigSchema,
  });

  const assetConfigs = configs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);

  const notAssetConfigs = configs.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  function updateConfigHandler(config: UpdateConfigInput) {
    return updateConfigMutation({
      variables: {
        input: config,
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
              key={`${config._id}`}
              config={config}
              isSvg={isSvg}
              format={isSvg ? 'svg' : 'jpg'}
            />
          );
        })}

        <div className={classes.warning}>
          <Notification
            variant={'warning'}
            title={'Внимание!'}
            message={`Каждая настройка содержит города и языки созданные в базе данных.
              Обязательны к заполнению только основной город и основной язык.
              Если пользователь войдёт на сайт не основного города или будет использовать
              не основной язык и настройка не будет заполнена по этим параметрам,
              то значение настройки будет взято из основных полей.`}
          />
        </div>

        {notAssetConfigs.map(
          ({ slug: configSlug, name, cities: configCities, _id, multi, description }) => {
            return (
              <div className={classes.config} data-cy={`${configSlug}-config`} key={configSlug}>
                <div className={classes.configName} data-cy={`${configSlug}-config-name`}>
                  <span>{name}</span>
                  {description && (
                    <React.Fragment>
                      {' '}
                      <Tooltip title={description}>
                        <div className={classes.configDescription}>
                          <Icon name={'question-circle'} />
                        </div>
                      </Tooltip>
                    </React.Fragment>
                  )}
                </div>
                <Formik
                  initialValues={{ configId: _id, cities: configCities }}
                  onSubmit={(values) => updateConfigHandler(values)}
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
                              <div className={classes.accordionContent}>
                                <ConfigTranslationInput
                                  name={`cities.${slug}`}
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
