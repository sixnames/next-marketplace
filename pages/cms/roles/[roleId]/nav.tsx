import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner/Inner';
import Table, { TableColumn } from 'components/Table/Table';
import Title from 'components/Title/Title';
import { ROUTE_CMS, SORT_ASC, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { COL_NAV_ITEMS, COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { NavGroupInterface, RoleInterface, NavItemInterface } from 'db/uiInterfaces';
import { useUpdateRoleNavMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ClientNavItemInterface } from 'types/clientTypes';

interface RoleNavConsumerInterface {
  role: RoleInterface;
  navItemGroups: NavGroupInterface[];
}

const RoleNavConsumer: React.FC<RoleNavConsumerInterface> = ({ role, navItemGroups }) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [updateRoleNavMutation] = useUpdateRoleNavMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRoleNav),
    onError: onErrorCallback,
  });

  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'role-details',
        path: `${ROUTE_CMS}/roles/${role._id}`,
        exact: true,
      },
      {
        name: 'Правила',
        testId: 'role-rules',
        path: `${ROUTE_CMS}/roles/${role._id}/rules`,
        exact: true,
      },
      {
        name: 'Навигация',
        testId: 'role-nav',
        path: `${ROUTE_CMS}/roles/${role._id}/nav`,
        exact: true,
      },
    ];
  }, [role._id]);

  const columns: TableColumn<NavItemInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Разрешено',
      render: ({ dataItem }) => {
        const checked = role.allowedAppNavigation.some((navId) => {
          return navId === dataItem._id;
        });

        return (
          <Checkbox
            checked={checked}
            name={'allow'}
            onChange={(e: React.ChangeEvent<any>) => {
              showLoading();
              updateRoleNavMutation({
                variables: {
                  input: {
                    roleId: role._id,
                    navItemId: dataItem._id,
                    checked: e.target.checked,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{role.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{role.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />

      <Inner testId={'role-nav-list'}>
        {navItemGroups.map((navGroup) => {
          return (
            <div key={navGroup._id} className='mb-8'>
              <div className='mb-4 font-medium text-lg'>{navGroup.name}</div>
              <div className='overflow-x-auto overflow-y-hidden'>
                <Table<NavItemInterface> columns={columns} data={navGroup.children || []} />
              </div>
            </div>
          );
        })}
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleNavPageInterface extends PagePropsInterface, RoleNavConsumerInterface {}

const RoleNav: NextPage<RoleNavPageInterface> = ({ pageUrls, role, navItemGroups }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RoleNavConsumer role={role} navItemGroups={navItemGroups} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RoleNavPageInterface>> => {
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !context.query.roleId) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
  const rolesCollection = db.collection<RoleInterface>(COL_ROLES);
  const navItemsCollection = db.collection<NavGroupInterface>(COL_NAV_ITEMS);
  const roleQueryResult = await rolesCollection.findOne({
    _id: new ObjectId(`${context.query.roleId}`),
  });

  if (!roleQueryResult) {
    return {
      notFound: true,
    };
  }

  // get grouped nav items ast
  const navItemGroupsAggregationResult = await navItemsCollection
    .aggregate([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
      {
        $group: {
          _id: '$navGroup',
          children: {
            $push: {
              _id: '$_id',
              nameI18n: '$nameI18n',
              slug: '$slug',
              path: '$path',
              index: '$index',
              parentId: '$parentId',
            },
          },
        },
      },
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const navItemGroups = navItemGroupsAggregationResult.map((navItemsGroup) => {
    return {
      ...navItemsGroup,
      name: getConstantTranslation(`navGroups.${navItemsGroup._id}.${props.sessionLocale}`),
      children: (navItemsGroup.children || []).map((navItem) => {
        return {
          ...navItem,
          name: getFieldStringLocale(navItem.nameI18n, props.sessionLocale),
        };
      }),
    };
  });

  const role: RoleInterface = {
    ...roleQueryResult,
    name: getFieldStringLocale(roleQueryResult.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      role: castDbData(role),
      navItemGroups: castDbData(navItemGroups),
    },
  };
};

export default RoleNav;
