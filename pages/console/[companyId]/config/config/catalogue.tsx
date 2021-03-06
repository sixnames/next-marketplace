import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleCompanyLayout from 'components/layout/console/ConsoleCompanyLayout';
import { ConfigModel } from 'db/dbModels';
import { getConfigPageData } from 'db/ssr/configs/getConfigPageData';
import { CompanyInterface } from 'db/uiInterfaces';
import { CONFIG_GROUP_CATALOGUE } from 'lib/config/common';
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
  pageCompany,
  assetConfigs,
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
    group: CONFIG_GROUP_CATALOGUE,
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
