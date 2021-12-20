import { useFormikContext } from 'formik';
import * as React from 'react';
import { CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { CreateProductInputInterface } from '../../db/dao/product/createProduct';
import { useGetGenderOptionsQuery } from '../../generated/apolloComponents';
import WpButton from '../button/WpButton';
import FormikBarcodeInput from '../FormElements/FormikBarcodeInput/FormikBarcodeInput';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import RequestError from '../RequestError';
import Spinner from '../Spinner';

export type ProductFormValuesBaseType = Omit<CreateProductInputInterface, 'rubricId'>;

export interface ProductFormValuesInterface extends ProductFormValuesBaseType {
  productId?: string;
}

const ProductMainFields: React.FC = () => {
  const { setFieldValue, values } = useFormikContext<ProductFormValuesInterface>();
  const { showModal } = useAppContext();
  const { data, loading, error } = useGetGenderOptionsQuery();
  if (error || (!loading && !data)) {
    return <RequestError />;
  }

  if (loading) {
    return <Spinner isTransparent isNested />;
  }

  const { getGenderOptions } = data!;

  return (
    <React.Fragment>
      <FormikInput label={'Оригинальное название'} name={'originalName'} testId={'originalName'} />
      <FormikTranslationsInput label={'Название'} name={'nameI18n'} testId={'nameI18n'} />

      <FormikSelect
        name={'gender'}
        firstOption
        options={getGenderOptions}
        testId={`gender`}
        label={'Род названия'}
      />

      <InputLine labelTag={'div'}>
        {values.barcode.map((barcodeItem, index) => {
          return (
            <FormikBarcodeInput
              label={index === 0 ? 'Штрих-код' : undefined}
              name={`barcode[${index}]`}
              testId={'barcode'}
              key={index}
              onClear={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить штрих-код ${barcodeItem}`,
                    confirm: () => {
                      const barcodesCopy = [...values.barcode];
                      const updatedBarcodesList = barcodesCopy.filter((_item, itemIndex) => {
                        return itemIndex !== index;
                      });
                      setFieldValue(`barcode`, updatedBarcodesList);
                    },
                  },
                });
              }}
            />
          );
        })}
        <div>
          <WpButton
            onClick={() => {
              setFieldValue('barcode', [...values.barcode, '']);
            }}
            theme={'secondary'}
            size={'small'}
          >
            Добавить штрих-код
          </WpButton>
        </div>
      </InputLine>

      <FormikTranslationsInput
        label={'Мета-тег Description'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
      />
    </React.Fragment>
  );
};

export default ProductMainFields;
