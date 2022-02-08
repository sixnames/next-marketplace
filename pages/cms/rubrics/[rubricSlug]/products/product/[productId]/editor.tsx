import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductEditor, {
  ConsoleRubricProductEditorInterface,
} from 'components/console/ConsoleRubricProductEditor';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'db/uiInterfaces';
import CmsProductLayout from '../../../../../../../layout/cms/CmsProductLayout';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { getFullProductSummary } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import ConsoleLayout from '../../../../../../../layout/cms/ConsoleLayout';

interface ProductAttributesInterface extends ConsoleRubricProductEditorInterface {}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  cardContent,
  companySlug,
}) => {
  const links = getConsoleRubricLinks({
    productId: product._id,
    rubricSlug: product.rubricSlug,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
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
      <ConsoleRubricProductEditor
        product={product}
        cardContent={cardContent}
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

  const payload = await getFullProductSummary({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { summary, cardContent } = payload;

  return {
    props: {
      ...props,
      product: castDbData(summary),
      cardContent: castDbData(cardContent),
      companySlug,
    },
  };
};

export default Product;
