import * as React from 'react';
import {
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
} from '../../config/modalVariants';
import {
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductFacetInterface,
} from '../../db/uiInterfaces';
import {
  useUpdateProductBrandCollectionMutation,
  useUpdateProductBrandMutation,
  useUpdateProductManufacturerMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
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
  const { onErrorCallback, onCompleteCallback, showLoading, showErrorNotification, showModal } =
    useMutationCallbacks({
      withModal: true,
      reload: true,
    });

  const [updateProductBrandMutation] = useUpdateProductBrandMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductBrand),
  });

  const [updateProductBrandCollectionMutation] = useUpdateProductBrandCollectionMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductBrandCollection),
  });

  const [updateProductManufacturerMutation] = useUpdateProductManufacturerMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductManufacturer),
  });

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
                  showLoading();
                  updateProductBrandMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        brandSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
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
                    showLoading();
                    updateProductBrandMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          brandSlug: brand.itemId,
                        },
                      },
                    }).catch((e) => console.log(e));
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
                  showLoading();
                  updateProductBrandCollectionMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        brandCollectionSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
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
                    showLoading();
                    updateProductBrandCollectionMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          brandCollectionSlug: brandCollection.itemId,
                        },
                      },
                    }).catch((e) => console.log(e));
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
                  showLoading();
                  updateProductManufacturerMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        manufacturerSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
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
                  showLoading();
                  updateProductManufacturerMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        manufacturerSlug: manufacturer.itemId,
                      },
                    },
                  }).catch((e) => console.log(e));
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
