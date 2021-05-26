import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner/Inner';
import Table, { TableColumn } from 'components/Table/Table';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface, RoleRuleInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import AppSubNav from 'layout/AppLayout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { getRoleRulesAst } from 'lib/roleUtils';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { NavItemInterface } from 'types/clientTypes';

interface RoleRulesConsumerInterface {
  role: RoleInterface;
}

const RoleRulesConsumer: React.FC<RoleRulesConsumerInterface> = ({ role }) => {
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
    ];
  }, [role._id]);

  const columns: TableColumn<RoleRuleInterface>[] = [
    {
      headTitle: 'Действие',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Разрешено',
      accessor: 'allow',
      render: ({ cellData }) => {
        return (
          <Checkbox
            value={cellData}
            name={'allow'}
            onChange={(e: React.ChangeEvent<any>) => {
              console.log(e.target.checked);
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

      <Inner testId={'role-rules-list'}>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<RoleRuleInterface> columns={columns} data={role.rules || []} />
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleRulesPageInterface extends PagePropsInterface, RoleRulesConsumerInterface {}

const RoleRules: NextPage<RoleRulesPageInterface> = ({ pageUrls, role }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RoleRulesConsumer role={role} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RoleRulesPageInterface>> => {
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !context.query.roleId) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
  const rolesCollection = db.collection<RoleInterface>(COL_ROLES);
  const roleQueryResult = await rolesCollection.findOne({
    _id: new ObjectId(`${context.query.roleId}`),
  });

  if (!roleQueryResult) {
    return {
      notFound: true,
    };
  }

  const rules = await getRoleRulesAst({
    roleId: roleQueryResult._id,
    locale: props.sessionLocale,
  });

  const role: RoleInterface = {
    ...roleQueryResult,
    name: getFieldStringLocale(roleQueryResult.nameI18n, props.sessionLocale),
    rules,
  };

  return {
    props: {
      ...props,
      role: castDbData(role),
    },
  };
};

export default RoleRules;
