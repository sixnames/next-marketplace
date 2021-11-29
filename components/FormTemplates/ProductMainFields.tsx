import Button from 'components/button/Button';
import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import { useFormikContext } from 'formik';
import * as React from 'react';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { useGetGenderOptionsQuery } from 'generated/apolloComponents';

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
          <Button
            onClick={() => {
              setFieldValue('barcode', [...values.barcode, '']);
            }}
            theme={'secondary'}
            size={'small'}
          >
            Добавить штрих-код
          </Button>
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
