import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import RoleMainFields from 'components/FormTemplates/RoleMainFields';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { COL_ROLES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RoleInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateRoleMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
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

  const navConfig = React.useMemo<NavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'role-details',
        path: `${ROUTE_CMS}/roles/${role._id}`,
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

      <Inner testId={'role-details'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            roleId: role._id,
            nameI18n: role.nameI18n,
            description: role.description,
            isStaff: role.isStaff,
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
