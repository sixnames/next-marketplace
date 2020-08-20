import React from 'react';
import { RoleContentInterface } from './RolesContent';
import InnerWide from '../../components/Inner/InnerWide';
import { Form, Formik } from 'formik';
import FormikTranslationsInput from '../../components/FormElements/Input/FormikTranslationsInput';
import FormikTextarea from '../../components/FormElements/Textarea/FormikTextarea';
import FormikCheckboxLine from '../../components/FormElements/Checkbox/FormikCheckboxLine';
import ModalButtons from '../../components/Modal/ModalButtons';
import Button from '../../components/Buttons/Button';
import { useLanguageContext } from '../../context/languageContext';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateRoleSchema } from '../../validation/roleSchema';
import { useUpdateRoleMutation } from '../../generated/apolloComponents';
import { GET_ALL_ROLES_QUERY, GET_ROLE_QUERY } from '../../graphql/query/roles';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';

const RoleDetails: React.FC<RoleContentInterface> = ({ role }) => {
  const { getLanguageFieldInitialValue, getLanguageFieldInputValue } = useLanguageContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({});
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
          id: role.id,
        },
      },
      {
        query: GET_ALL_ROLES_QUERY,
      },
    ],
  });

  const { name, description, isStuff, id } = role;
  return (
    <InnerWide>
      <Formik
        initialValues={{
          id,
          name: getLanguageFieldInitialValue(name),
          description,
          isStuff,
        }}
        validationSchema={validationSchema}
        onSubmit={({ name, description, isStuff, id }) => {
          showLoading();
          updateRoleMutation({
            variables: {
              input: {
                id,
                name: getLanguageFieldInputValue(name),
                description,
                isStuff,
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Введите название'}
                name={'name'}
                testId={'name'}
                showInlineError
                isRequired
              />

              <FormikTextarea
                name={'description'}
                testId={'description'}
                label={'Описание'}
                isRequired
                showInlineError
              />

              <FormikCheckboxLine
                testId={'isStuff'}
                label={'Является персоналом'}
                name={'isStuff'}
              />

              <ModalButtons>
                <Button type={'submit'} testId={'role-submit'}>
                  {name ? 'Изменить' : 'Создать'}
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

export default RoleDetails;
