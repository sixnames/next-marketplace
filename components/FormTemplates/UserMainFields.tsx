import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { RoleInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface UserMainFieldsInterface {
  roles: RoleInterface[];
}

const UserMainFields: React.FC<UserMainFieldsInterface> = ({ roles }) => {
  return (
    <React.Fragment>
      <FormikInput name={'name'} label={'Имя'} testId={'name'} showInlineError />
      <FormikInput name={'lastName'} label={'Фамилия'} testId={'lastName'} showInlineError />
      <FormikInput name={'secondName'} label={'Отчество'} testId={'secondName'} showInlineError />
      <FormikInput name={'email'} label={'Email'} testId={'email'} type={'email'} showInlineError />
      <FormikInput name={'phone'} label={'Телефон'} testId={'phone'} type={'tel'} showInlineError />
      <FormikSelect
        testId={'role'}
        name={'roleId'}
        label={'Роль'}
        firstOption
        options={roles}
        showInlineError
      />
    </React.Fragment>
  );
};

export default UserMainFields;
