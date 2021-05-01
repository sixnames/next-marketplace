import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import * as React from 'react';

interface ConfigsAssetInputInterface {
  config: ConfigModel;
  format: string;
  isSvg?: boolean;
}

const ConfigsAssetInput: React.FC<ConfigsAssetInputInterface> = ({ config }) => {
  const router = useRouter();
  const { slug, name, description, acceptedFormats, cities } = config;
  const { showErrorNotification, showLoading } = useMutationCallbacks({});

  const file = get(cities, `${DEFAULT_CITY}.${DEFAULT_LOCALE}`);

  return (
    <Formik enableReinitialize initialValues={{ file }} onSubmit={(values) => console.log(values)}>
      {({ values: { file } }) => {
        const isEmpty = !file || !file.length;

        return (
          <Form>
            <div className='mb-24'>
              <FormikImageUpload
                isHorizontal
                label={name}
                name={'file'}
                testId={slug}
                width={'10rem'}
                height={'10rem'}
                format={acceptedFormats}
                description={description}
                lineContentClass='flex items-start'
                setImageHandler={(files) => {
                  showLoading();
                  const formData = new FormData();
                  formData.append('assets', files[0]);
                  formData.append('config', JSON.stringify(config));

                  if (files) {
                    fetch('/api/update-asset-config', {
                      method: 'POST',
                      body: formData,
                    })
                      .then((res) => {
                        return res.json();
                      })
                      .then((json) => {
                        if (json.success) {
                          router.reload();
                          return;
                        }
                        showErrorNotification({ title: json.message });
                      })
                      .catch(() => {
                        showErrorNotification({ title: 'error' });
                      });
                  }
                }}
              >
                {isEmpty ? (
                  <div className='pl-4'>
                    <div className='font-medium text-red-700'>
                      Изображение обязательно к заполнению
                    </div>
                  </div>
                ) : null}
              </FormikImageUpload>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConfigsAssetInput;
