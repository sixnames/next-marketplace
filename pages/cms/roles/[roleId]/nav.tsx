import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_NAV_ITEMS, COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { NavGroupInterface, RoleInterface } from 'db/uiInterfaces';
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
import { NavItemInterface } from 'types/clientTypes';

interface RoleNavConsumerInterface {
  role: RoleInterface;
}

const RoleNavConsumer: React.FC<RoleNavConsumerInterface> = ({ role }) => {
  const navConfig = React.useMemo<NavItemInterface[]>(() => {
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, aspernatur at
        atque corporis dignissimos ex id illum inventore obcaecati perspiciatis, quos repellendus
        reprehenderit repudiandae sapiente sequi sunt tenetur velit?
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleNavPageInterface extends PagePropsInterface, RoleNavConsumerInterface {}

const RoleNav: NextPage<RoleNavPageInterface> = ({ pageUrls, role }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RoleNavConsumer role={role} />
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
          index: SORT_DESC,
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
    ])
    .toArray();
  console.log(JSON.stringify(navItemGroupsAggregationResult, null, 2));

  const role: RoleInterface = {
    ...roleQueryResult,
    name: getFieldStringLocale(roleQueryResult.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      role: castDbData(role),
    },
  };
};

export default RoleNav;
