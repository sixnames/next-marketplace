import FakeInput from 'components/FormElements/Input/FakeInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import { BrandCollectionOptionsModalInterface } from 'components/Modal/BrandCollectionOptionsModal';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { ManufacturerOptionsModalInterface } from 'components/Modal/ManufacturerOptionsModal';
import { SupplierOptionsModalInterface } from 'components/Modal/SupplierOptionsModal';
import { ROUTE_CMS } from 'config/common';
import {
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
  SUPPLIER_OPTIONS_MODAL,
} from 'config/modalVariants';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_SUPPLIERS,
} from 'db/collectionNames';
import { BrandCollectionModel, BrandModel, ManufacturerModel, SupplierModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductInterface,
  RubricInterface,
  SupplierInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductBrandCollectionMutation,
  useUpdateProductBrandMutation,
  useUpdateProductManufacturerMutation,
  useUpdateProductSupplierMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
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
  suppliers?: SupplierInterface[] | null;
  rubric: RubricInterface;
}

const emptyValue = 'Не назначено';

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
  suppliers,
  rubric,
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

  const [updateProductSupplierMutation] = useUpdateProductSupplierMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateProductSupplier),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Бренд / Производитель / Поставщик',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: product.originalName,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
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
                          slug: brand.slug,
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
                            brandSlug: brand.slug,
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
                          slug: brandCollection.slug,
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
                            brandCollectionSlug: brandCollection.slug,
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
                          slug: manufacturer.slug,
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
                          manufacturerSlug: manufacturer.slug,
                        },
                      },
                    }).catch((e) => console.log(e));
                  },
                },
              });
            }}
          />
        </InputLine>

        <InputLine label={'Поставщики'}>
          <FakeInput
            low
            testId={'supplier-input'}
            value={
              suppliers && suppliers.length > 0
                ? suppliers
                    .map((supplier) => {
                      return `${supplier.name}`;
                    })
                    .join(', ')
                : emptyValue
            }
            onClear={
              product.supplierSlugs && product.supplierSlugs.length > 0
                ? () => {
                    showLoading();
                    updateProductSupplierMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          supplierSlugs: [],
                        },
                      },
                    }).catch((e) => console.log(e));
                  }
                : undefined
            }
            onClick={() => {
              showModal<SupplierOptionsModalInterface>({
                variant: SUPPLIER_OPTIONS_MODAL,
                props: {
                  testId: 'supplier-options-modal',
                  optionVariant: 'checkbox',
                  initiallySelectedOptions:
                    suppliers && suppliers.length > 0
                      ? suppliers.map((supplier) => {
                          return {
                            _id: supplier._id,
                            name: `${supplier.name}`,
                            slug: supplier.slug,
                          };
                        })
                      : [],
                  onSubmit: (selectedOptions) => {
                    showLoading();
                    updateProductSupplierMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          supplierSlugs: selectedOptions.map(({ slug }) => slug),
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

const Product: NextPage<ProductPageInterface> = ({
  pageUrls,
  product,
  brand,
  brandCollection,
  manufacturer,
  rubric,
  suppliers,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductBrands
        rubric={rubric}
        product={product}
        brand={brand}
        brandCollection={brandCollection}
        manufacturer={manufacturer}
        suppliers={suppliers}
      />
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
  const suppliersCollection = db.collection<SupplierModel>(COL_SUPPLIERS);
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
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }
  const { product, rubric } = payload;

  const manufacturerEntity = product.manufacturerSlug
    ? await manufacturersCollection.findOne(
        {
          slug: product.manufacturerSlug,
        },
        {
          projection: {
            _id: true,
            nameI18n: true,
            slug: true,
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

  const initialSuppliers =
    product.supplierSlugs && product.supplierSlugs.length > 0
      ? await suppliersCollection
          .find(
            {
              slug: {
                $in: product.supplierSlugs,
              },
            },
            {
              projection: {
                _id: true,
                nameI18n: true,
                slug: true,
              },
            },
          )
          .toArray()
      : [];
  const suppliers = initialSuppliers.map((supplier) => {
    return {
      ...supplier,
      name: getFieldStringLocale(supplier.nameI18n, props.sessionLocale),
    };
  });

  const brandEntity = product.brandSlug
    ? await brandsCollection.findOne(
        { slug: product.brandSlug },
        {
          projection: {
            _id: true,
            nameI18n: true,
            slug: true,
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
          slug: product.brandCollectionSlug,
        },
        {
          projection: {
            _id: true,
            nameI18n: true,
            slug: true,
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
      suppliers: castDbData(suppliers),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
