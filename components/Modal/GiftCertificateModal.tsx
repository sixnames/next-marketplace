import Button from 'components/button/Button';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { CreateGiftCertificateInputInterface } from 'db/dao/giftCertificate/createGiftCertificate';
import { CompanyInterface, GiftCertificateInterface } from 'db/uiInterfaces';
import * as React from 'react';
import { Form, Formik } from 'formik';

export interface GiftCertificateModalInterface {
  pageCompany: CompanyInterface;
  giftCertificate: GiftCertificateInterface;
  confirm: (values: CreateGiftCertificateInputInterface) => void;
}

const GiftCertificateModal: React.FC<GiftCertificateModalInterface> = ({
  pageCompany,
  giftCertificate,
  confirm,
}) => {
  const initialValues: CreateGiftCertificateInputInterface = {
    code: giftCertificate.code || '',
    initialValue: giftCertificate?.initialValue || 0,
    descriptionI18n: giftCertificate?.descriptionI18n || {},
    nameI18n: giftCertificate?.nameI18n || {},
    companyId: `${pageCompany._id}`,
    companySlug: pageCompany.slug,
  };

  return (
    <ModalFrame testId={'create-promo-modal'}>
      <ModalTitle>Создание страницы</ModalTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <ModalButtons>
                <Button type={'submit'} testId={'submit-promo'}>
                  Создать
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default GiftCertificateModal;
