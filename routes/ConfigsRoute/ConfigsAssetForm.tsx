import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import * as React from 'react';
import { useUpdateAssetConfigMutation } from 'generated/apolloComponents';
import FormikImageUpload from '../../components/FormElements/Upload/FormikImageUpload';
import { Form, Formik } from 'formik';
import classes from './ConfigsAssetForm.module.css';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useRouter } from 'next/router';
import { get } from 'lodash';

interface ConfigsAssetFormInterface {
  config: ConfigModel;
  format: string;
  isSvg?: boolean;
}

const ConfigsAssetForm: React.FC<ConfigsAssetFormInterface> = ({ config }) => {
  const router = useRouter();
  const { _id, slug, name, description, acceptedFormats, cities } = config;
  const { onErrorCallback, showErrorNotification } = useMutationCallbacks({});
  const [updateAssetConfigMutation] = useUpdateAssetConfigMutation({
    onError: onErrorCallback,
    onCompleted: () => {
      router.reload();
    },
  });

  const file = get(cities, `${DEFAULT_CITY}.${DEFAULT_LOCALE}`);

  return (
    <Formik enableReinitialize initialValues={{ file }} onSubmit={(values) => console.log(values)}>
      {({ values: { file } }) => {
        const isEmpty = !file || !file.length;

        return (
          <Form>
            <FormikImageUpload
              isHorizontal
              label={name}
              name={'file'}
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
                        configId: _id,
                        assets: [files[0]],
                      },
                    },
                  }).catch(() => showErrorNotification());
                }
              }}
            >
              {isEmpty ? (
                <div className={classes.info}>
                  <div className={classes.error}>Изображение обязательно к заполнению</div>
                </div>
              ) : null}
            </FormikImageUpload>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConfigsAssetForm;
