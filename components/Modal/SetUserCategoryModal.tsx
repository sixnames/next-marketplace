import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import { CompanyInterface } from 'db/uiInterfaces';
import { useSetUserCategoryMutation } from 'hooks/mutations/useUserMutations';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import Button from 'components/Button';
import { Formik, Form } from 'formik';

export interface SetUserCategoryModalInterface {
  userId: string;
  companies: CompanyInterface[];
  hideCompaniesSelect?: boolean;
  companyId?: string;
}

const SetUserCategoryModal: React.FC<SetUserCategoryModalInterface> = ({
  userId,
  companyId,
  companies,
  hideCompaniesSelect,
}) => {
  const [setUserCategoryMutation] = useSetUserCategoryMutation();

  const initialValues = {
    userId,
    companyId: companyId || '',
    categoryId: '',
  };

  return (
    <ModalFrame testId={'set-user-category-modal'}>
      <ModalTitle>Выберите категорию</ModalTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          setUserCategoryMutation({
            userId: values.userId,
            categoryId: values.categoryId,
          }).catch(console.log);
        }}
      >
        {({ values }) => {
          const currentCompany = companies.find(({ _id }) => {
            return `${_id}` === `${values.companyId}`;
          });
          const categoryOptions: SelectOptionInterface[] = currentCompany?.categories || [];

          return (
            <Form>
              {hideCompaniesSelect ? null : (
                <FormikSelect
                  testId={'companyId'}
                  firstOption={true}
                  label={'Компания'}
                  name={'companyId'}
                  options={companies}
                />
              )}

              <FormikSelect
                testId={'categoryId'}
                firstOption={true}
                label={'Категория'}
                name={'categoryId'}
                disabled={!values.companyId}
                options={categoryOptions}
              />

              <ModalButtons>
                <Button
                  testId={'submit-user-category'}
                  disabled={!values.companyId || !values.categoryId}
                  type={'submit'}
                >
                  Сохранить
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default SetUserCategoryModal;
