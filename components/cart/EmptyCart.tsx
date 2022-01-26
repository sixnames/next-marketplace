import { useRouter } from 'next/router';
import * as React from 'react';
import { ROUTE_PROFILE } from '../../config/common';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import WpBreadcrumbs from '../WpBreadcrumbs';
import WpTitle from '../WpTitle';

const EmptyCart: React.FC = () => {
  const router = useRouter();
  return (
    <div>
      <WpBreadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <WpTitle>Корзина пуста</WpTitle>
        <div className='flex flex-wrap gap-4'>
          <WpButton
            frameClassName='w-auto'
            theme={'secondary'}
            onClick={() => {
              router.push('/').catch(console.log);
            }}
          >
            Продолжить покупки
          </WpButton>
          <WpButton
            frameClassName='w-auto'
            theme={'secondary'}
            onClick={() => {
              router.push(ROUTE_PROFILE).catch(console.log);
            }}
          >
            Мои заказы
          </WpButton>
        </div>
      </Inner>
    </div>
  );
};

export default EmptyCart;
