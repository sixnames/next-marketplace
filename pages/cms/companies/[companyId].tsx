import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import TabsContent from 'components/TabsContent/TabsContent';
import { useGetCompanyQuery } from 'generated/apolloComponents';
import useTabsConfig from 'hooks/useTabsConfig';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import CompanyAssets from 'routes/Company/CompanyAssets';
import CompanyDetails from 'routes/Company/CompanyDetails';
import CompanyShops from 'routes/Company/CompanyShops';
import { NavItemInterface } from 'types/clientTypes';

const CompanyRoute: React.FC = () => {
  const { query } = useRouter();
  const { companyId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetCompanyQuery({
    fetchPolicy: 'network-only',
    skip: !companyId,
    variables: {
      _id: `${companyId}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getCompany) {
    return <RequestError />;
  }

  const company = data.getCompany;

  // Company nav tabs config
  const navConfig: NavItemInterface[] = generateTabsConfig({
    config: [
      {
        name: 'Детали',
        testId: 'details',
      },
      {
        name: 'Изображения',
        testId: 'assets',
      },
      {
        name: 'Магазины',
        testId: 'shops',
      },
    ],
  });

  return (
    <DataLayout
      title={company.name}
      filterResultNavConfig={navConfig}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <CompanyDetails company={company} />
            <CompanyAssets company={company} />
            <CompanyShops company={company} />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

const Company: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CompanyRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Company;
