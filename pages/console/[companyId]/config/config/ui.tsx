import ConfigsFormTemplate, {
  ConfigsFormTemplateInterface,
} from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { CONFIG_GROUP_UI } from 'config/common';
import { getConfigRubrics } from 'db/dao/configs/getConfigRubrics';
import { CompanyInterface } from 'db/uiInterfaces';
import ConsoleCompanyLayout from 'layout/console/ConsoleCompanyLayout';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ConfigConsumerInterface extends ConfigsFormTemplateInterface {
  currentCompany?: CompanyInterface | null;
}

const ConfigConsumer: React.FC<ConfigConsumerInterface> = ({
  currentCompany,
  assetConfigs,
  normalConfigs,
  rubrics,
}) => {
  return (
    <ConsoleCompanyLayout company={currentCompany}>
      <Inner>
        <ConfigsFormTemplate
          assetConfigs={assetConfigs}
          normalConfigs={normalConfigs}
          rubrics={rubrics}
        />
      </Inner>
    </ConsoleCompanyLayout>
  );
};

interface ConfigPageInterface extends PagePropsInterface, ConfigConsumerInterface {}

const Config: NextPage<ConfigPageInterface> = (props) => {
  const { pageUrls, pageCompany } = props;
  return (
    <ConsoleLayout title={'Настройки сайта'} pageUrls={pageUrls} company={pageCompany}>
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
    group: CONFIG_GROUP_UI,
  });

  if (!configsPayload || !props.pageCompany) {
    return {
      notFound: true,
    };
  }

  const rubrics = await getConfigRubrics(props.sessionLocale);

  return {
    props: {
      ...props,
      assetConfigs: castDbData(configsPayload.assetConfigs),
      normalConfigs: castDbData(configsPayload.normalConfigs),
      pageCompany: props.pageCompany,
      rubrics: castDbData(rubrics),
    },
  };
};

export default Config;
