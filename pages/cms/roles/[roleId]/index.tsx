import { Form, Formik } from 'formik';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import FixedButtons from '../../../../components/button/FixedButtons';
import WpButton from '../../../../components/button/WpButton';
import RoleMainFields from '../../../../components/FormTemplates/RoleMainFields';
import Inner from '../../../../components/Inner';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CMS } from '../../../../config/common';
import { COL_ROLES } from '../../../../db/collectionNames';
import { getDatabase } from '../../../../db/mongodb';
import { AppContentWrapperBreadCrumbs, RoleInterface } from '../../../../db/uiInterfaces';
import { useUpdateRoleMutation } from '../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../../hooks/useValidationSchema';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import AppSubNav from '../../../../layout/AppSubNav';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';
import { ClientNavItemInterface } from '../../../../types/clientTypes';
import { updateRoleSchema } from '../../../../validation/roleSchema';

interface RoleDetailsConsumerInterface {
  role: RoleInterface;
}

const RoleDetailsConsumer: React.FC<RoleDetailsConsumerInterface> = ({ role }) => {
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: updateRoleSchema,
  });
  const [updateRoleMutation] = useUpdateRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRole),
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${role.name}`,
    config: [
      {
        name: 'Список ролей',
        href: `${ROUTE_CMS}/roles`,
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

      <Inner testId={'role-details-list'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            roleId: role._id,
            nameI18n: role.nameI18n,
            descriptionI18n: role.descriptionI18n,
            isStaff: role.isStaff || false,
            isCompanyStaff: role.isCompanyStaff || false,
            isModerator: role.isModerator || false,
            isContentManager: role.isContentManager || false,
            isInspector: role.isInspector || false,
            showAdminUiInCatalogue: role.showAdminUiInCatalogue || false,
          }}
          onSubmit={(values) => {
            showLoading();
            updateRoleMutation({
              variables: {
                input: values,
              },
            }).catch((e) => console.log(e));
          }}
        >
          {() => {
            return (
              <Form>
                <RoleMainFields />

                <FixedButtons>
                  <WpButton size={'small'} type={'submit'} testId={'role-submit'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleDetailsInterface
  extends GetAppInitialDataPropsInterface,
    RoleDetailsConsumerInterface {}

const RoleDetails: NextPage<RoleDetailsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RoleDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RoleDetailsInterface>> => {
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

export default RoleDetails;
