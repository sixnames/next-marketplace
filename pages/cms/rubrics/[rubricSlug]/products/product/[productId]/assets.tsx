import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ConsoleRubricProductAssets from '../../../../../../../components/console/ConsoleRubricProductAssets';
import { DEFAULT_COMPANY_SLUG } from '../../../../../../../config/common';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleRubricLinks } from '../../../../../../../lib/linkUtils';
import { getCmsProduct } from '../../../../../../../lib/productUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../lib/ssrUtils';

interface ProductAssetsInterface {
  product: ProductSummaryInterface;
}

const ProductAssets: React.FC<ProductAssetsInterface> = ({ product }) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
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
      <ConsoleRubricProductAssets product={product} />
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends GetAppInitialDataPropsInterface, ProductAssetsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductAssets {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
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

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
    },
  };
};

export default Product;
