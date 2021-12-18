import Breadcrumbs from 'components/Breadcrumbs';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_PROFILE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { useRouter } from 'next/router';
import * as React from 'react';

const EmptyCart: React.FC = () => {
  const router = useRouter();
  const { urlPrefix } = useSiteContext();
  return (
    <div>
      <Breadcrumbs currentPageName={'Корзина'} />

      <Inner lowTop testId={'cart'}>
        <Title>Корзина пуста</Title>
        <div className='flex gap-4 flex-wrap'>
          <WpButton
            frameClassName='w-auto'
            theme={'secondary'}
            onClick={() => {
              router.push(urlPrefix).catch(console.log);
            }}
          >
            Продолжить покупки
          </WpButton>
          <WpButton
            frameClassName='w-auto'
            theme={'secondary'}
            onClick={() => {
              router.push(`${urlPrefix}${ROUTE_PROFILE}`).catch(console.log);
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
