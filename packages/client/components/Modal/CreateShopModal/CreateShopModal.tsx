import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ShopForm from '../../../routes/Company/ShopForm';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { addShopToCompanySchema } from '@yagu/validation';

export interface CreateShopModalInterface {
  companyId: string;
}

const CreateShopModal: React.FC<CreateShopModalInterface> = ({ companyId }) => {
  const validationSchema = useValidationSchema({
    schema: addShopToCompanySchema,
  });

  const initialValues = {
    companyId,
    nameString: '',
    address: null,
    logo: [],
    assets: [],
    contacts: {
      emails: [],
      phones: [],
    },
  };

  return (
    <ModalFrame testId={'create-shop-modal'}>
      <ModalTitle>Создание магазина</ModalTitle>
      <ShopForm
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmitHandler={(values) => console.log(values)}
      />
    </ModalFrame>
  );
};

export default CreateShopModal;
