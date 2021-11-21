import Button from 'components/button/Button';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_PROFILE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const ThankYouRoute: React.FC = () => {
  const { urlPrefix } = useSiteContext();
  const router = useRouter();

  return (
    <div className='mb-20' data-cy={'thank-you'}>
      <Inner>
        <Title>Спасибо за Ваш заказ!</Title>

        <div className='prose mb-6'>
          <p>
            Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали. Также, мы дарим
            вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы
          </p>
        </div>

        <div className='flex gap-4 flex-wrap'>
          <Button
            frameClassName={'w-auto'}
            theme={'secondary'}
            onClick={() => {
              router.push(urlPrefix).catch(console.log);
            }}
          >
            Продолжить покупки
          </Button>
          <Button
            frameClassName={'w-auto'}
            onClick={() => {
              router.push(`${urlPrefix}${ROUTE_PROFILE}`).catch(console.log);
            }}
            theme={'secondary'}
          >
            Мои заказы
          </Button>
        </div>
      </Inner>
    </div>
  );
};

type ThankYouInterface = SiteLayoutProviderInterface;

const ThankYou: NextPage<ThankYouInterface> = (props) => {
  return (
    <SiteLayout title={'Спасибо за заказ!'} {...props}>
      <ThankYouRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ThankYouInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default ThankYou;
