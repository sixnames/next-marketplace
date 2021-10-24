import Button from 'components/Button';
import FormikBarcodeInput from 'components/FormElements/FormikBarcodeInput/FormikBarcodeInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import TextSeoInfo from 'components/TextSeoInfo';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { ProductSeoModel } from 'db/dbModels';
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

interface ProductMainFieldsInterface {
  seo?: ProductSeoModel | null;
}

const ProductMainFields: React.FC<ProductMainFieldsInterface> = ({ seo }) => {
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
      <FormikInput label={'Оригинальное название'} name={'originalName'} testId={'originalName'} />
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

      <FormikTranslationsInput
        variant={'textarea'}
        className='h-[30rem]'
        label={'Описание карточки товара'}
        name={'cardDescriptionI18n'}
        testId={'cardDescriptionI18n'}
        additionalUi={(currentLocale) => {
          if (!seo) {
            return null;
          }
          const seoLocale = seo.locales.find(({ locale }) => {
            return locale === currentLocale;
          });

          if (!seoLocale) {
            return <div className='mb-4 font-medium'>Текст проверяется</div>;
          }

          return (
            <TextSeoInfo
              seoLocale={seoLocale}
              className='mb-4 mt-4'
              listClassName='flex gap-3 flex-wrap'
            />
          );
        }}
      />
    </React.Fragment>
  );
};

export default ProductMainFields;
