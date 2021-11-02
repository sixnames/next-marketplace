import Inner from 'components/Inner';
import Title from 'components/Title';
import { ShopProductInterface } from 'db/uiInterfaces';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface ConsoleShopProductLayoutInterface {
  shopProduct: ShopProductInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath: string;
}

const ConsoleShopProductLayout: React.FC<ConsoleShopProductLayoutInterface> = ({
  shopProduct,
  breadcrumbs,
  children,
  basePath,
}) => {
  const navConfig = React.useMemo<ClientNavItemInterface[]>(() => {
    return [
      {
        name: 'Детали',
        testId: 'details',
        path: `${basePath}/${shopProduct._id}`,
        exact: true,
      },
      {
        name: 'Контент карточки',
        testId: 'constructor',
        path: `${basePath}/${shopProduct._id}/constructor`,
        exact: true,
      },
      {
        name: 'Поставщики',
        testId: 'suppliers',
        path: `${basePath}/${shopProduct._id}/suppliers`,
        exact: true,
      },
    ];
  }, [basePath, shopProduct._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{shopProduct.product?.snippetTitle}</title>
      </Head>
      <Inner lowBottom>
        <Title
          subtitle={`Арт. ${shopProduct.product?.itemId}`}
          testId={`${shopProduct.product?.originalName}-product-title`}
        >
          {shopProduct.product?.snippetTitle}
        </Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleShopProductLayout;
