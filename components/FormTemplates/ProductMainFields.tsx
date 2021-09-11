import Button from 'components/Button';
import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useFormikContext } from 'formik';
import * as React from 'react';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { CreateProductInput, useGetGenderOptionsQuery } from 'generated/apolloComponents';
import { get } from 'lodash';

export type ProductFormValuesBaseType = Omit<CreateProductInput, 'rubricId'>;

export interface ProductFormValuesInterface extends ProductFormValuesBaseType {
  productId?: string;
}

const ProductMainFields: React.FC = () => {
  const { setFieldValue, values } = useFormikContext<ProductFormValuesInterface>();
  const { showModal } = useAppContext();
  const barcode = get(values, 'barcode') || [''];
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
      <FormikInput
        isRequired
        label={'Оригинальное название'}
        name={'originalName'}
        testId={'originalName'}
        showInlineError
      />

      <FormikTranslationsInput label={'Название'} name={'nameI18n'} testId={'nameI18n'} />

      <FormikSelect
        name={'gender'}
        firstOption
        options={getGenderOptions}
        testId={`gender`}
        label={'Род названия'}
      />

      {barcode.map((barcodeItem, index) => {
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
                    const barcodesCopy = [...barcode];
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

      <div className='mb-8'>
        <Button
          theme={'secondary'}
          size={'small'}
          onClick={() => {
            setFieldValue(`barcode[${(barcode || []).length}]`, '');
          }}
        >
          Добавить штрих-код
        </Button>
      </div>

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
