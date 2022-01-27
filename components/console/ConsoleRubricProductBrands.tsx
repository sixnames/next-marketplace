import * as React from 'react';
import {
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
} from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useNotificationsContext } from '../../context/notificationsContext';
import {
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductFacetInterface,
} from '../../db/uiInterfaces';
import {
  useUpdateProductBrand,
  useUpdateProductBrandCollection,
  useUpdateProductManufacturer,
} from '../../hooks/mutations/useProductMutations';
import FakeInput from '../FormElements/Input/FakeInput';
import InputLine from '../FormElements/Input/InputLine';
import Inner from '../Inner';
import { BrandCollectionOptionsModalInterface } from '../Modal/BrandCollectionOptionsModal';
import { BrandOptionsModalInterface } from '../Modal/BrandOptionsModal';
import { ManufacturerOptionsModalInterface } from '../Modal/ManufacturerOptionsModal';

const emptyValue = 'Не назначено';

interface ConsoleRubricProductBrandsInterface {
  product: ProductFacetInterface;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
}

const ConsoleRubricProductBrands: React.FC<ConsoleRubricProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
}) => {
  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();

  const [updateProductBrandMutation] = useUpdateProductBrand();
  const [updateProductBrandCollectionMutation] = useUpdateProductBrandCollection();
  const [updateProductManufacturerMutation] = useUpdateProductManufacturer();

  return (
    <Inner testId={'product-brands-list'}>
      <InputLine label={'Бренд'}>
        <FakeInput
          low
          testId={'brand-input'}
          value={brand ? `${brand.name}` : emptyValue}
          onClear={
            product.brandSlug
              ? () => {
                  updateProductBrandMutation({
                    productId: `${product._id}`,
                    brandSlug: null,
                  }).catch(console.log);
                }
              : undefined
          }
          onClick={() => {
            showModal<BrandOptionsModalInterface>({
              variant: BRAND_OPTIONS_MODAL,
              props: {
                testId: 'brand-options-modal',
                optionVariant: 'radio',
                initiallySelectedOptions: brand
                  ? [
                      {
                        _id: brand._id,
                        name: `${brand.name}`,
                        slug: brand.itemId,
                      },
                    ]
                  : [],
                onSubmit: (selectedOptions) => {
                  const brand = selectedOptions[0];

                  if (brand) {
                    updateProductBrandMutation({
                      productId: `${product._id}`,
                      brandSlug: brand.itemId,
                    }).catch(console.log);
                    return;
                  }
                  showErrorNotification({ title: 'Бренд не указан' });
                },
              },
            });
          }}
        />
      </InputLine>

      <InputLine label={!product.brandSlug ? 'Бренд не назначен' : 'Коллекция бренда'}>
        <FakeInput
          low
          testId={'brand-collection-input'}
          disabled={!product.brandSlug}
          value={brandCollection ? `${brandCollection.name}` : emptyValue}
          onClear={
            product.brandCollectionSlug
              ? () => {
                  updateProductBrandCollectionMutation({
                    productId: `${product._id}`,
                    brandCollectionSlug: null,
                  }).catch(console.log);
                }
              : undefined
          }
          onClick={() => {
            showModal<BrandCollectionOptionsModalInterface>({
              variant: BRAND_COLLECTION_OPTIONS_MODAL,
              props: {
                testId: 'brand-collection-options-modal',
                brandSlug: `${product.brandSlug}`,
                optionVariant: 'radio',
                initiallySelectedOptions: brandCollection
                  ? [
                      {
                        _id: brandCollection._id,
                        name: `${brandCollection.name}`,
                        slug: brandCollection.itemId,
                      },
                    ]
                  : [],
                onSubmit: (selectedOptions) => {
                  const brandCollection = selectedOptions[0];

                  if (brandCollection) {
                    updateProductBrandCollectionMutation({
                      productId: `${product._id}`,
                      brandCollectionSlug: brandCollection.itemId,
                    }).catch(console.log);
                    return;
                  }
                  showErrorNotification({ title: 'Коллекция бренда не указана' });
                },
              },
            });
          }}
        />
      </InputLine>

      <InputLine label={'Производитель'}>
        <FakeInput
          low
          testId={'manufacturer-input'}
          value={manufacturer ? `${manufacturer.name}` : emptyValue}
          onClear={
            product.manufacturerSlug
              ? () => {
                  updateProductManufacturerMutation({
                    productId: `${product._id}`,
                    manufacturerSlug: null,
                  }).catch(console.log);
                }
              : undefined
          }
          onClick={() => {
            showModal<ManufacturerOptionsModalInterface>({
              variant: MANUFACTURER_OPTIONS_MODAL,
              props: {
                testId: 'manufacturer-options-modal',
                optionVariant: 'radio',
                initiallySelectedOptions: manufacturer
                  ? [
                      {
                        _id: manufacturer._id,
                        name: `${manufacturer.name}`,
                        slug: manufacturer.itemId,
                      },
                    ]
                  : [],
                onSubmit: (selectedOptions) => {
                  const manufacturer = selectedOptions[0];
                  updateProductManufacturerMutation({
                    productId: `${product._id}`,
                    manufacturerSlug: manufacturer.itemId,
                  }).catch(console.log);
                },
              },
            });
          }}
        />
      </InputLine>
    </Inner>
  );
};

export default ConsoleRubricProductBrands;
