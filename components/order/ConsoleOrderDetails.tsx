import { Form, Formik, useFormikContext } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, IMAGE_FALLBACK, ROUTE_CMS } from '../../config/common';
import {
  DELIVERY_VARIANT_OPTIONS,
  getConstantOptionName,
  PAYMENT_VARIANT_OPTIONS,
} from '../../config/constantSelects';
import { CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useLocaleContext } from '../../context/localeContext';
import { useNotificationsContext } from '../../context/notificationsContext';
import { useUserContext } from '../../context/userContext';
import { OrderInterface, OrderProductInterface, OrderStatusInterface } from '../../db/uiInterfaces';
import {
  useCancelOrderProduct,
  useUpdateOrder,
  useUpdateOrderProduct,
} from '../../hooks/mutations/useOrderMutations';
import { getNumWord } from '../../lib/i18n';
import { noNaN } from '../../lib/numbers';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Currency from '../Currency';
import FormattedDateTime from '../FormattedDateTime';
import FormikInput from '../FormElements/Input/FormikInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';
import FormikSpinnerInput from '../FormElements/SpinnerInput/FormikSpinnerInput';
import Inner from '../Inner';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import ProductsListSuppliersList from '../shops/ProductsListSuppliersList';
import WpImage from '../WpImage';
import WpTitle from '../WpTitle';
import OrderDeliveryInfo from './OrderDeliveryInfo';

interface OrderProductProductInterface {
  orderProductIndex: number;
  orderProduct: OrderProductInterface;
  citySlug: string;
  companySlug: string;
  showAdminUi: boolean;
}

const OrderProduct: React.FC<OrderProductProductInterface> = ({
  orderProduct,
  citySlug,
  companySlug,
  orderProductIndex,
  showAdminUi,
}) => {
  const { values } = useFormikContext<OrderInterface>();
  const { showModal } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const { product, originalName, shopProduct, itemId, price, totalPrice, finalPrice, isCanceled } =
    orderProduct;
  const productImageSrc = product?.mainImage || IMAGE_FALLBACK;
  const minAmount = 1;
  const supplierProducts = shopProduct?.supplierProducts || [];

  const [cancelOrderProductMutation] = useCancelOrderProduct();
  const [updateOrderProductMutation] = useUpdateOrderProduct();

  return (
    <div
      className={`flex flex-col sm:flex-row mb-4 py-8 px-4 bg-secondary rounded-lg gap-4 ${
        isCanceled ? 'opacity-60' : ''
      }`}
    >
      {/*image*/}
      <div className='flex flex-col gap-4 items-center px-2 w-full sm:w-28 lg:w-32'>
        <div className='relative flex justify-center flex-shrink-0 w-[120px] h-[120px]'>
          <div className='absolute top-0 left-0 w-full pb-[100%] w-full'>
            <WpImage
              url={productImageSrc}
              alt={`${originalName}`}
              title={`${originalName}`}
              width={120}
              className='absolute inset-0 w-full h-full object-contain'
            />
          </div>
        </div>

        {!isCanceled ? (
          <div className='mt-4 flex gap-4'>
            {/*edit button*/}
            {showAdminUi ? (
              <WpButton
                frameClassName='w-auto'
                title={'Редактироват товар'}
                size={'small'}
                icon={'pencil'}
                circle
                theme={'secondary'}
                onClick={() => {
                  window.open(
                    `${ROUTE_CMS}/rubrics/${product?.rubricId}/products/product/${product?._id}`,
                    '_blank',
                  );
                }}
              />
            ) : (
              <WpButton
                frameClassName='w-auto'
                title={'Сохранить товар'}
                size={'small'}
                icon={'save'}
                circle
                theme={'secondary-b'}
                onClick={() => {
                  const amount = get(values, `products[${orderProductIndex}].amount`);
                  const customDiscount = get(
                    values,
                    `products[${orderProductIndex}].customDiscount`,
                  );
                  if (amount < minAmount) {
                    showErrorNotification({
                      title: `Количество не может быть ниже ${minAmount}`,
                    });
                  } else {
                    updateOrderProductMutation({
                      orderProductId: `${orderProduct._id}`,
                      amount: noNaN(amount),
                      customDiscount: noNaN(customDiscount),
                    }).catch(console.log);
                  }
                }}
              />
            )}

            {/*cancel button*/}
            <WpButton
              frameClassName='w-auto'
              title={'Отменить товар'}
              size={'small'}
              icon={'trash'}
              circle
              theme={'secondary'}
              onClick={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'cancel-order-product-modal',
                    message: `Вы уверенны, что хотите отменть товар ${originalName}?`,
                    confirm: () => {
                      cancelOrderProductMutation({
                        orderProductId: `${orderProduct._id}`,
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        ) : null}
      </div>

      <div className='flex-grow'>
        <div className='grid gap-4 lg:grid-cols-7 lg:justify-between'>
          <div className='lg:col-span-5'>
            {/*status*/}
            {/*<div className='flex items-baseline gap-2'>
              <div className='text-secondary-text'>Статус</div>
              {status ? (
                <div className='font-medium' style={status ? { color: status.color } : {}}>
                  {status.name}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>Статус не найден</div>
              )}
            </div>*/}

            {/*article*/}
            <div className='text-secondary-text mb-3 text-sm'>{`Артикул: ${itemId}`}</div>

            {/*name*/}
            <div className='text-lg font-bold flex-grow mb-2'>
              {product ? (
                <WpLink
                  href={`/${companySlug}/${citySlug}/${product.slug}`}
                  className='block text-primary-text hover:text-theme hover:no-underline'
                  target={'_blank'}
                >
                  {product.cardTitle}
                </WpLink>
              ) : null}
            </div>

            {/*availability*/}
            {shopProduct ? (
              <div className='mt-2'>
                <div>Доступно:{` ${shopProduct.available} шт.`}</div>
              </div>
            ) : (
              <div className='text-red-500 font-medium mt-2'>Товар магазина не найден</div>
            )}

            {/*suppliers*/}
            {supplierProducts.length > 0 ? (
              <div className='mt-6'>
                <div className='font-medium text-lg mb-2'>Поставщики</div>
                <ProductsListSuppliersList supplierProducts={supplierProducts} />
              </div>
            ) : null}
          </div>

          <div className='flex flex-col gap-4 lg:col-span-2'>
            {/*amount*/}
            <div className='text-secondary-text w-full'>
              <InputLine low label={'Количество'} name={`products[${orderProductIndex}].amount`}>
                <FormikSpinnerInput
                  name={`products[${orderProductIndex}].amount`}
                  min={minAmount}
                  max={noNaN(shopProduct?.available)}
                  testId={`cart-dropdown-product-${orderProduct.originalName}-amount`}
                  plusTestId={`cart-dropdown-product-${orderProduct.originalName}-plus`}
                  minusTestId={`cart-dropdown-product-${orderProduct.originalName}-minus`}
                />
              </InputLine>
            </div>

            <div>
              <FormikInput
                low
                max={100}
                min={0}
                label={'Доп. скидка %'}
                name={`products[${orderProductIndex}].customDiscount`}
                type={'number'}
              />
            </div>

            {/*price*/}
            <div className='text-secondary-text items-baseline text-right'>
              <div className='mb-1'>Цена:</div>
              <Currency className='text-xl text-primary-text' value={price} />
            </div>

            {/* discounted price*/}
            <div className='text-secondary-text items-baseline text-right'>
              <div className='mb-1'>Цена со скидкой:</div>
              <Currency className='text-xl text-primary-text' value={finalPrice} />
            </div>

            {/*total price*/}
            <div className='text-secondary-text items-baseline text-right'>
              <div className='mb-1'>Итого:</div>
              <Currency className='text-2xl text-primary-text' value={totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface CmsOrderDetailsBaseInterface {
  order: OrderInterface;
  orderStatuses: OrderStatusInterface[];
}
interface CmsOrderDetailsInterface extends CmsOrderDetailsBaseInterface {
  pageCompanySlug: string;
  title: string;
}

const ConsoleOrderDetails: React.FC<CmsOrderDetailsInterface> = ({
  order,
  pageCompanySlug,
  title,
  orderStatuses,
}) => {
  const { sessionUser } = useUserContext();
  const { locale } = useLocaleContext();
  const showAdminUi = sessionUser?.role?.isStaff;
  const [state, setState] = React.useState(order);
  const {
    createdAt,
    totalPrice,
    discountedPrice,
    status,
    products,
    shop,
    customer,
    comment,
    deliveryVariant,
    paymentVariant,
    deliveryInfo,
    companySiteSlug,
    giftCertificate,
    giftCertificateChargedValue,
  } = state;

  const [updateOrderMutation] = useUpdateOrder();

  const deliveryName = getConstantOptionName({
    options: DELIVERY_VARIANT_OPTIONS,
    value: deliveryVariant,
    locale,
  });
  const paymentName = getConstantOptionName({
    options: PAYMENT_VARIANT_OPTIONS,
    value: paymentVariant,
    locale,
  });

  const productsCount = products?.length;
  const productsCountWord = getNumWord(productsCount, ['товар', 'товара', 'товаров']);

  return (
    <Inner testId={`order-details`}>
      <div className='grid gap-4 md:flex justify-between items-baseline mb-12'>
        <div>
          <WpTitle
            low
            className='flex flex-wrap items-baseline gap-4'
            subtitle={`${productsCount} ${productsCountWord}`}
          >
            {title}
          </WpTitle>
          <div className='text-secondary-text mt-2'>
            от <FormattedDateTime value={createdAt} />
          </div>
        </div>
      </div>

      <Formik<OrderInterface>
        initialValues={state}
        onSubmit={(values) => {
          updateOrderMutation({
            order: values,
          })
            .then((value) => {
              if (value && value.success && value.payload) {
                setState(value.payload);
              }
            })
            .catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <div className='md:grid grid-cols-9 gap-8'>
                <div className='col-span-6'>
                  {products?.map((orderProduct, orderProductIndex) => {
                    return (
                      <OrderProduct
                        showAdminUi={Boolean(showAdminUi)}
                        orderProductIndex={orderProductIndex}
                        citySlug={shop?.citySlug || DEFAULT_CITY}
                        companySlug={companySiteSlug || pageCompanySlug || DEFAULT_COMPANY_SLUG}
                        orderProduct={orderProduct}
                        key={`${orderProduct._id}`}
                      />
                    );
                  })}
                </div>

                <div className='relative col-span-3'>
                  <div className='sticky bg-secondary rounded-lg py-8 px-6'>
                    {/*status*/}
                    {showAdminUi ? (
                      <FormikSelect
                        useIdField
                        label={'Статус'}
                        name={'statusId'}
                        options={orderStatuses}
                        testId={'statusId'}
                      />
                    ) : (
                      <div className='flex items-baseline justify-between mb-6'>
                        <div className='text-secondary-text'>Статус</div>
                        {status ? (
                          <div
                            className='font-medium'
                            style={status ? { color: status.color } : {}}
                          >
                            {status.name}
                          </div>
                        ) : (
                          <div className='text-red-500 font-medium'>Статус не найден</div>
                        )}
                      </div>
                    )}

                    {/*delivery*/}
                    <div className='flex items-baseline justify-between mb-6'>
                      <div className='text-secondary-text'>Доставка</div>
                      <div className='font-medium'>{deliveryName}</div>
                    </div>

                    {/*delivery info*/}
                    <OrderDeliveryInfo
                      className={'mb-6'}
                      labelClassName={'text-secondary-text mb-2'}
                      itemClassName={'flex gap-2 justify-between'}
                      valueClassName={'text-right'}
                      titleClassName={'font-medium lg:text-lg'}
                      deliveryInfo={deliveryInfo}
                    />

                    {/*payment*/}
                    <div className='flex items-baseline justify-between mb-6'>
                      <div className='text-secondary-text'>Оплата</div>
                      <div className='font-medium'>{paymentName}</div>
                    </div>

                    {/*customer*/}
                    <div className='mb-6'>
                      <div className='text-secondary-text mb-3'>Заказчик:</div>
                      {customer ? (
                        <div className='space-y-2'>
                          <div className='font-medium'>{customer?.fullName}</div>
                          <div className='font-medium text-secondary-text'>
                            <LinkEmail value={customer.email} />
                          </div>
                          <div className='font-medium text-secondary-text'>
                            <LinkPhone value={customer.formattedPhone} />
                          </div>
                        </div>
                      ) : (
                        <div className='text-red-500 font-medium'>Заказчик не найден</div>
                      )}
                    </div>

                    {/*comment*/}
                    {comment && comment.length > 0 ? (
                      <div className='mb-6'>
                        <div className='text-secondary-text mb-2'>Комментарий заказчика:</div>
                        <div className='prose'>{comment}</div>
                      </div>
                    ) : null}

                    {/*shop info*/}
                    <div className='mb-6'>
                      <div className='text-secondary-text mb-2'>Магазин:</div>

                      {shop ? (
                        <div className='space-y-1'>
                          <span className='text-primary-text font-medium'>{shop.name}</span>
                          <div className='text-secondary-text'>{shop.address.readableAddress}</div>
                        </div>
                      ) : (
                        <div className='text-red-500 font-medium'>Магазин не найден</div>
                      )}
                    </div>

                    <div className='flex flex-wrap gap-2 items-baseline'>
                      <div className='text-secondary-text'>Итого:</div>
                      <Currency
                        className='text-2xl'
                        valueClassName='font-medium'
                        value={totalPrice}
                      />
                    </div>

                    {totalPrice > discountedPrice ? (
                      <div>
                        <div className='flex flex-wrap gap-2 items-baseline'>
                          <div className='text-secondary-text'>Со скидкой:</div>
                          <Currency
                            className='text-2xl'
                            valueClassName='font-medium'
                            value={discountedPrice}
                          />
                        </div>
                      </div>
                    ) : null}

                    {giftCertificate ? (
                      <div className='mt-4'>
                        <div className='text-secondary-text mb-1'>
                          Применён подарочный сертификат
                        </div>
                        <div>
                          {giftCertificate.name ? `${giftCertificate.name}: ` : 'С кодом: '}
                          {giftCertificate.code}
                          {' на сумму '}
                          <Currency value={giftCertificateChargedValue} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <FixedButtons>
                <WpButton frameClassName={'w-auto'} type={'submit'}>
                  Сохранить
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default ConsoleOrderDetails;
