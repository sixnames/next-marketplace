import React from 'react';
import { useUpdateConfigsMutation } from '../../generated/apolloComponents';
import { CONFIG_VARIANT_ASSET, IS_BROWSER } from '../../config';
import InnerWide from '../../components/Inner/InnerWide';
import FormikConfigInput from '../../components/FormElements/FormikConfigInput/FormikConfigInput';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateConfigsClientSchema } from '../../validation/configSchema';
import Button from '../../components/Buttons/Button';
import classes from './ConfigsContent.module.css';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useConfigContext } from '../../context/configContext';

const ConfigsContent: React.FC = () => {
  const { configs } = useConfigContext();
  const { onErrorCallback } = useMutationCallbacks({});
  const [updateConfigsMutation] = useUpdateConfigsMutation({
    onError: onErrorCallback,
    onCompleted: () => {
      if (IS_BROWSER) {
        window.location.reload();
      }
    },
  });
  const notAssetSchema = useValidationSchema({
    schema: updateConfigsClientSchema,
    messagesKeys: ['validation.configs.id', 'validation.configs.value'],
  });

  // const assetConfigs = configs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = configs.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  // console.log({ assetConfigs });

  const configsInitialValue = { inputs: notAssetConfigs };

  function updateConfigsHandler({ inputs }: typeof configsInitialValue) {
    const mutationInput = inputs.map(({ id, value }) => ({
      id,
      value,
    }));
    return updateConfigsMutation({
      variables: {
        input: mutationInput,
      },
    });
  }

  return (
    <InnerWide testId={'site-configs'}>
      <Formik
        validationSchema={notAssetSchema}
        initialValues={configsInitialValue}
        onSubmit={(values) => updateConfigsHandler(values)}
      >
        {({ values }) => {
          return (
            <Form>
              {values.inputs.map(({ id, nameString, description }, index) => {
                return (
                  <FormikConfigInput
                    key={id}
                    values={values}
                    index={index}
                    name={`inputs[${index}]`}
                    label={nameString}
                    description={description}
                    onRemoveHandler={updateConfigsHandler}
                  />
                );
              })}

              <div className={classes.buttons}>
                <Button type={'submit'} testId={'site-configs-submit'}>
                  Сохранить настройки
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

export default ConfigsContent;
