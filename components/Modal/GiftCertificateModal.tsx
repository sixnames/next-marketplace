import WpButton from 'components/button/WpButton';
import FormikCodeInput from 'components/FormElements/Input/FormikCodeInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { CreateGiftCertificateInputInterface } from 'db/dao/giftCertificate/createGiftCertificate';
import { CompanyInterface, GiftCertificateInterface } from 'db/uiInterfaces';
import * as React from 'react';
import { Form, Formik } from 'formik';

export interface GiftCertificateModalInterface {
  pageCompany: CompanyInterface;
  giftCertificate?: GiftCertificateInterface | null;
  confirm: (values: CreateGiftCertificateInputInterface) => void;
}

const GiftCertificateModal: React.FC<GiftCertificateModalInterface> = ({
  pageCompany,
  giftCertificate,
  confirm,
}) => {
  const initialValues: CreateGiftCertificateInputInterface = {
    code: giftCertificate?.code || '',
    initialValue: giftCertificate?.initialValue || 0,
    descriptionI18n: giftCertificate?.descriptionI18n || {},
    nameI18n: giftCertificate?.nameI18n || {},
    companyId: `${pageCompany._id}`,
    companySlug: pageCompany.slug,
  };

  return (
    <ModalFrame testId={'create-promo-modal'}>
      <ModalTitle>{giftCertificate ? 'Обновление' : 'Создание'} подарочного сертификата</ModalTitle>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikCodeInput name={'code'} isRequired showInlineError />

              <FormikInput
                label={'Сумма'}
                type={'number'}
                testId={'initialValue'}
                name={'initialValue'}
                isRequired
                showInlineError
              />

              <FormikTranslationsInput label={'Название'} testId={'nameI18n'} name={'nameI18n'} />

              <FormikTranslationsInput
                label={'Описание'}
                testId={'descriptionI18n'}
                name={'descriptionI18n'}
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-promo'}>
                  {giftCertificate ? 'Обновить' : 'Создать'}
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
