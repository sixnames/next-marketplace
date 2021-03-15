import useSessionCity from 'hooks/useSessionCity';
import * as React from 'react';
import classes from './ThankYouRoute.module.css';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import Button from '../../components/Buttons/Button';
import { useRouter } from 'next/router';
import { useNotificationsContext } from 'context/notificationsContext';

const ThankYouRoute: React.FC = () => {
  const { showErrorNotification } = useNotificationsContext();
  const city = useSessionCity();
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
              router.push(`/${city}/`).catch(() => {
                showErrorNotification();
              });
            }}
          >
            на главную
          </Button>
          <Button
            onClick={() => {
              router.push(`/${city}/vino`).catch(() => {
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

export default ThankYouRoute;
