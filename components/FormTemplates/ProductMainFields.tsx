import Button from 'components/Button';
import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useFormikContext } from 'formik';
import * as React from 'react';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { CreateProductInput } from 'generated/apolloComponents';
import { get } from 'lodash';

export type ProductFormValuesBaseType = Omit<CreateProductInput, 'assets' | 'rubricId'>;

export interface ProductFormValuesInterface extends ProductFormValuesBaseType {
  productId?: string;
  assets?: any[] | null;
}

const ProductMainFields: React.FC = () => {
  const { setFieldValue, values } = useFormikContext<ProductFormValuesInterface>();
  const { showModal } = useAppContext();
  const barcode = get(values, 'barcode') || [''];

  return (
    <React.Fragment>
      <FormikTranslationsInput label={'Название'} name={'nameI18n'} testId={'nameI18n'} />

      <FormikInput
        isRequired
        label={'Оригинальное название'}
        name={'originalName'}
        testId={'originalName'}
        showInlineError
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
        isRequired
      />
    </React.Fragment>
  );
};

export default ProductMainFields;
