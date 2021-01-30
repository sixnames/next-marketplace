import * as React from 'react';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikInput from 'components/FormElements/Input/FormikInput';
import InputLine from 'components/FormElements/Input/InputLine';
import RubricsTree from 'routes/Rubrics/RubricsTree';
import FormikArrayCheckbox from 'components/FormElements/Checkbox/FormikArrayCheckbox';
import classes from 'components/Modal/CreateNewProductModal/CreateNewProductModal.module.css';
import ProductAttributesInput from 'components/FormTemplates/ProductAttributesInput';
import {
  CreateProductInput,
  GetRubricsTreeQuery,
  BrandCollectionsOptionFragment,
  ProductAttributesGroupAstFragment,
  useGetProductBrandsOptionsQuery,
} from 'generated/apolloComponents';
import { useFormikContext } from 'formik';
import Spinner from 'components/Spinner/Spinner';
import RequestError from 'components/RequestError/RequestError';
import FormikSelect from 'components/FormElements/Select/FormikSelect';

export type ProductFormValuesBaseType = Omit<CreateProductInput, 'attributes' | 'assets'>;

export interface ProductFormValuesInterface extends ProductFormValuesBaseType {
  productId?: string;
  attributes: ProductAttributesGroupAstFragment[];
  assets?: any[] | null;
}

interface ProductMainFieldsInterface {
  rubricId?: string | null;
  rubricsTree?: GetRubricsTreeQuery['getRubricsTree'];
  productId?: string | null;
}

const ProductMainFields: React.FC<ProductMainFieldsInterface> = ({
  rubricId,
  rubricsTree,
  productId,
}) => {
  const [brandCollections, setBrandCollections] = React.useState<BrandCollectionsOptionFragment[]>(
    [],
  );
  const { values, setFieldValue } = useFormikContext<ProductFormValuesInterface>();
  const { data, loading, error } = useGetProductBrandsOptionsQuery();
  const { rubricsIds } = values;
  const showFeatures = rubricsIds.length > 0;

  React.useEffect(() => {
    if (values.brandSlug) {
      const currentBrand = data?.getBrandsOptions.find(({ slug }) => values.brandSlug === slug);
      const currentBrandCollection = currentBrand?.collectionsList.find(({ slug }) => {
        return slug === values.brandCollectionSlug;
      });

      if (currentBrand) {
        if (currentBrandCollection) {
          setFieldValue('brandCollectionSlug', values.brandCollectionSlug);
        } else {
          setFieldValue('brandCollectionSlug', null);
        }
        setBrandCollections(currentBrand.collectionsList);
      }
    }
  }, [data, setFieldValue, values.brandCollectionSlug, values.brandSlug]);

  React.useEffect(() => {
    if (!values.brandSlug) {
      setFieldValue('brandCollectionSlug', null);
    }
  }, [setFieldValue, values.brandSlug]);

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data) {
    return <RequestError message={'Ошибка загрузки списка брендов'} />;
  }

  const { getBrandsOptions, getManufacturersOptions } = data;

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

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
        isRequired
      />

      <FormikSelect
        firstOption={'Не выбран'}
        label={'Бренд'}
        name={'brandSlug'}
        options={getBrandsOptions}
        testId={'brandSlug'}
      />

      <FormikSelect
        disabled={!values.brandSlug}
        firstOption={'Не выбрана'}
        label={'Линейка бренда'}
        name={'brandCollectionSlug'}
        testId={'brandCollectionSlug'}
        options={brandCollections}
      />

      <FormikSelect
        firstOption={'Не выбран'}
        label={'Производитель'}
        name={'manufacturerSlug'}
        testId={'manufacturerSlug'}
        options={getManufacturersOptions}
      />

      {!rubricId && rubricsTree ? (
        <InputLine label={'Рубрики'} labelTag={'div'} name={'rubrics'} isRequired low>
          <RubricsTree
            low
            isLastDisabled
            tree={rubricsTree}
            titleLeft={(_id, testId) => (
              <FormikArrayCheckbox
                className={classes.rubricCheckbox}
                name={'rubricsIds'}
                testId={testId}
                value={_id}
              />
            )}
          />
        </InputLine>
      ) : null}

      {showFeatures ? (
        <ProductAttributesInput productId={productId} rubricsIds={rubricsIds} />
      ) : null}
    </React.Fragment>
  );
};

export default ProductMainFields;
