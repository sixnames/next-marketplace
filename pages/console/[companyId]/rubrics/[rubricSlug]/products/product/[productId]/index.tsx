import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import CompanyProductDetails, {
  CompanyProductDetailsInterface,
} from '../../../../../../../../components/company/CompanyProductDetails';
import { COL_COMPANIES } from '../../../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
} from '../../../../../../../../db/uiInterfaces';
import CmsProductLayout from '../../../../../../../../layout/cms/CmsProductLayout';
import ConsoleLayout from '../../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../../../lib/linkUtils';
import { getCmsProduct } from '../../../../../../../../lib/productUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../../../../../lib/ssrUtils';

interface ProductDetailsInterface extends CompanyProductDetailsInterface {
  pageCompany: CompanyInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  product,
  routeBasePath,
  companySlug,
  cardContent,
  pageCompany,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany._id,
    rubricSlug: product.rubricSlug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: `Рубрикатор`,
        href: links.rubrics.parentLink,
      },
      {
        name: `${product.rubric?.name}`,
        href: links.rubrics.root,
      },
      {
        name: `Товары`,
        href: links.rubrics.product.parentLink,
      },
    ],
  };

  return (
    <CmsProductLayout
      hideAssetsPath
      hideAttributesPath
      hideBrandPath
      hideCategoriesPath
      hideConnectionsPath
      hideCardConstructor
      hideDeleteButton
      product={product}
      basePath={routeBasePath}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductDetails
        routeBasePath={routeBasePath}
        product={product}
        companySlug={companySlug}
        cardContent={cardContent}
      />
    </CmsProductLayout>
  );
};

interface ProductPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, companyId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getConsoleInitialData({ context });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const companyResult = await companiesCollection.findOne({
    _id: new ObjectId(`${companyId}`),
  });
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

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
  });

  return {
    props: {
      ...props,
      product: castDbData(payload.product),
      cardContent: castDbData(payload.cardContent),
      companySlug: companyResult.slug,
      pageCompany: castDbData(props.layoutProps.pageCompany),
      routeBasePath: links.parentLink,
    },
  };
};

export default Product;
