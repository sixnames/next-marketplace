import React from 'react';
import { InitialQuery, useUpdateAssetConfigMutation } from '../../generated/apolloComponents';
import FormikImageUpload from '../../components/FormElements/Upload/FormikImageUpload';
import { Form, Formik } from 'formik';
import classes from './ConfigsAssetForm.module.css';
import { IS_BROWSER } from '../../config';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';

interface ConfigsAssetFormInterface {
  config: InitialQuery['getAllConfigs'][0];
  format: string;
  isSvg?: boolean;
}

const ConfigsAssetForm: React.FC<ConfigsAssetFormInterface> = ({ config }) => {
  const { id, slug, nameString, description, acceptedFormats, cities } = config;
  const { onErrorCallback } = useMutationCallbacks({});
  const [updateAssetConfigMutation] = useUpdateAssetConfigMutation({
    onError: onErrorCallback,
    onCompleted: () => {
      if (IS_BROWSER) {
        window.location.reload();
      }
    },
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{ cities }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values: { cities } }) => {
        const isEmpty = cities[0].value.filter((value) => value).length === 0;

        return (
          <Form>
            <FormikImageUpload
              isHorizontal
              label={nameString}
              name={'cities[0]value[0]'}
              testId={slug}
              width={'10rem'}
              height={'10rem'}
              format={acceptedFormats}
              description={description}
              lineContentClass={classes.line}
              setImageHandler={(files) => {
                if (files) {
                  updateAssetConfigMutation({
                    variables: {
                      input: {
                        id,
                        value: [files[0]],
                      },
                    },
                  });
                }
              }}
            >
              <div className={classes.info}>
                {isEmpty && (
                  <div className={classes.error}>Изображение обязательно к заполнению</div>
                )}
              </div>
            </FormikImageUpload>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConfigsAssetForm;
