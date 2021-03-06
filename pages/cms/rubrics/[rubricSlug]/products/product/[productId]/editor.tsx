import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import CmsProductLayout from 'components/layout/cms/CmsProductLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { getProductFullSummary } from 'db/ssr/products/getProductFullSummary';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface ProductAttributesInterface extends ConsoleRubricProductEditorInterface {}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  seoContentsList,
  companySlug,
}) => {
  const links = getProjectLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: 'Рубрикатор',
        href: links.cms.rubrics.url,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.cms.rubrics.rubricSlug.url,
      },
      {
        name: `Товары`,
        href: links.cms.rubrics.rubricSlug.products.url,
      },
      {
        name: `${product.cardTitle}`,
        href: links.cms.rubrics.rubricSlug.products.product.productId.url,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
      <ConsoleRubricProductEditor
        product={product}
        seoContentsList={seoContentsList}
        companySlug={companySlug}
      />
    </CmsProductLayout>
  );
};

interface ProductPageInterface
  extends GetAppInitialDataPropsInterface,
    ProductAttributesInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductAttributes {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const companySlug = DEFAULT_COMPANY_SLUG;

  const payload = await getProductFullSummary({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { summary, seoContentsList } = payload;

  return {
    props: {
      ...props,
      product: castDbData(summary),
      seoContentsList: castDbData(seoContentsList),
      companySlug,
    },
  };
};

export default Product;
