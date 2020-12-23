import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ShopForm from '../../../routes/Company/ShopForm';
import useValidationSchema from '../../../hooks/useValidationSchema';
import useMutationCallbacks from '../../../hooks/useMutationCallbacks';
import { useAddShopToCompanyMutation } from '../../../generated/apolloComponents';
import { COMPANY_QUERY } from '../../../graphql/query/companiesQueries';
import { addShopToCompanySchema } from '@yagu/shared';

export interface CreateShopModalInterface {
  companyId: string;
}

const CreateShopModal: React.FC<CreateShopModalInterface> = ({ companyId }) => {
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [addShopToCompanyMutation] = useAddShopToCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.addShopToCompany),
    onError: onErrorCallback,
    refetchQueries: [
      {
        query: COMPANY_QUERY,
        variables: {
          id: companyId,
        },
      },
    ],
  });
  const validationSchema = useValidationSchema({
    schema: addShopToCompanySchema,
  });

  const initialValues = {
    companyId,
    nameString: '',
    city: '',
    address: null,
    logo: [],
    assets: [],
    contacts: {
      emails: [''],
      phones: [''],
    },
  };

  return (
    <ModalFrame testId={'create-shop-modal'}>
      <ModalTitle>Создание магазина</ModalTitle>
      <ShopForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmitHandler={(values) => {
          showLoading();
          addShopToCompanyMutation({
            variables: {
              input: {
                ...values,
                companyId,
              },
            },
          }).catch(() => {
            showErrorNotification();
          });
        }}
      />
    </ModalFrame>
  );
};

export default CreateShopModal;
