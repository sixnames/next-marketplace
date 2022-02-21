import ConfigsFormTemplate, {
  ConfigsFormTemplateInterface,
} from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleCompanyLayout from 'components/layout/console/ConsoleCompanyLayout';
import { getConfigPageData } from 'db/ssr/configs/getConfigPageData';
import { getConfigEventRubrics } from 'db/ssr/events/getConfigEventRubrics';
import { getConfigRubrics } from 'db/ssr/rubrics/getConfigRubrics';
import { CompanyInterface } from 'db/uiInterfaces';
import { CONFIG_GROUP_UI } from 'lib/config/common';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ConfigConsumerInterface extends ConfigsFormTemplateInterface {
  pageCompany: CompanyInterface;
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  pageCompany,
  assetConfigs,
  normalConfigs,
  rubrics,
  eventRubrics,
}) => {
  return (
    <ConsoleCompanyLayout pageCompany={pageCompany}>
      <Inner>
        <ConfigsFormTemplate
          assetConfigs={assetConfigs}
          normalConfigs={normalConfigs}
          rubrics={rubrics}
          eventRubrics={eventRubrics}
        />
      </Inner>
    </ConsoleCompanyLayout>
  );
};

interface ConfigPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ConfigConsumerInterface {}

const Config: NextPage<ConfigPageInterface> = ({ layoutProps, ...props }) => {
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

  const rubrics = await getConfigRubrics(props.sessionLocale);
  const eventRubrics = await getConfigEventRubrics({
    locale: props.sessionLocale,
    companyId: `${query.companyId}`,
  });

  return {
    props: {
      ...props,
      assetConfigs: castDbData(configsPayload.assetConfigs),
      normalConfigs: castDbData(configsPayload.normalConfigs),
      pageCompany: props.layoutProps.pageCompany,
      rubrics: castDbData(rubrics),
      eventRubrics: castDbData(eventRubrics),
    },
  };
};

export default Config;
