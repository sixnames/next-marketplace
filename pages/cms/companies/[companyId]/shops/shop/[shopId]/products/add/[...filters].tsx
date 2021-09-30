import { FILTER_SEPARATOR, QUERY_FILTER_PAGE, ROUTE_CMS } from 'config/common';
import { ProductInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { getAddShopProductSsrData } from 'lib/consoleProductUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import {
  ShopAddProductsCreateChosenProduct,
  ShopAddProductsDeleteChosenProduct,
  ShopAddProductsFinalStep,
  ShopAddProductsList,
  ShopAddProductsListInterface,
  ShopAddProductsSetStepHandler,
  ShopAddProductsStepType,
} from 'components/shops/ShopAddProducts';

export type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

interface CompanyShopProductsListInterface
  extends PagePropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsList: NextPage<CompanyShopProductsListInterface> = ({
  pageUrls,
  shop,
  rubricName,
  rubricId,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);
  const companyBasePath = `${ROUTE_CMS}/companies/${shop.companyId}`;
  const layoutBasePath = `${companyBasePath}/shops/shop`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Добавление товаров',
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
      {
        name: rubricName,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubricId}`,
      },
    ],
  };

  const createChosenProduct: ShopAddProductsCreateChosenProduct = (product) => {
    setChosen((prevState) => {
      return [...prevState, product];
    });
  };

  const deleteChosenProduct: ShopAddProductsDeleteChosenProduct = (product) => {
    setChosen((prevState) => {
      const filteredProducts = prevState.filter(({ _id }) => _id !== product._id);
      return filteredProducts;
    });
  };

  const setStepHandler: ShopAddProductsSetStepHandler = (step) => {
    setStep(step);
  };

  if (step === 2) {
    return (
      <CmsLayout pageUrls={pageUrls}>
        <ShopAddProductsFinalStep
          breadcrumbs={breadcrumbs}
          rubricName={rubricName}
          rubricId={rubricId}
          layoutBasePath={layoutBasePath}
          createChosenProduct={createChosenProduct}
          deleteChosenProduct={deleteChosenProduct}
          setStepHandler={setStepHandler}
          chosen={chosen}
          shop={shop}
          {...props}
        />
      </CmsLayout>
    );
  }

  return (
    <CmsLayout pageUrls={pageUrls}>
      <ShopAddProductsList
        breadcrumbs={breadcrumbs}
        rubricName={rubricName}
        rubricId={rubricId}
        layoutBasePath={layoutBasePath}
        createChosenProduct={createChosenProduct}
        deleteChosenProduct={deleteChosenProduct}
        setStepHandler={setStepHandler}
        chosen={chosen}
        shop={shop}
        {...props}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyShopProductsListInterface>> => {
  const { query } = context;
  const shopId = alwaysString(query.shopId);
  const [rubricId] = alwaysArray(query.filters);
  const initialProps = await getAppInitialData({ context });

  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/add/${rubricId}/${QUERY_FILTER_PAGE}${FILTER_SEPARATOR}1`;

  const payload = await getAddShopProductSsrData({
    locale,
    basePath,
    query,
    visibleOptionsCount: initialProps.props.initialData.configs.catalogueFilterVisibleOptionsCount,
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

export default CompanyShopAddProductsList;