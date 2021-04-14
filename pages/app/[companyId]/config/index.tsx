import Inner from 'components/Inner/Inner';
import { CONFIG_GROUP_GLOBALS } from 'config/common';
import { COL_COMPANIES, COL_CONFIGS } from 'db/collectionNames';
import { CompanyModel, ConfigModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import AppConfigsLayout, { ConfigPageInterface } from 'layout/AppLayout/AppConfigsLayout';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getConfigTemplates } from 'lib/getConfigTemplates';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const ConfigConsumer: React.FC<ConfigPageInterface> = ({ configTemplates }) => {
  console.log(configTemplates);
  return (
    <AppConfigsLayout>
      <Inner>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam modi officiis quasi
        sint vero. Consequatur consequuntur et, itaque iusto pariatur suscipit! Cumque eos excepturi
        maiores molestias quisquam! Eos, fugiat fugit!
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
  const db = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const company = await companiesCollection.findOne({ _id: new ObjectId(`${query.companyId}`) });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const companySlug = company.slug;
  const companyConfigs = await configsCollection
    .find({ companySlug, group: CONFIG_GROUP_GLOBALS })
    .toArray();
  const initialConfigTemplates = getConfigTemplates({
    companySlug,
  });
  const initialConfigsGroup = initialConfigTemplates.filter(({ group }) => {
    return group === CONFIG_GROUP_GLOBALS;
  });

  const configTemplates = initialConfigsGroup.reduce((acc: ConfigModel[], template) => {
    const companyConfig = companyConfigs.find(({ slug }) => slug === template.slug);
    if (companyConfig) {
      return [...acc, companyConfig];
    }
    return [...acc, template];
  }, []);

  return {
    props: {
      ...props,
      configTemplates: castDbData(configTemplates),
    },
  };
};

export default Config;
