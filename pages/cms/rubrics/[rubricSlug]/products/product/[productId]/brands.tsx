import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductBrands from '../../../../../../../components/console/ConsoleRubricProductBrands';
import { DEFAULT_COMPANY_SLUG } from '../../../../../../../config/common';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_MANUFACTURERS,
} from '../../../../../../../db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
} from '../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductSummaryInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../../../../lib/i18n';
import { getConsoleRubricLinks } from '../../../../../../../lib/linkUtils';
import { getCmsProduct } from '../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface ProductBrandsInterface {
  product: ProductSummaryInterface;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
}

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
}) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Бренд / Производитель',
    config: [
      {
        name: 'Рубрикатор',
        href: links.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.root,
      },
      {
        name: `Товары`,
        href: links.products,
      },
      {
        name: `${product.cardTitle}`,
        href: links.product.root,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductBrands
        product={product}
        brand={brand}
        brandCollection={brandCollection}
        manufacturer={manufacturer}
      />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductBrandsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductBrands {...props} />
    </ConsoleLayout>
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
