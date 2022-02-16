import WpCheckbox from 'components/FormElements/Checkbox/WpCheckbox';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  NavGroupInterface,
  NavItemInterface,
  RoleInterface,
} from 'db/uiInterfaces';
import { useUpdateRoleNavMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { SORT_ASC, SORT_DESC } from 'lib/config/common';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
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

  const columns: WpTableColumn<NavItemInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Разрешено',
      render: ({ dataItem }) => {
        const checked = role.allowedAppNavigation.some((navPath) => {
          return navPath === dataItem.path;
        });

        return (
          <WpCheckbox
            testId={`${dataItem.navGroup}-${dataItem.name}`}
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

  const links = getProjectLinks({
    roleId: role._id,
  });

  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'role-details',
      path: links.cms.roles.roleId.url,
      exact: true,
    },
    {
      name: 'Правила',
      testId: 'role-rules',
      path: links.cms.roles.roleId.rules.url,
      exact: true,
    },
    {
      name: 'Навигация',
      testId: 'role-nav',
      path: links.cms.roles.roleId.nav.url,
      exact: true,
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Навигация`,
    config: [
      {
        name: 'Список ролей',
        href: links.cms.roles.url,
      },
      {
        name: `${role.name}`,
        href: links.cms.roles.roleId.url,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{role.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{role.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />

      <Inner testId={'role-nav-list'}>
        {navItemGroups.map((navGroup) => {
          return (
            <div key={navGroup._id} className='mb-8'>
              <div className='mb-4 text-lg font-medium'>{navGroup.name}</div>
              <div className='overflow-x-auto overflow-y-hidden'>
                <WpTable<NavItemInterface> columns={columns} data={navGroup.children || []} />
              </div>
            </div>
          );
        })}
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleNavPageInterface extends GetAppInitialDataPropsInterface, RoleNavConsumerInterface {}

const RoleNav: NextPage<RoleNavPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RoleNavConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RoleNavPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props || !context.query.roleId) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const rolesCollection = collections.rolesCollection();
  const navItemsCollection = collections.navItemsCollection();
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
    .aggregate<NavItemInterface>([
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
              navGroup: '$navGroup',
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
