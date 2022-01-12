import { NextPage } from 'next';
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
import { getConsoleShopAddProductsListPageSsr } from '../../../../../../../../../db/dao/ssr/getConsoleShopAddProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../layout/cms/ConsoleLayout';
import { getConsoleCompanyLinks } from '../../../../../../../../../lib/linkUtils';
import { GetConsoleInitialDataPropsInterface } from '../../../../../../../../../lib/ssrUtils';

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
  const links = getConsoleCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Добавление товаров',
    config: [
      {
        name: 'Магазины',
        href: links.shop.parentLink,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.rubrics.parentLink,
      },
      {
        name: rubricName,
        href: links.shop.rubrics.root,
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
          layoutBasePath={links.root}
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
        layoutBasePath={links.parentLink}
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
