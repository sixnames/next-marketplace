import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConfigsFormTemplate from '../../../../../components/FormTemplates/ConfigsFormTemplate';
import Inner from '../../../../../components/Inner';
import { CONFIG_GROUP_SEO } from '../../../../../config/common';
import { ConfigModel } from '../../../../../db/dbModels';
import { CompanyInterface } from '../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import ConsoleCompanyLayout from '../../../../../layout/console/ConsoleCompanyLayout';
import { getConfigPageData } from '../../../../../lib/configsUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';
import { PagePropsInterface } from '../../../../_app';

interface ConfigConsumerInterface {
  pageCompany: CompanyInterface;
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  assetConfigs,
  normalConfigs,
  pageCompany,
}) => {
  return (
    <ConsoleCompanyLayout pageCompany={pageCompany}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </ConsoleCompanyLayout>
  );
};

interface ConfigInterface extends ConfigPageInterface, GetConsoleInitialDataPropsInterface {}

const Config: NextPage<ConfigInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={'Настройки сайта'} {...layoutProps}>
      <ConfigConsumer {...props} />
    </ConsoleLayout>
  );
};

interface ConfigPageInterface extends PagePropsInterface, ConfigConsumerInterface {}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigInterface>> => {
  const { query } = context;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: `${query.companyId}`,
    group: CONFIG_GROUP_SEO,
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
