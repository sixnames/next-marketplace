import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import ConsoleConfigsLayout, {
  ConfigPageInterface,
} from 'components/layout/console/ConsoleConfigsLayout';
import { getConfigPageData } from 'db/ssr/configs/getConfigPageData';
import { getConfigRubrics } from 'db/ssr/rubrics/getConfigRubrics';
import { CONFIG_GROUP_UI, DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({
  assetConfigs,
  normalConfigs,
  rubrics,
}) => {
  return (
    <ConsoleConfigsLayout>
      <Inner>
        <ConfigsFormTemplate
          assetConfigs={assetConfigs}
          normalConfigs={normalConfigs}
          rubrics={rubrics}
        />
      </Inner>
    </ConsoleConfigsLayout>
  );
};

interface ConfigInterface extends GetAppInitialDataPropsInterface, ConfigPageInterface {}

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
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: DEFAULT_COMPANY_SLUG,
    group: CONFIG_GROUP_UI,
  });

  if (!configsPayload) {
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
      rubrics: castDbData(rubrics),
    },
  };
};

export default Config;
