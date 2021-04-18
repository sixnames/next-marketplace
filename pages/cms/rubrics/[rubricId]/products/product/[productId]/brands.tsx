import FakeInput from 'components/FormElements/Input/FakeInput';
import Inner from 'components/Inner/Inner';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { BRAND_OPTIONS_MODAL } from 'config/modals';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
  COL_PRODUCTS,
} from 'db/collectionNames';
import { BrandCollectionModel, BrandModel, ManufacturerModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
// import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface ProductBrandsInterface {
  product: ProductModel;
  brand?: BrandModel | null;
  brandCollection?: BrandCollectionModel | null;
  manufacturer?: ManufacturerModel | null;
}

const emptyValue = 'Не назначено';

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
}) => {
  // const router = useRouter();
  const {
    // onErrorCallback,
    // onCompleteCallback,
    // showLoading,
    // hideLoading,
    // showErrorNotification,
    showModal,
  } = useMutationCallbacks();

  return (
    <CmsProductLayout product={product}>
      <Inner>
        <FakeInput
          onClick={() => {
            showModal<BrandOptionsModalInterface>({
              variant: BRAND_OPTIONS_MODAL,
              props: {
                optionVariant: 'radio',
                onSubmit: (selectedOptions) => {
                  console.log(selectedOptions);
                },
              },
            });
          }}
          value={brand ? `${brand.name}` : emptyValue}
          label={'Бренд'}
        />
        <FakeInput
          value={brandCollection ? `${brandCollection.name}` : emptyValue}
          label={'Коллекция бренда'}
        />
        <FakeInput
          value={manufacturer ? `${manufacturer.name}` : emptyValue}
          label={'Производитель'}
        />
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
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductBrands
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
  const { productId } = query;
  const db = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !productId) {
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
  if (!product) {
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
