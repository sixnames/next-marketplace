import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import WpButton from '../components/button/WpButton';
import Inner from '../components/Inner';
import WpTitle from '../components/WpTitle';
import SiteLayout, { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { getProjectLinks } from '../lib/getProjectLinks';
import { getSiteInitialData } from '../lib/ssrUtils';

const links = getProjectLinks();

const ThankYouRoute: React.FC = () => {
  const router = useRouter();

  return (
    <div className='mb-20' data-cy={'thank-you'}>
      <Inner>
        <WpTitle>Спасибо за Ваш заказ!</WpTitle>

        <div className='prose mt-14 mb-6'>
          <p>
            Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали. Также, мы дарим
            вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы
          </p>
        </div>

        <div className='flex flex-wrap gap-4'>
          <WpButton
            frameClassName={'w-auto'}
            theme={'secondary'}
            onClick={() => {
              router.push('/').catch(console.log);
            }}
          >
            Продолжить покупки
          </WpButton>
          <WpButton
            frameClassName={'w-auto'}
            onClick={() => {
              router.push(links.profile.url).catch(console.log);
            }}
            theme={'secondary'}
          >
            Мои заказы
          </WpButton>
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
    props: {
      ...props,
      showForIndex: false,
    },
  };
}

export default ThankYou;
