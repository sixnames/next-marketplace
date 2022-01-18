import { Form, Formik } from 'formik';
import * as React from 'react';
import { useAppContext } from '../../context/appContext';
import { UpdatePromoCodeInputInterface } from '../../db/dao/promo/updatePromoCode';
import { PromoCodeModel } from '../../db/dbModels';
import { useUpdatePromoCode } from '../../hooks/mutations/usePromoMutations';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import PromoCodeMainFields from '../FormTemplates/PromoCodeMainFields';
import Inner from '../Inner';

export interface ConsolePromoCodeInterface {
  promoCode: PromoCodeModel;
}

const ConsolePromoCode: React.FC<ConsolePromoCodeInterface> = ({ promoCode }) => {
  const { showLoading } = useAppContext();
  const [updatePromoCode] = useUpdatePromoCode();
  const initialValues: UpdatePromoCodeInputInterface = {
    _id: `${promoCode._id}`,
    descriptionI18n: promoCode.descriptionI18n,
    code: promoCode.code,
  };

  return (
    <Inner>
      <div className='relative'>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            updatePromoCode(values).catch(console.log);
          }}
        >
          {() => {
            return (
              <Form>
                <PromoCodeMainFields />
                <FixedButtons>
                  <WpButton size={'small'} type={'submit'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Inner>
  );
};

export default ConsolePromoCode;
