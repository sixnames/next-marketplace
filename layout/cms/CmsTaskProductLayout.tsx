import WpNotification from 'components/WpNotification';
import { useUserContext } from 'context/userContext';
import Head from 'next/head';
import * as React from 'react';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import {
  AppContentWrapperBreadCrumbs,
  ProductSummaryInterface,
  TaskInterface,
} from 'db/uiInterfaces';
import AppContentWrapper from '../AppContentWrapper';

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
        <div className='space-y-6'>
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
