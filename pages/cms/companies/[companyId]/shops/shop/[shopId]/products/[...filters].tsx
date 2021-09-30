import { FILTER_SEPARATOR, QUERY_FILTER_PAGE, ROUTE_CMS } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getConsoleShopProducts } from 'lib/consoleProductUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
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
  const { query } = context;
  const { shopId, filters } = query;
  const [rubricId] = alwaysArray(filters);
  const initialProps = await getAppInitialData({ context });
  if (!initialProps || !initialProps.props) {
    return {
      notFound: true,
    };
  }

  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/${rubricId}/${QUERY_FILTER_PAGE}${FILTER_SEPARATOR}1`;
  const locale = initialProps.props.sessionLocale;

  const payload = await getConsoleShopProducts({
    visibleOptionsCount: initialProps.props.initialData.configs.catalogueFilterVisibleOptionsCount,
    basePath,
    locale,
    query,
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
