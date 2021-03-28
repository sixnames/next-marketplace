import Button from 'components/Buttons/Button';
import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { useNotificationsContext } from 'context/notificationsContext';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
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
              router.push(`/vino`).catch(() => {
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

interface ThankYouInterface extends PagePropsInterface, SiteLayoutInterface {}

const ThankYou: NextPage<ThankYouInterface> = ({ navRubrics, pageUrls }) => {
  return (
    <SiteLayout title={'Спасибо за заказ!'} navRubrics={navRubrics} pageUrls={pageUrls}>
      <ThankYouRoute />
    </SiteLayout>
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
