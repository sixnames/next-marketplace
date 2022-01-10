import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConfigsFormTemplate from '../../../../../components/FormTemplates/ConfigsFormTemplate';
import Inner from '../../../../../components/Inner';
import { CONFIG_GROUP_GLOBALS } from '../../../../../config/common';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from '../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { ConfigPageInterface } from '../../../../../layout/console/ConsoleConfigsLayout';
import { getConfigPageData } from '../../../../../lib/configsUtils';
import { getCmsCompanyLinks } from '../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../lib/ssrUtils';

interface ConfigConsumerInterface extends ConfigPageInterface {
  pageCompany: CompanyInterface;
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  assetConfigs,
  normalConfigs,
  pageCompany,
}) => {
  const { root, parentLink } = getCmsCompanyLinks({
    companyId: pageCompany?._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Основные настройки',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: root,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-config-globals'}>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface ConfigInterface extends GetAppInitialDataPropsInterface, ConfigConsumerInterface {}

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
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: `${query.companyId}`,
    group: CONFIG_GROUP_GLOBALS,
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
      pageCompany: castDbData(currentCompany),
    },
  };
};

export default Config;
