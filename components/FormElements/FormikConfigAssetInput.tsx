import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import { DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import { useUpdateAssetConfigMutation } from 'generated/apolloComponents';
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
                  if (files) {
                    updateAssetConfigMutation({
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
                          assets: [files[0]],
                        },
                      },
                    }).catch(() => showErrorNotification());
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
