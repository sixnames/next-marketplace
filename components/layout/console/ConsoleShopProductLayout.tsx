import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import WpTitle from 'components/WpTitle';
import { AppContentWrapperBreadCrumbs, ShopProductInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import Head from 'next/head';
import * as React from 'react';
import { ClientNavItemInterface } from 'types/clientTypes';

interface ConsoleShopProductLayoutInterface {
  shopProduct: ShopProductInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
  showEditButton?: boolean;
}

const ConsoleShopProductLayout: React.FC<ConsoleShopProductLayoutInterface> = ({
  shopProduct,
  breadcrumbs,
  children,
  showEditButton,
}) => {
  const basePath = useBasePath('shopProductId');
  const navConfig: ClientNavItemInterface[] = [
    {
      name: 'Детали',
      testId: 'details',
      path: basePath,
      exact: true,
    },
    {
      name: 'Ценообразование',
      testId: 'suppliers',
      path: `${basePath}/suppliers`,
      exact: true,
    },
  ];

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
                      const productLinks = getProjectLinks({
                        rubricSlug: shopProduct.rubricSlug,
                        productId: shopProduct.productId,
                      });
                      window.open(
                        productLinks.cms.rubrics.rubricSlug.products.product.productId.url,
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
