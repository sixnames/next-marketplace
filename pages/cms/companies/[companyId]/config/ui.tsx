import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfigPageInterface } from 'components/layout/console/ConsoleConfigsLayout';
import { getConfigPageData } from 'db/ssr/configs/getConfigPageData';
import { getConfigEventRubrics } from 'db/ssr/events/getConfigEventRubrics';
import { getConfigRubrics } from 'db/ssr/rubrics/getConfigRubrics';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { CONFIG_GROUP_UI } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ConfigConsumerInterface extends ConfigPageInterface {
  pageCompany: CompanyInterface;
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  assetConfigs,
  normalConfigs,
  pageCompany,
  rubrics,
  eventRubrics,
}) => {
  const links = getProjectLinks({
    companyId: pageCompany?._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Интерфейс',
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.cms.companies.companyId.url,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-config-ui'}>
        <ConfigsFormTemplate
          assetConfigs={assetConfigs}
          normalConfigs={normalConfigs}
          rubrics={rubrics}
          eventRubrics={eventRubrics}
        />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface ConfigInterface
  extends GetAppInitialDataPropsInterface,
    ConfigPageInterface,
    ConfigConsumerInterface {}

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

  const rubrics = await getConfigRubrics(props.sessionLocale);
  const eventRubrics = await getConfigEventRubrics({
    locale: props.sessionLocale,
    companyId: `${query.companyId}`,
  });

  return {
    props: {
      ...props,
      assetConfigs: castDbData(assetConfigs),
      normalConfigs: castDbData(normalConfigs),
      pageCompany: castDbData(currentCompany),
      rubrics: castDbData(rubrics),
      eventRubrics: castDbData(eventRubrics),
    },
  };
};

export default Config;
