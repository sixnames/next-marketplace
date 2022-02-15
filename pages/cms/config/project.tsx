import { getConfigPageData } from 'db/ssr/configs/getConfigPageData';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { CONFIG_GROUP_PROJECT, DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleConfigsLayout, { ConfigPageInterface } from 'components/layout/console/ConsoleConfigsLayout';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ assetConfigs, normalConfigs }) => {
  return (
    <ConsoleConfigsLayout>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </ConsoleConfigsLayout>
  );
};

interface ConfigInterface extends ConfigPageInterface, GetAppInitialDataPropsInterface {}

const Config: NextPage<ConfigInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={'Настройки сайта'} {...layoutProps}>
      <ConfigConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: DEFAULT_COMPANY_SLUG,
    group: CONFIG_GROUP_PROJECT,
  });

  if (!configsPayload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      assetConfigs: castDbData(configsPayload.assetConfigs),
      normalConfigs: castDbData(configsPayload.normalConfigs),
    },
  };
};

export default Config;
