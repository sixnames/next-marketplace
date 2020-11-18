import React from 'react';
import DataLayout from '../../components/DataLayout/DataLayout';
import useTabsConfig from '../../hooks/useTabsConfig';
import { useGetCompanyQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { NavItemInterface } from '../../types';
import TabsContent from '../../components/TabsContent/TabsContent';
import CompanyDetails from './CompanyDetails';
import CompanyShops from './CompanyShops';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useRouter } from 'next/router';

const CompanyRoute: React.FC = () => {
  const { query } = useRouter();
  const { companyId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetCompanyQuery({
    fetchPolicy: 'network-only',
    skip: !companyId,
    variables: {
      id: `${companyId}`,
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
        name: 'Магазины',
        testId: 'shops',
      },
    ],
  });

  return (
    <DataLayout
      title={company.nameString}
      filterResultNavConfig={navConfig}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <CompanyDetails company={company} />
            <CompanyShops />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

export default CompanyRoute;
