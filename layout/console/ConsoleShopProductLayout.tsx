import Head from 'next/head';
import * as React from 'react';
import WpButton from '../../components/button/WpButton';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ROUTE_CMS } from '../../config/common';
import { AppContentWrapperBreadCrumbs, ShopProductInterface } from '../../db/uiInterfaces';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

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
        <WpTitle
          subtitle={
            <div>
              <div>Арт. {shopProduct.product?.itemId}</div>
              {showEditButton ? (
                <div className='mt-4'>
                  <WpButton
                    size={'small'}
                    onClick={() => {
                      window.open(
                        `${ROUTE_CMS}/rubrics/${shopProduct.rubricId}/products/product/${shopProduct.productId}`,
                        '_blank',
                      );
                    }}
                  >
                    Редактировать товар
                  </WpButton>
                </div>
              ) : null}
            </div>
          }
          testId={`${shopProduct.product?.originalName}-product-title`}
        >
          {shopProduct.product?.snippetTitle}
        </WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleShopProductLayout;
