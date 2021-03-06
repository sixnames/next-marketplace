import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import {
  ShopAddProductsCreateChosenProduct,
  ShopAddProductsDeleteChosenProduct,
  ShopAddProductsFinalStep,
  ShopAddProductsList,
  ShopAddProductsListInterface,
  ShopAddProductsSetStepHandler,
  ShopAddProductsStepType,
} from 'components/shops/ShopAddProducts';
import { getConsoleShopAddProductsListPageSsr } from 'db/ssr/shops/getConsoleShopAddProductsListPageSsr';
import { AppContentWrapperBreadCrumbs, ProductSummaryInterface } from 'db/uiInterfaces';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';
import { NextPage } from 'next';
import * as React from 'react';

type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

export interface ConsoleShopAddProductsListPageInterface
  extends GetConsoleInitialDataPropsInterface,
    ShopAddProductsListRouteReduced {}

const ConsoleShopAddProductsListPage: NextPage<ConsoleShopAddProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  rubricSlug,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductSummaryInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);
  const links = getProjectLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Добавление товаров',
    config: [
      {
        name: 'Магазины',
        href: links.console.companyId.shops.url,
      },
      {
        name: shop.name,
        href: links.console.companyId.shops.shop.shopId.url,
      },
      {
        name: 'Товары',
        href: links.console.companyId.shops.shop.shopId.rubrics.url,
      },
      {
        name: rubricName,
        href: links.console.companyId.shops.shop.shopId.rubrics.rubricSlug.url,
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
          rubricSlug={rubricSlug}
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
        rubricSlug={rubricSlug}
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

export const getServerSideProps = getConsoleShopAddProductsListPageSsr;
export default ConsoleShopAddProductsListPage;
