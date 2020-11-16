import React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createCompanySchema } from '@yagu/validation';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { useCreateCompanyMutation } from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from '@yagu/config';
import CompanyForm from './CompanyForm';

const CreateCompanyContent: React.FC = () => {
  const router = useRouter();
  const { showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks();
  const [createCompanyMutation] = useCreateCompanyMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      router.replace(`${ROUTE_CMS}/companies`).catch((e) => console.log(e));
      onCompleteCallback(data.createCompany);
    },
  });
  const validationSchema = useValidationSchema({
    schema: createCompanySchema,
  });

  const initialValues = {
    nameString: '',
    contacts: {
      emails: [''],
      phones: [''],
    },
    logo: [],
    owner: null,
    staff: [],
  };

  return (
    <DataLayoutContentFrame testId={'create-company-content'}>
      <Inner>
        <CompanyForm
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmitHandler={(values) => {
            showLoading();
            createCompanyMutation({
              variables: {
                input: values,
              },
            }).catch((e) => console.log(e));
          }}
        />
      </Inner>
    </DataLayoutContentFrame>
  );
};

export default CreateCompanyContent;
