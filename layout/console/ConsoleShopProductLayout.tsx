import Button from 'components/Button';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
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
  showEditButton?: boolean;
}

const ConsoleShopProductLayout: React.FC<ConsoleShopProductLayoutInterface> = ({
  shopProduct,
  breadcrumbs,
  children,
  basePath,
  showEditButton,
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
        name: 'Ценообразование',
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
          subtitle={
            <div>
              <div>Арт. ${shopProduct.product?.itemId}</div>
              {showEditButton ? (
                <div className='mt-4'>
                  <Button
                    size={'small'}
                    onClick={() => {
                      window.open(
                        `${ROUTE_CMS}/rubrics/${shopProduct.rubricId}/products/product/${shopProduct.productId}`,
                        '_blank',
                      );
                    }}
                  >
                    Редактировать товар
                  </Button>
                </div>
              ) : null}
            </div>
          }
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
