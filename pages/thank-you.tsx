import Button from 'components/Buttons/Button';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_PROFILE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';

const ThankYouRoute: React.FC = () => {
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();

  return (
    <div className='mb-20' data-cy={'thank-you'}>
      <Inner>
        <Title>Спасибо за заказ!</Title>

        <div className='prose mb-6'>
          <p>
            Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали. Также, мы дарим
            вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы
          </p>
        </div>
        <div className='flex gap-4 flex-wrap'>
          <Button
            theme={'secondary'}
            onClick={() => {
              router.push(`/`).catch(() => {
                showErrorNotification();
              });
            }}
          >
            Продолжить покупки
          </Button>
          <Button
            onClick={() => {
              router.push(ROUTE_PROFILE).catch(() => {
                showErrorNotification();
              });
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
    <SiteLayoutProvider title={'Спасибо за заказ!'} {...props}>
      <ThankYouRoute />
    </SiteLayoutProvider>
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
