import { Form, Formik } from 'formik';
import * as React from 'react';
import { UpdateGiftCertificateInputInterface } from '../../db/dao/giftCertificate/updateGiftCertificate';
import { CompanyInterface, GiftCertificateInterface } from '../../db/uiInterfaces';
import { useUpdateGiftCertificateMutation } from '../../hooks/mutations/useGiftCertificateMutations';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import GiftCertificateMainFields from '../FormTemplates/GiftCertificateMainFields';

export interface ConsoleGiftCertificateDetailsInterface {
  pageCompany: CompanyInterface;
  giftCertificate: GiftCertificateInterface;
  basePath?: string;
}

const ConsoleGiftCertificateDetails: React.FC<ConsoleGiftCertificateDetailsInterface> = ({
  giftCertificate,
}) => {
  const [updateGiftCertificateMutation] = useUpdateGiftCertificateMutation();
  const initialValues: UpdateGiftCertificateInputInterface = {
    _id: `${giftCertificate._id}`,
    userId: `${giftCertificate.userId}`,
    code: giftCertificate.code,
    initialValue: giftCertificate.initialValue,
    descriptionI18n: giftCertificate.descriptionI18n,
    nameI18n: giftCertificate.nameI18n,
    companyId: `${giftCertificate.companyId}`,
    companySlug: giftCertificate.companySlug,
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        updateGiftCertificateMutation(values).catch(console.log);
      }}
    >
      {() => {
        return (
          <Form>
            <div className='relative'>
              <GiftCertificateMainFields />

              <FixedButtons>
                <WpButton
                  frameClassName='w-auto'
                  size={'small'}
                  type={'submit'}
                  testId={'submit-promo'}
                >
                  Сохранить
                </WpButton>
              </FixedButtons>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConsoleGiftCertificateDetails;
