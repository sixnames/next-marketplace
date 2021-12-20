import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConfigsFormTemplate from '../../../components/FormTemplates/ConfigsFormTemplate';
import Inner from '../../../components/Inner';
import { CONFIG_GROUP_ANALYTICS, DEFAULT_COMPANY_SLUG } from '../../../config/common';
import ConsoleLayout from '../../../layout/cms/ConsoleLayout';
import ConsoleConfigsLayout, {
  ConfigPageInterface,
} from '../../../layout/console/ConsoleConfigsLayout';
import { getConfigPageData } from '../../../lib/configsUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../lib/ssrUtils';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ assetConfigs, normalConfigs }) => {
  return (
    <ConsoleConfigsLayout isCms={true}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </ConsoleConfigsLayout>
  );
};

interface ConfigInterface extends GetAppInitialDataPropsInterface, ConfigPageInterface {}

const Config: NextPage<ConfigInterface> = (props) => {
  const { layoutProps } = props;
  return (
    <ConsoleLayout title={'Настройки сайта'} {...layoutProps}>
      <ConfigConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: DEFAULT_COMPANY_SLUG,
    group: CONFIG_GROUP_ANALYTICS,
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
