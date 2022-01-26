import * as React from 'react';
import { IconType } from '../types/iconTypes';
import WpIcon from './WpIcon';

interface OrderStepsDescriptionItemInterface {
  icon: IconType;
}

const OrderStepsDescriptionItem: React.FC<OrderStepsDescriptionItemInterface> = ({
  children,
  icon,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-secondary text-theme'>
        <WpIcon name={icon} className='h-[60%] w-[60%]' />
      </div>
      <div className='flex-grow'>
        <div className='prose max-w-[15rem]'>{children}</div>
      </div>
    </div>
  );
};

const OrderStepsDescription: React.FC = () => {
  return (
    <section>
      <h2 className='mb-6 text-2xl font-medium'>Процесс покупки</h2>

      <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        <OrderStepsDescriptionItem icon={'grapes'}>
          Заказывайте на сайте, а мы всегда поможем вам сделать правильный выбор
        </OrderStepsDescriptionItem>
        <OrderStepsDescriptionItem icon={'marker-thin'}>
          Получайте ваш заказ на следующий день в выбранном вами магазине
        </OrderStepsDescriptionItem>
        <OrderStepsDescriptionItem icon={'payment'}>
          Оплачивайте при получении любым удобным для вас способом
        </OrderStepsDescriptionItem>
      </div>
    </section>
  );
};

export default OrderStepsDescription;
