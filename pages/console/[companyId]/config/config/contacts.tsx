import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { CONFIG_GROUP_CONTACTS } from 'config/common';
import { ConfigModel } from 'db/dbModels';
import { CompanyInterface } from 'db/uiInterfaces';
import AppCompanyLayout from 'layout/AppLayout/AppCompanyLayout';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ConfigConsumerInterface {
  currentCompany?: CompanyInterface | null;
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  currentCompany,
  assetConfigs,
  normalConfigs,
}) => {
  return (
    <AppCompanyLayout company={currentCompany}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </AppCompanyLayout>
  );
};

interface ConfigPageInterface extends PagePropsInterface, ConfigConsumerInterface {}

const Config: NextPage<ConfigPageInterface> = (props) => {
  const { pageUrls, currentCompany } = props;
  return (
    <AppLayout title={'Настройки сайта'} pageUrls={pageUrls} company={currentCompany}>
      <ConfigConsumer {...props} />
    </AppLayout>
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
    group: CONFIG_GROUP_CONTACTS,
  });

  if (!configsPayload || !props.currentCompany) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      assetConfigs: castDbData(configsPayload.assetConfigs),
      normalConfigs: castDbData(configsPayload.normalConfigs),
      currentCompany: props.currentCompany,
    },
  };
};

export default Config;
