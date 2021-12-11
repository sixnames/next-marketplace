import { ROUTE_CONSOLE } from 'config/common';
import { getAddShopProductSsrData } from 'db/dao/product/getAddShopProductSsrData';
import { AppContentWrapperBreadCrumbs, ProductInterface } from 'db/uiInterfaces';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
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
} from 'components/shops/ShopAddProducts';

type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

interface CompanyShopProductsListInterface
  extends GetConsoleInitialDataPropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsList: NextPage<CompanyShopProductsListInterface> = ({
  layoutProps,
  shop,
  rubricName,
  rubricId,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);
  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops/shop/${shop._id}`;
  const layoutBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops/shop`;

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Добавление товаров',
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/products`,
      },
      {
        name: rubricName,
        href: `${companyBasePath}/products/${rubricId}`,
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
  const companyId = alwaysString(query.companyId);
  const shopId = alwaysString(query.shopId);
  const [rubricId] = alwaysArray(query.filters);
  const initialProps = await getConsoleInitialData({ context });
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = `${ROUTE_CONSOLE}/${companyId}/shops/shop/${shopId}/products/add/${rubricId}`;

  const payload = await getAddShopProductSsrData({
    locale,
    basePath,
    query,
    currency,
    companySlug: initialProps.props.layoutProps.pageCompany.slug,
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
