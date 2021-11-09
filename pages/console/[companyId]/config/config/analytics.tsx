import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { CONFIG_GROUP_ANALYTICS } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import { CompanyInterface } from 'db/uiInterfaces';
import ConsoleCompanyLayout from 'layout/console/ConsoleCompanyLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getConfigPageData } from 'lib/configsUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ConfigConsumerInterface {
  pageCompany: CompanyInterface;
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  assetConfigs,
  pageCompany,
  normalConfigs,
}) => {
  return (
    <ConsoleCompanyLayout pageCompany={pageCompany}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </ConsoleCompanyLayout>
  );
};

interface ConfigPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ConfigConsumerInterface {}

const Config: NextPage<ConfigPageInterface> = (props) => {
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
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: `${query.companyId}`,
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
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default Config;
