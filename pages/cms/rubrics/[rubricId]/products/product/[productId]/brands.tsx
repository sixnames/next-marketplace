import FakeInput from 'components/FormElements/Input/FakeInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import { BrandCollectionOptionsModalInterface } from 'components/Modal/BrandCollectionOptionsModal';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { ManufacturerOptionsModalInterface } from 'components/Modal/ManufacturerOptionsModal';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import {
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
} from 'config/modalVariants';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_MANUFACTURERS } from 'db/collectionNames';
import { BrandCollectionModel, BrandModel, ManufacturerModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductBrandCollectionMutation,
  useUpdateProductBrandMutation,
  useUpdateProductManufacturerMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getCmsProduct } from 'lib/productUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductBrandsInterface {
  product: ProductInterface;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
}

const emptyValue = 'Не назначено';

const ProductBrands: React.FC<ProductBrandsInterface> = ({
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Бренд / Производитель / Поставщик',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
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
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductBrandsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductBrands {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }
  const { product } = payload;

  const manufacturerEntity = product.manufacturerSlug
    ? await manufacturersCollection.findOne(
        {
          itemId: product.manufacturerSlug,
        },
        {
          projection: {
            _id: true,
            nameI18n: true,
            itemId: true,
          },
        },
      )
    : null;
  const manufacturer = manufacturerEntity
    ? {
        ...manufacturerEntity,
        name: getFieldStringLocale(manufacturerEntity.nameI18n, props.sessionLocale),
      }
    : null;

  const brandEntity = product.brandSlug
    ? await brandsCollection.findOne(
        { itemId: product.brandSlug },
        {
          projection: {
            _id: true,
            nameI18n: true,
            itemId: true,
          },
        },
      )
    : null;
  const brand = brandEntity
    ? {
        ...brandEntity,
        name: getFieldStringLocale(brandEntity.nameI18n, props.sessionLocale),
      }
    : null;

  const brandCollectionEntity = product.brandCollectionSlug
    ? await brandCollectionsCollection.findOne(
        {
          itemId: product.brandCollectionSlug,
        },
        {
          projection: {
            _id: true,
            nameI18n: true,
            itemId: true,
          },
        },
      )
    : null;
  const brandCollection = brandCollectionEntity
    ? {
        ...brandCollectionEntity,
        name: getFieldStringLocale(brandCollectionEntity.nameI18n, props.sessionLocale),
      }
    : null;

  return {
    props: {
      ...props,
      product: castDbData(product),
      brand: castDbData(brand),
      brandCollection: castDbData(brandCollection),
      manufacturer: castDbData(manufacturer),
    },
  };
};

export default Product;
