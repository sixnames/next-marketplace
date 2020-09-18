import React from 'react';
import { UpdateConfigInput, useUpdateConfigMutation } from '../../generated/apolloComponents';
import { CONFIG_VARIANT_ASSET, IS_BROWSER } from '../../config';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateConfigSchema } from '../../validation/configSchema';
import Button from '../../components/Buttons/Button';
import classes from './ConfigsContent.module.css';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useConfigContext } from '../../context/configContext';
import ConfigsAssetForm from './ConfigsAssetForm';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Accordion from '../../components/Accordion/Accordion';
import FormikTranslationsInput from '../../components/FormElements/Input/FormikTranslationsInput';
import { useLanguageContext } from '../../context/languageContext';

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
                return configTranslation
                  ? {
                      key: configTranslation.key,
                      value: configTranslation.value,
                    }
                  : {
                      key,
                      value: [],
                    };
              }),
            };
          }
          return {
            key: city.slug,
            translations: languagesList.map(({ key }) => ({ key, value: [] })),
          };
        }),
      };
    });

  function updateConfigHandler(input: UpdateConfigInput) {
    return updateConfigMutation({
      variables: {
        input,
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
        {notAssetConfigs.map(({ slug: configSlug, nameString, cities: configCities, id }) => {
          return (
            <div className={classes.config} data-cy={`${configSlug}-config`} key={configSlug}>
              <div className={classes.configName} data-cy={`${configSlug}-config-name`}>
                {nameString}
              </div>
              <Formik
                initialValues={{ id, cities: configCities }}
                onSubmit={(values) => updateConfigHandler(values)}
                validationSchema={notAssetSchema}
              >
                {({ dirty }) => {
                  return (
                    <Form>
                      {cities.map(({ nameString, slug }, cityIndex) => {
                        const cityTestId = `${configSlug}-${slug}`;
                        return (
                          <Accordion testId={cityTestId} title={nameString} key={slug}>
                            <div className={classes.accordionContent}>
                              <FormikTranslationsInput
                                name={`cities[${cityIndex}].translations`}
                                testId={`${configSlug}-${slug}`}
                              />
                            </div>
                          </Accordion>
                        );
                      })}
                      {dirty ? (
                        <div className={classes.buttons}>
                          <Button size={'small'} type={'submit'} testId={`${configSlug}-submit`}>
                            Сохранить
                          </Button>
                        </div>
                      ) : null}
                    </Form>
                  );
                }}
              </Formik>
            </div>
          );
        })}
      </InnerWide>
    </DataLayoutContentFrame>
  );
};

export default ConfigsContent;
