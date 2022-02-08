import ConsoleRubricProductBrands from 'components/console/ConsoleRubricProductBrands';
import { getTaskVariantSlugByRule, TASK_VARIANT_SLUG_PRODUCT_BRANDS } from 'config/constantSelects';
import { getCompanyTaskSsr } from 'db/dao/ssr/getCompanyTaskSsr';
import CmsTaskProductLayout, {
  CmsTaskProductLayoutInterface,
} from 'layout/cms/CmsTaskProductLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getProjectLinks } from 'lib/getProjectLinks';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_BRAND_COLLECTIONS, COL_BRANDS, COL_MANUFACTURERS } from 'db/collectionNames';
import { BrandCollectionModel, BrandModel, ManufacturerModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  BrandCollectionInterface,
  BrandInterface,
  ManufacturerInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullProductSummaryWithDraft } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface ProductBrandsInterface extends CmsTaskProductLayoutInterface {
  brand?: BrandInterface | null;
  brandCollection?: BrandCollectionInterface | null;
  manufacturer?: ManufacturerInterface | null;
}

const ProductBrands: React.FC<ProductBrandsInterface> = ({
  task,
  product,
  brand,
  brandCollection,
  manufacturer,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    taskId: task._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Бренд / Производитель товара`,
    config: [
      {
        name: 'Мои задачи',
        href: links.cms.myTasks.url,
      },
    ],
  };

  return (
    <CmsTaskProductLayout product={product} task={task} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductBrands
        product={product}
        brand={brand}
        brandCollection={brandCollection}
        manufacturer={manufacturer}
      />
    </CmsTaskProductLayout>
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
  const { db } = await getDatabase();
  const manufacturersCollection = db.collection<ManufacturerModel>(COL_MANUFACTURERS);
  const brandsCollection = db.collection<BrandModel>(COL_BRANDS);
  const brandCollectionsCollection = db.collection<BrandCollectionModel>(COL_BRAND_COLLECTIONS);
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const task = await getCompanyTaskSsr({
    locale: props.sessionLocale,
    taskId: `${query.taskId}`,
    noProduct: true,
  });
  if (!task || task.variantSlug !== TASK_VARIANT_SLUG_PRODUCT_BRANDS) {
    return {
      notFound: true,
    };
  }

  const payload = await getFullProductSummaryWithDraft({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
    userId: props.layoutProps.sessionUser.me._id,
    isContentManager: Boolean(props.layoutProps.sessionUser.me.role?.isContentManager),
    taskVariantSlug: getTaskVariantSlugByRule('updateProductBrand'),
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
      task: castDbData(task),
    },
  };
};

export default Product;
