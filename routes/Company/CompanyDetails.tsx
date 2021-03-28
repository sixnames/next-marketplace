import Button from 'components/Buttons/Button';
import CompanyMainFields, {
  CompanyFormMainValuesInterface,
} from 'components/FormTemplates/CompanyMainFields';
import { phoneToRaw } from 'lib/phoneUtils';
import * as React from 'react';
import { CompanyFragment, useUpdateCompanyMutation } from 'generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import useValidationSchema from '../../hooks/useValidationSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { COMPANY_QUERY } from 'graphql/query/companiesQueries';
import { omit } from 'lodash';
import { removeApolloFields } from 'lib/apolloHelpers';
import { updateCompanyClientSchema } from 'validation/companySchema';
import { Form, Formik } from 'formik';

interface CompanyDetailsInterface {
  company: CompanyFragment;
}

const CompanyDetails: React.FC<CompanyDetailsInterface> = ({ company }) => {
  const { showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks();
  const [updateCompanyMutation] = useUpdateCompanyMutation({
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateCompany),
    refetchQueries: [
      {
        query: COMPANY_QUERY,
        variables: {
          _id: company._id,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateCompanyClientSchema,
  });

  const initialCompany = removeApolloFields(omit(company, ['itemId', 'slug', '_id', 'logo']));
  const initialContacts = removeApolloFields(initialCompany.contacts);
  const initialValues: CompanyFormMainValuesInterface = {
    ...initialCompany,
    contacts: {
      emails: initialContacts.emails[0] ? initialContacts.emails : [''],
      phones: initialContacts.phones[0] ? initialContacts.phones : [''],
    },
  };

  return (
    <Inner testId={'company-details'}>
      <Formik<CompanyFormMainValuesInterface>
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          showLoading();
          const finalValues = omit(values, ['owner', 'staff']);
          updateCompanyMutation({
            variables: {
              input: {
                ...finalValues,
                contacts: {
                  ...finalValues.contacts,
                  phones: finalValues.contacts.phones.map((phone) => phoneToRaw(phone)),
                },
                companyId: company._id,
                ownerId: `${values.owner?._id}`,
                staffIds: values.staff.map(({ _id }) => _id),
              },
            },
          }).catch((e) => console.log(e));
        }}
      >
        {() => {
          return (
            <Form>
              <CompanyMainFields />
              <Button type={'submit'} testId={'company-submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CompanyDetails;
