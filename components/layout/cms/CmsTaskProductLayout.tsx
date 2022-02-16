import { useUserContext } from 'components/context/userContext';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import WpNotification from 'components/WpNotification';
import WpTitle from 'components/WpTitle';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
  TaskInterface,
} from 'db/uiInterfaces';
import Head from 'next/head';
import * as React from 'react';

export interface CmsTaskProductLayoutInterface {
  product: ProductSummaryInterface;
  task: TaskInterface;
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const CmsTaskProductLayout: React.FC<CmsTaskProductLayoutInterface> = ({
  product,
  breadcrumbs,
  children,
}) => {
  const { sessionUser } = useUserContext();

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{product.cardTitle}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle
          subtitle={`Арт. ${product.itemId}`}
          testId={`${product.originalName}-product-title`}
        >
          {product.cardTitle}
        </WpTitle>
        <div className='mb-12'>
          {sessionUser?.role?.isContentManager || sessionUser?.role?.isInspector ? (
            <div className='max-w-[980px]'>
              <WpNotification
                variant={'warning'}
                testId={'draft-warning'}
                message={
                  'Вы редактируете черновик товара. Все изменения должны быть утверждены модератором.'
                }
              />
            </div>
          ) : null}
        </div>
      </Inner>
      {children}
    </AppContentWrapper>
  );
};

export default CmsTaskProductLayout;
