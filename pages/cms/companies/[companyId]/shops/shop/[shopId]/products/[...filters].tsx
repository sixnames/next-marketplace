import { FILTER_SEPARATOR, FILTER_PAGE_KEY, ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { CompanyModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getConsoleShopProducts } from 'lib/consoleProductUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopRubricProducts, {
  ShopRubricProductsInterface,
} from 'components/shops/ShopRubricProducts';

export interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  rubricName,
  ...props
}) => {
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${shop.company?.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shops/shop/${shop._id}/products`,
      },
    ],
  };

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopRubricProducts
        breadcrumbs={breadcrumbs}
        layoutBasePath={`${companyBasePath}/shops/shop`}
        shop={shop}
        rubricName={rubricName}
        {...props}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const { query } = context;
  const { shopId, filters } = query;
  const [rubricId] = alwaysArray(filters);
  const initialProps = await getAppInitialData({ context });
  if (!initialProps || !initialProps.props) {
    return {
      notFound: true,
    };
  }

  const company = await companiesCollection.findOne({
    _id: new ObjectId(`${query.companyId}`),
  });
  if (!company) {
    return {
      notFound: true,
    };
  }

  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/${rubricId}/${FILTER_PAGE_KEY}${FILTER_SEPARATOR}1`;
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;

  const payload = await getConsoleShopProducts({
    basePath,
    locale,
    query,
    currency,
    companySlug: company.slug,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
    },
  };
};

export default CompanyShopProductsList;
