import Button from 'components/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import InputLine from 'components/FormElements/Input/InputLine';
import Inner from 'components/Inner';
import { BrandCollectionOptionsModalInterface } from 'components/Modal/BrandCollectionOptionsModal';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { ManufacturerOptionsModalInterface } from 'components/Modal/ManufacturerOptionsModal';
import { ROUTE_CMS } from 'config/common';
import {
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
} from 'config/modalVariants';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
  ProductModel,
  RubricModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductBrandCollectionMutation,
  useUpdateProductBrandMutation,
  useUpdateProductManufacturerMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductBrandsInterface {
  product: ProductInterface;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
  rubric: RubricInterface;
}

const emptyValue = 'Не назначено';

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Бренды / Производители',
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
            onClick={() => {
              showModal<BrandOptionsModalInterface>({
                variant: BRAND_OPTIONS_MODAL,
                props: {
                  testId: 'brand-options-modal',
                  optionVariant: 'radio',
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

          {product.brandSlug ? (
            <div className='mt-4'>
              <Button
                testId={'clear-brand'}
                onClick={() => {
                  updateProductBrandMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        brandSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
                }}
                size={'small'}
                theme={'secondary'}
              >
                Очистить
              </Button>
            </div>
          ) : null}
        </InputLine>

        <InputLine label={!product.brandSlug ? 'Бренд не назначен' : 'Коллекция бренда'}>
          <FakeInput
            low
            testId={'brand-collection-input'}
            disabled={!product.brandSlug}
            value={brandCollection ? `${brandCollection.name}` : emptyValue}
            onClick={() => {
              showModal<BrandCollectionOptionsModalInterface>({
                variant: BRAND_COLLECTION_OPTIONS_MODAL,
                props: {
                  testId: 'brand-collection-options-modal',
                  brandSlug: `${product.brandSlug}`,
                  optionVariant: 'radio',
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

          {product.brandCollectionSlug ? (
            <div className='mt-4'>
              <Button
                testId={'clear-brand-collection'}
                onClick={() => {
                  updateProductBrandCollectionMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        brandCollectionSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
                }}
                size={'small'}
                theme={'secondary'}
              >
                Очистить
              </Button>
            </div>
          ) : null}
        </InputLine>

        <InputLine label={'Производитель'}>
          <FakeInput
            low
            testId={'manufacturer-input'}
            value={manufacturer ? `${manufacturer.name}` : emptyValue}
            onClick={() => {
              showModal<ManufacturerOptionsModalInterface>({
                variant: MANUFACTURER_OPTIONS_MODAL,
                props: {
                  testId: 'manufacturer-options-modal',
                  optionVariant: 'radio',
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

          {product.manufacturerSlug ? (
            <div className='mt-4'>
              <Button
                testId={'clear-manufacturer'}
                onClick={() => {
                  updateProductManufacturerMutation({
                    variables: {
                      input: {
                        productId: product._id,
                        manufacturerSlug: null,
                      },
                    },
                  }).catch((e) => console.log(e));
                }}
                size={'small'}
                theme={'secondary'}
              >
                Очистить
              </Button>
            </div>
          ) : null}
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
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductBrands
        rubric={rubric}
        product={product}
        brand={brand}
        brandCollection={brandCollection}
        manufacturer={manufacturer}
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
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
      {
        $project: {
          attributes: false,
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];

  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

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

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      product: castDbData(product),
      brand: castDbData(brand),
      brandCollection: castDbData(brandCollection),
      manufacturer: castDbData(manufacturer),
      rubric: castDbData(rubric),
    },
  };
};

export default Product;
