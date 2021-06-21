import Icon from 'components/Icon';
import * as React from 'react';
import { IconType } from 'types/iconTypes';

interface OrderStepsDescriptionItemInterface {
  icon: IconType;
}

const OrderStepsDescriptionItem: React.FC<OrderStepsDescriptionItemInterface> = ({
  children,
  icon,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='flex flex-shrink-0 justify-center items-center w-20 h-20 border-[3px] border-secondary rounded-full text-theme'>
        <Icon name={icon} className='w-[60%] h-[60%]' />
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
      <h2 className='text-2xl font-medium mb-6'>Процесс покупки</h2>

      <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        <OrderStepsDescriptionItem icon={'grapes'}>
          Заказывайте на сайте, а мы всегда поможем вам сделать правильный выбор
        </OrderStepsDescriptionItem>
        <OrderStepsDescriptionItem icon={'marker-thin'}>
          Получайте ваш заказ на следующий день в выбранной вами винотеке
        </OrderStepsDescriptionItem>
        <OrderStepsDescriptionItem icon={'payment'}>
          Оплачивайте при получении любым удобным для вас способом
        </OrderStepsDescriptionItem>
      </div>
    </section>
  );
};

export default OrderStepsDescription;
