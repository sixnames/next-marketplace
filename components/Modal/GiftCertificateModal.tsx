import * as React from 'react';
import { Form, Formik } from 'formik';
import { CreateGiftCertificateInputInterface } from '../../db/dao/giftCertificate/createGiftCertificate';
import { CompanyInterface } from '../../db/uiInterfaces';
import { useCreateGiftCertificateMutation } from '../../hooks/mutations/useGiftCertificateMutations';
import WpButton from '../button/WpButton';
import GiftCertificateMainFields from '../FormTemplates/GiftCertificateMainFields';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface GiftCertificateModalInterface {
  pageCompany: CompanyInterface;
}

const GiftCertificateModal: React.FC<GiftCertificateModalInterface> = ({ pageCompany }) => {
  const [createGiftCertificateMutation] = useCreateGiftCertificateMutation();
  const initialValues: CreateGiftCertificateInputInterface = {
    code: '',
    initialValue: 0,
    descriptionI18n: {},
    nameI18n: {},
    companyId: `${pageCompany._id}`,
    companySlug: pageCompany.slug,
  };

  return (
    <ModalFrame testId={'create-promo-modal'}>
      <ModalTitle>Создание подарочного сертификата</ModalTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          createGiftCertificateMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <GiftCertificateMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-promo'}>
                  Создать
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default GiftCertificateModal;
