import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import RoleMainFields from 'components/FormTemplates/RoleMainFields';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateRoleMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ClientNavItemInterface } from 'types/clientTypes';
import { updateRoleSchema } from 'validation/roleSchema';

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
        <Title>{role.name}</Title>
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
                  <Button size={'small'} type={'submit'} testId={'role-submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface RoleDetailsInterface extends PagePropsInterface, RoleDetailsConsumerInterface {}

const RoleDetails: NextPage<RoleDetailsInterface> = ({ pageUrls, role }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RoleDetailsConsumer role={role} />
    </CmsLayout>
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
