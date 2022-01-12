import Head from 'next/head';
import * as React from 'react';
import WpButton from '../../components/button/WpButton';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { AppContentWrapperBreadCrumbs, ShopProductInterface } from '../../db/uiInterfaces';
import { getCmsCompanyLinks, getConsoleRubricLinks } from '../../lib/linkUtils';
import { ClientNavItemInterface } from '../../types/clientTypes';
import AppContentWrapper from '../AppContentWrapper';
import AppSubNav from '../AppSubNav';

interface ConsoleShopProductLayoutInterface {
  shopProduct: ShopProductInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  basePath?: string;
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
    const links = getCmsCompanyLinks({
      basePath,
      companyId: shopProduct.companyId,
      shopId: shopProduct.shopId,
      productId: shopProduct._id,
      rubricSlug: shopProduct.rubricSlug,
    });

    return [
      {
        name: 'Детали',
        testId: 'details',
        path: links.shop.rubrics.product.root,
        exact: true,
      },
      {
        name: 'Ценообразование',
        testId: 'suppliers',
        path: links.shop.rubrics.product.suppliers,
        exact: true,
      },
    ];
  }, [basePath, shopProduct]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{shopProduct.summary?.snippetTitle}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle
          subtitle={
            <div>
              <div>Арт. {shopProduct.summary?.itemId}</div>
              {showEditButton ? (
                <div className='mt-4'>
                  <WpButton
                    size={'small'}
                    onClick={() => {
                      const productLinks = getConsoleRubricLinks({
                        rubricSlug: shopProduct.rubricSlug,
                        productId: shopProduct.productId,
                      });
                      window.open(productLinks.product.root, '_blank');
                    }}
                  >
                    Редактировать товар
                  </WpButton>
                </div>
              ) : null}
            </div>
          }
          testId={`${shopProduct.summary?.originalName}-product-title`}
        >
          {shopProduct.summary?.snippetTitle}
        </WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      {children}
    </AppContentWrapper>
  );
};

export default ConsoleShopProductLayout;
