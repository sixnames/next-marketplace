import Button from 'components/Buttons/Button';
import RoleMainFields from 'components/FormTemplates/RoleMainFields';
import Inner from 'components/Inner/Inner';
import { Form, Formik } from 'formik';
import { CmsRoleFragment, useUpdateRoleMutation } from 'generated/apolloComponents';
import { GET_ROLE_QUERY } from 'graphql/query/rolesQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
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

export default RoleDetails;
