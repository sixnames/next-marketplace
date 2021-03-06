import * as React from 'react';
import { RoleInterface } from '../../db/uiInterfaces';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikSelect from '../FormElements/Select/FormikSelect';

interface UserMainFieldsInterface {
  roles: RoleInterface[];
}

const UserMainFields: React.FC<UserMainFieldsInterface> = ({ roles }) => {
  return (
    <React.Fragment>
      <FormikInput name={'lastName'} label={'Фамилия'} testId={'lastName'} showInlineError />
      <FormikInput name={'name'} label={'Имя'} testId={'name'} showInlineError />
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
