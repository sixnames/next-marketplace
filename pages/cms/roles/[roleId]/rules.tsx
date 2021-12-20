import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import WpCheckbox from '../../../../components/FormElements/Checkbox/WpCheckbox';
import FormikIndividualSearch from '../../../../components/FormElements/Search/FormikIndividualSearch';
import Inner from '../../../../components/Inner';
import WpTable, { WpTableColumn } from '../../../../components/WpTable';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CMS } from '../../../../config/common';
import { COL_ROLES } from '../../../../db/collectionNames';
import { getDatabase } from '../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  RoleInterface,
  RoleRuleInterface,
} from '../../../../db/uiInterfaces';
import { useUpdateRoleRuleMutation } from '../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import AppSubNav from '../../../../layout/AppSubNav';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../lib/i18n';
import { getRoleRulesAst } from '../../../../lib/roleUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';
import { ClientNavItemInterface } from '../../../../types/clientTypes';

interface RoleRulesConsumerInterface {
  role: RoleInterface;
}

const RoleRulesConsumer: React.FC<RoleRulesConsumerInterface> = ({ role }) => {
  const [rules, setRules] = React.useState<RoleRuleInterface[]>([]);
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  React.useEffect(() => {
    setRules(role.rules || []);
  }, [role.rules]);

  const [updateRoleRuleMutation] = useUpdateRoleRuleMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateRoleRule),
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

  const columns: WpTableColumn<RoleRuleInterface>[] = [
    {
      headTitle: 'Действие',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Разрешено',
      accessor: 'allow',
      render: ({ cellData, dataItem }) => {
        return (
          <WpCheckbox
            testId={`${dataItem.name}`}
            checked={cellData}
            name={'allow'}
            onChange={(e: React.ChangeEvent<any>) => {
              showLoading();
              updateRoleRuleMutation({
                variables: {
                  input: {
                    _id: dataItem._id,
                    allow: e.target.checked,
                    slug: dataItem.slug,
                    descriptionI18n: dataItem.descriptionI18n,
                    nameI18n: dataItem.nameI18n,
                    roleId: dataItem.roleId,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Правила`,
    config: [
      {
        name: 'Список ролей',
        href: `${ROUTE_CMS}/roles`,
      },
      {
        name: `${role.name}`,
        href: `${ROUTE_CMS}/roles/${role._id}`,
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

      <Inner testId={'role-rules-list'}>
        <FormikIndividualSearch
          onSubmit={(value) => {
            const filteredRules = (role.rules || []).filter((rule) => {
              const finalName = `${rule.name}`.toLowerCase();
              const finalValue = value.toLowerCase();
              const reg = RegExp(finalValue, 'g');
              return finalName.search(reg) > -1;
            });
            setRules(filteredRules);
          }}
          onReset={() => {
            setRules(role.rules || []);
          }}
        />

        <div className='overflow-x-auto overflow-y-hidden'>
          <WpTable<RoleRuleInterface> columns={columns} data={rules} />
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleRulesPageInterface
  extends GetAppInitialDataPropsInterface,
    RoleRulesConsumerInterface {}

const RoleRules: NextPage<RoleRulesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RoleRulesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RoleRulesPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props || !context.query.roleId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
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
