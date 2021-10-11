import { ROUTE_CONSOLE } from 'config/common';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { getConsoleShopProducts } from 'lib/consoleProductUtils';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import ShopRubricProducts, {
  ShopRubricProductsInterface,
} from 'components/shops/ShopRubricProducts';

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    Omit<ShopRubricProductsInterface, 'layoutBasePath'> {}

const CompanyShopProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  rubricName,
  currentCompany,
  ...props
}) => {
  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: rubricName,
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shop/${shop._id}/products`,
      },
    ],
  };

  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <ShopRubricProducts
        rubricName={rubricName}
        breadcrumbs={breadcrumbs}
        layoutBasePath={`${companyBasePath}/shop`}
        shop={shop}
        {...props}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const { query } = context;
  const companyId = alwaysString(query.companyId);
  const shopId = alwaysString(query.shopId);
  const [rubricId] = alwaysArray(query.filters);
  const initialProps = await getConsoleInitialData({ context });
  if (!initialProps || !initialProps.props) {
    return {
      notFound: true,
    };
  }
  const basePath = `${ROUTE_CONSOLE}/${companyId}/shops/shop/${shopId}/products/${rubricId}`;
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const payload = await getConsoleShopProducts({
    basePath,
    locale,
    query,
    currency,
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
