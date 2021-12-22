import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import {
  ShopAddProductsCreateChosenProduct,
  ShopAddProductsDeleteChosenProduct,
  ShopAddProductsFinalStep,
  ShopAddProductsList,
  ShopAddProductsListInterface,
  ShopAddProductsSetStepHandler,
  ShopAddProductsStepType,
} from '../../../../../../../../../components/shops/ShopAddProducts';
import {
  DEFAULT_COMPANY_SLUG,
  DEFAULT_PAGE_FILTER,
  ROUTE_CMS,
} from '../../../../../../../../../config/common';
import { getAddShopProductSsrData } from '../../../../../../../../../db/dao/product/getAddShopProductSsrData';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { alwaysArray, alwaysString } from '../../../../../../../../../lib/arrayUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../../../../lib/ssrUtils';

export type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

interface CompanyShopProductsListInterface
  extends GetAppInitialDataPropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsList: NextPage<CompanyShopProductsListInterface> = ({
  layoutProps,
  shop,
  rubricName,
  rubricId,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductSummaryInterface[]>([]);
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
      <ConsoleLayout {...layoutProps}>
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
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout {...layoutProps}>
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
    </ConsoleLayout>
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
  const currency = initialProps.props.initialData.currency;
  const basePath = `${ROUTE_CMS}/companies/${query.companyId}/shops/shop/${shopId}/products/add/${rubricId}/${DEFAULT_PAGE_FILTER}`;

  const payload = await getAddShopProductSsrData({
    locale,
    basePath,
    query,
    currency,
    companySlug: DEFAULT_COMPANY_SLUG,
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
