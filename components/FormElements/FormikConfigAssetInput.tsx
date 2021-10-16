import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import Notification from 'components/Notification';
import {
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_POST,
} from 'config/common';
import { ConfigModel } from 'db/dbModels';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { get } from 'lodash';
import * as React from 'react';

interface ConfigsAssetInputInterface {
  config: ConfigModel;
  format: string;
  isSvg?: boolean;
}

const ConfigsAssetInput: React.FC<ConfigsAssetInputInterface> = ({ config }) => {
  const { slug, name, description, acceptedFormats, cities } = config;
  const { showErrorNotification, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const configValueArray = get(cities, `${DEFAULT_CITY}.${DEFAULT_LOCALE}`) || [''];
  const configValue = configValueArray[0];

  return (
    <div className='mb-24 grid lg:grid-cols-2 lg:gap-4'>
      <div>
        <WpImageUpload
          previewUrl={`${configValue}`}
          isHorizontal
          label={name}
          name={'file'}
          testId={slug}
          width={'10rem'}
          height={'10rem'}
          format={acceptedFormats}
          lineContentClass='flex items-start'
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('config', JSON.stringify(config));
            fetch('/api/config/update-asset-config', {
              method: REQUEST_METHOD_DELETE,
              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                onCompleteCallback(json);
              })
              .catch(() => {
                showErrorNotification({ title: 'error' });
              });
          }}
          uploadImageHandler={(files) => {
            if (files) {
              showLoading();
              const formData = new FormData();
              formData.append('assets', files[0]);
              formData.append('config', JSON.stringify(config));

              fetch('/api/config/update-asset-config', {
                method: REQUEST_METHOD_POST,
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  onCompleteCallback(json);
                })
                .catch(() => {
                  showErrorNotification({ title: 'error' });
                });
            }
          }}
        />
      </div>
      <div>{description ? <Notification variant={'success'} message={description} /> : null}</div>
    </div>
  );
};

export default ConfigsAssetInput;
