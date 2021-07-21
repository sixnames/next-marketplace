import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner';
import { DEFAULT_COMPANY_SLUG, CONFIG_GROUP_GLOBALS } from 'config/common';
import ConsoleConfigsLayout, { ConfigPageInterface } from 'layout/console/ConsoleConfigsLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ assetConfigs, normalConfigs }) => {
  return (
    <ConsoleConfigsLayout isCms={true}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </ConsoleConfigsLayout>
  );
};

const Config: NextPage<ConfigPageInterface> = (props) => {
  const { pageUrls } = props;
  return (
    <CmsLayout title={'Настройки сайта'} pageUrls={pageUrls}>
      <ConfigConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const configsPayload = await getConfigPageData({
    companyId: DEFAULT_COMPANY_SLUG,
    group: CONFIG_GROUP_GLOBALS,
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
    },
  };
};

export default Config;
