import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductBrands from '../../../../../../../../../components/console/ConsoleRubricProductBrands';
import {
  COL_BRAND_COLLECTIONS,
  COL_BRANDS,
  COL_COMPANIES,
  COL_MANUFACTURERS,
} from '../../../../../../../../../db/collectionNames';
import {
  BrandCollectionModel,
  BrandModel,
  ManufacturerModel,
} from '../../../../../../../../../db/dbModels';
import { getDatabase } from '../../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  BrandCollectionInterface,
  BrandInterface,
  CompanyInterface,
  ManufacturerInterface,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../../../../../../lib/i18n';
import { getCmsCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { getCmsProduct } from '../../../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

interface ProductBrandsInterface {
  product: ProductSummaryInterface;
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  product,
  brand,
  brandCollection,
  manufacturer,
  pageCompany,
  routeBasePath,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Бренд / Производитель`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.parentLink,
      },
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.rubrics.parentLink,
      },
      {
        name: `Товары`,
        href: links.rubrics.products,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.rubrics.product.parentLink,
      },
    ],
  };

  return (
    <CmsProductLayout
      companySlug={pageCompany.slug}
      product={product}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
    >
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
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      product: castDbData(product),
      brand: castDbData(brand),
      brandCollection: castDbData(brandCollection),
      manufacturer: castDbData(manufacturer),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.parentLink,
    },
  };
};

export default Product;
