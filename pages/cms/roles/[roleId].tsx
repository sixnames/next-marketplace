import Button from 'components/Buttons/Button';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RoleMainFields from 'components/FormTemplates/RoleMainFields';
import Inner from 'components/Inner/Inner';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import TabsContent from 'components/TabsContent/TabsContent';
import { Form, Formik } from 'formik';
import {
  CmsRoleFragment,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from 'generated/apolloComponents';
import { GET_ROLE_QUERY } from 'graphql/query/rolesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useTabsConfig from 'hooks/useTabsConfig';
import useValidationSchema from 'hooks/useValidationSchema';
import { useRouter } from 'next/router';
import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import { NavItemInterface } from 'types/clientTypes';
import { updateRoleSchema } from 'validation/roleSchema';

interface RoleDetailsInterface {
  role: CmsRoleFragment;
}

const RoleDetails: React.FC<RoleDetailsInterface> = ({ role }) => {
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks();
  const validationSchema = useValidationSchema({
    schema: updateRoleSchema,
  });
  const [updateRoleMutation] = useUpdateRoleMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRole),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: GET_ROLE_QUERY,
        variables: {
          _id: role._id,
        },
      },
    ],
  });

  return (
    <Inner>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          roleId: role._id,
          nameI18n: role.nameI18n,
          description: role.description,
          isStuff: role.isStuff,
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

              <Button type={'submit'} testId={'role-submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

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

const Role: NextPage = () => {
  return (
    <AppLayout>
      <RoleRoute />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default Role;
