import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ConsoleRubricProductEditor from 'components/console/ConsoleRubricProductEditor';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  ProductSummaryInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getFullProductSummary } from 'lib/productUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import ConsoleLayout from 'layout/cms/ConsoleLayout';

interface ProductAttributesInterface {
  product: ProductSummaryInterface;
  pageCompany: CompanyInterface;
  cardContent: SeoContentCitiesInterface;
  routeBasePath: string;
}

const ProductAttributes: React.FC<ProductAttributesInterface> = ({
  product,
  pageCompany,
  routeBasePath,
  cardContent,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
    productId: product._id,
  });
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Контент карточки`,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany.name}`,
        href: links.root,
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
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.snippetTitle}`,
        href: links.rubrics.product.root,
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
      <ConsoleRubricProductEditor
        product={product}
        companySlug={pageCompany.slug}
        seoContentsList={cardContent}
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
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });
  if (!props) {
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

  const payload = await getFullProductSummary({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: companyResult.slug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { summary, seoContentsList } = payload;

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      product: castDbData(summary),
      cardContent: castDbData(seoContentsList),
      pageCompany: castDbData(companyResult),
      routeBasePath: links.root,
    },
  };
};

export default Product;
