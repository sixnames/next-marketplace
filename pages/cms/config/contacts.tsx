import ConfigsFormTemplate from 'components/FormTemplates/ConfigsFormTemplate';
import Inner from 'components/Inner/Inner';
import { CONFIG_DEFAULT_COMPANY_SLUG, CONFIG_GROUP_CONTACTS } from 'config/common';
import AppConfigsLayout, { ConfigPageInterface } from 'layout/AppLayout/AppConfigsLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getConfigPageData } from 'lib/configsUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ assetConfigs, normalConfigs }) => {
  return (
    <AppConfigsLayout isCms={true}>
      <Inner>
        <ConfigsFormTemplate assetConfigs={assetConfigs} normalConfigs={normalConfigs} />
      </Inner>
    </AppConfigsLayout>
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
    companyId: CONFIG_DEFAULT_COMPANY_SLUG,
    group: CONFIG_GROUP_CONTACTS,
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
