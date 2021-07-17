import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { CONFIG_GROUP_UI, ROUTE_CMS } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import { ConfigPageInterface } from 'layout/AppLayout/AppConfigsLayout';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsCompanyLayout from 'layout/CmsLayout/CmsCompanyLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ConfigConsumerInterface extends ConfigPageInterface {
  currentCompany?: CompanyInterface | null;
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  assetConfigs,
  normalConfigs,
  currentCompany,
}) => {
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Интерфейс',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: `${ROUTE_CMS}/companies/${currentCompany?._id}`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-config-ui'}>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface ConfigInterface
  extends PagePropsInterface,
    ConfigPageInterface,
    ConfigConsumerInterface {}

const Config: NextPage<ConfigInterface> = (props) => {
  return (
    <CmsLayout title={'Настройки сайта'} {...props}>
      <ConfigConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: `${query.companyId}`,
    group: CONFIG_GROUP_UI,
  });

  if (!configsPayload) {
    return {
      notFound: true,
    };
  }

  const { assetConfigs, normalConfigs, currentCompany } = configsPayload;

  if (!currentCompany) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      assetConfigs: castDbData(assetConfigs),
      normalConfigs: castDbData(normalConfigs),
      currentCompany: castDbData(currentCompany),
    },
  };
};

export default Config;
