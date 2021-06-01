import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner/Inner';
import { CONFIG_GROUP_GLOBALS } from 'config/common';
import AppConfigsLayout, { ConfigPageInterface } from 'layout/AppLayout/AppConfigsLayout';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getCompanyAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ assetConfigs, normalConfigs }) => {
  const router = useRouter();
  return (
    <AppConfigsLayout companyId={`${router.query.companyId}`}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </AppConfigsLayout>
  );
};

const Config: NextPage<ConfigPageInterface> = (props) => {
  const { pageUrls } = props;
  return (
    <AppLayout title={'Настройки сайта'} pageUrls={pageUrls}>
      <ConfigConsumer {...props} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ConfigPageInterface>> => {
  const { query } = context;
  const { props } = await getCompanyAppInitialData({ context });
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

  return {
    props: {
      ...props,
      assetConfigs: castDbData(configsPayload.assetConfigs),
      normalConfigs: castDbData(configsPayload.normalConfigs),
    },
  };
};

export default Config;
