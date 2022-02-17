import ConsoleRubricProductBrands from 'components/console/ConsoleRubricProductBrands';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getDbCollections } from 'db/mongodb';
import { getProductFullSummaryWithDraft } from 'db/ssr/products/getProductFullSummary';
import {
  AppContentWrapperBreadCrumbs,
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
  ProductSummaryInterface,
} from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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
        href: links.parentLink,
      },
      {
        name: `Товары`,
        href: links.product.parentLink,
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
  const { productId } = query;
  const collections = await getDbCollections();
  const manufacturersCollection = collections.manufacturersCollection();
  const brandsCollection = collections.brandsCollection();
  const brandCollectionsCollection = collections.brandCollectionsCollection();
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getProductFullSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }
  const { summary } = payload;

  const manufacturerEntity = summary.manufacturerSlug
    ? await manufacturersCollection.findOne(
        {
          itemId: summary.manufacturerSlug,
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

  const brandEntity = summary.brandSlug
    ? await brandsCollection.findOne(
        { itemId: summary.brandSlug },
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

  const brandCollectionEntity = summary.brandCollectionSlug
    ? await brandCollectionsCollection.findOne(
        {
          itemId: summary.brandCollectionSlug,
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
      product: castDbData(summary),
      brand: castDbData(brand),
      brandCollection: castDbData(brandCollection),
      manufacturer: castDbData(manufacturer),
    },
  };
};

export default Product;
