import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import * as React from 'react';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { CreateProductInput } from 'generated/apolloComponents';

export type ProductFormValuesBaseType = Omit<CreateProductInput, 'assets' | 'rubricId'>;

export interface ProductFormValuesInterface extends ProductFormValuesBaseType {
  productId?: string;
  assets?: any[] | null;
}

const ProductMainFields: React.FC = () => {
  return (
    <React.Fragment>
      <FormikTranslationsInput
        label={'Название'}
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        isRequired
      />

      <FormikInput
        isRequired
        label={'Оригинальное название'}
        name={'originalName'}
        testId={'originalName'}
        showInlineError
      />

      <FormikBarcodeInput label={'Штрих-код'} name={'barcode'} testId={'barcode'} />

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
        isRequired
      />
    </React.Fragment>
  );
};

export default ProductMainFields;
