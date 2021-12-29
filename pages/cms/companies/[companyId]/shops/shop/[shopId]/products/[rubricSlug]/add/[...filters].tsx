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
} from '../../../../../../../../../../components/shops/ShopAddProducts';
import { getCompanyShopAddProductsListPageSsr } from '../../../../../../../../../../db/dao/ssr/getCompanyShopAddProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
} from '../../../../../../../../../../db/uiInterfaces';
import ConsoleLayout from '../../../../../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../../../../../lib/linkUtils';
import { GetAppInitialDataPropsInterface } from '../../../../../../../../../../lib/ssrUtils';

export type ShopAddProductsListRouteReduced = Omit<
  ShopAddProductsListInterface,
  'chosen' | 'createChosenProduct' | 'deleteChosenProduct' | 'setStepHandler' | 'layoutBasePath'
>;

export interface CompanyShopAddProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    ShopAddProductsListRouteReduced {}

const CompanyShopAddProductsListPage: NextPage<CompanyShopAddProductsListPageInterface> = ({
  layoutProps,
  shop,
  rubricName,
  rubricSlug,
  ...props
}) => {
  const [chosen, setChosen] = React.useState<ProductSummaryInterface[]>([]);
  const [step, setStep] = React.useState<ShopAddProductsStepType>(1);

  const { root, parentLink, shops, ...links } = getCmsCompanyLinks({
    companyId: shop.companyId,
    shopId: shop._id,
    rubricSlug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Изображения',
    config: [
      {
        name: 'Компании',
        href: parentLink,
      },
      {
        name: `${shop.company?.name}`,
        href: root,
      },
      {
        name: 'Магазины',
        href: shops,
      },
      {
        name: shop.name,
        href: links.shop.root,
      },
      {
        name: 'Товары',
        href: links.shop.products.root,
      },
      {
        name: rubricName,
        href: links.shop.products.rubric.root,
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
          layoutBasePath={links.shop.itemPath}
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
        layoutBasePath={links.shop.itemPath}
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

export const getServerSideProps = getCompanyShopAddProductsListPageSsr;
export default CompanyShopAddProductsListPage;
