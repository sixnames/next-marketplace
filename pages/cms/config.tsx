import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import ConfigsAssetInput from 'components/FormElements/FormikConfigAssetInput';
import FormikConfigInput from 'components/FormElements/FormikConfigInput';
import InnerWide from 'components/Inner/InnerWide';
import Notification from 'components/Notification/Notification';
import { CONFIG_VARIANT_ASSET } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const ConfigsContent: React.FC = () => {
  const { configs } = useConfigContext();
  const assetConfigs = configs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = configs.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  return (
    <DataLayoutContentFrame>
      <InnerWide testId={'site-configs'}>
        {assetConfigs.map((config) => {
          const { slug } = config;
          const isSvg = slug !== 'pageDefaultPreviewImage';
          return (
            <ConfigsAssetInput
              key={`${config._id}`}
              config={config}
              isSvg={isSvg}
              format={isSvg ? 'svg' : 'jpg'}
            />
          );
        })}

        <div className='mb-8 max-w-[980px]'>
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

        {notAssetConfigs.map((config) => {
          return <FormikConfigInput key={`${config._id}`} config={config} />;
        })}
      </InnerWide>
    </DataLayoutContentFrame>
  );
};

const ConfigsRoute: React.FC = () => {
  return <DataLayout title={'Настройки сайта'} filterResult={() => <ConfigsContent />} />;
};

const Config: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ConfigsRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Config;
