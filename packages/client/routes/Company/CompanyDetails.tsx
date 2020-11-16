import React, { useMemo } from 'react';
import { CompanyFragment, useUpdateCompanyMutation } from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateCompanyClientSchema } from '@yagu/validation';
import CompanyForm from './CompanyForm';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { COMPANY_QUERY } from '../../graphql/query/companiesQueries';
import useUrlFiles from '../../hooks/useUrlFiles';
import { removeApolloFields } from '../../utils/apolloHelpers';
import { omit } from 'lodash';

interface CompanyDetailsInterface {
  company: CompanyFragment;
}

const CompanyDetails: React.FC<CompanyDetailsInterface> = ({ company }) => {
  const initialLogo = useMemo(() => [company.logo], [company.logo]);
  const logoFiles = useUrlFiles(initialLogo);
  const { showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks();
  const [updateCompanyMutation] = useUpdateCompanyMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateCompany),
    refetchQueries: [
      {
        query: COMPANY_QUERY,
        variables: {
          id: company.id,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: updateCompanyClientSchema,
  });

  const initialCompany = removeApolloFields(omit(company, ['shops', 'itemId', 'slug']));
  const initialValues = {
    ...initialCompany,
    contacts: removeApolloFields(initialCompany.contacts),
    logo: logoFiles,
  };

  return (
    <Inner testId={'company-details'}>
      <CompanyForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        submitButtonText={'Сохранить'}
        onSubmitHandler={(values) => {
          showLoading();
          updateCompanyMutation({
            variables: {
              input: {
                ...values,
                id: company.id,
              },
            },
          }).catch((e) => console.log(e));
        }}
      />
    </Inner>
  );
};

export default CompanyDetails;
