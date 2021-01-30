import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import TabsContent from 'components/TabsContent/TabsContent';
import { useGetRoleQuery } from 'generated/apolloComponents';
import useTabsConfig from 'hooks/useTabsConfig';
import { useRouter } from 'next/router';
import * as React from 'react';
import RoleDetails from 'routes/Role/RoleDetails';
import { NavItemInterface } from 'types/clientTypes';

const RoleRoute: React.FC = () => {
  const { query } = useRouter();
  const { roleId } = query;
  const { generateTabsConfig } = useTabsConfig();
  const { data, loading, error } = useGetRoleQuery({
    variables: {
      _id: `${roleId}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getRole) {
    return <RequestError />;
  }

  const { getRole } = data;

  // Role nav tabs config
  const navConfig: NavItemInterface[] = generateTabsConfig({
    config: [
      {
        name: 'Детали',
        testId: 'details',
      },
    ],
  });

  return (
    <DataLayout
      filterResultNavConfig={navConfig}
      title={getRole.name}
      filterResult={() => (
        <DataLayoutContentFrame>
          <TabsContent>
            <RoleDetails role={getRole} />
          </TabsContent>
        </DataLayoutContentFrame>
      )}
    />
  );
};

export default RoleRoute;
