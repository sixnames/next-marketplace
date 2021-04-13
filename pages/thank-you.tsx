import Button from 'components/Buttons/Button';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CATALOGUE } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/ThankYouRoute.module.css';

const ThankYouRoute: React.FC = () => {
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  const { query } = router;

  return (
    <div className={classes.frame} data-cy={'thank-you'} data-order-item-id={query.orderId}>
      <Inner>
        <Title className={classes.title}>Спасибо за заказ!</Title>
        <div className={classes.text}>
          <div className={classes.subtitle}>{`Номер вашего заказа ${query.orderId}`}</div>
          <p>
            Наш менеджер свяжется с вами в ближайшее время, чтобы уточнить детали. Также, мы дарим
            вам дисконтную карту, по которой вы сможете получать скидки на все последующие заказы
          </p>
        </div>
        <div className={classes.btns}>
          <Button
            className={classes.btnsItem}
            theme={'secondary'}
            onClick={() => {
              router.push(`/`).catch(() => {
                showErrorNotification();
              });
            }}
          >
            на главную
          </Button>
          <Button
            onClick={() => {
              router.push(`${ROUTE_CATALOGUE}/vino`).catch(() => {
                showErrorNotification();
              });
            }}
            className={classes.btnsItem}
            theme={'secondary'}
          >
            каталог вин
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
  const { query } = context;

  if (!query?.orderId) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default ThankYou;
