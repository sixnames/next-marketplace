import { OrderInterface, OrderProductInterface, OrderStatusInterface } from 'db/uiInterfaces';
import { Form, Formik, useFormikContext } from 'formik';
import {
  useCancelOrderProduct,
  useUpdateOrder,
  useUpdateOrderProduct,
} from 'hooks/mutations/useOrderMutations';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, IMAGE_FALLBACK } from 'lib/config/common';
import {
  DELIVERY_VARIANT_OPTIONS,
  getConstantOptionName,
  PAYMENT_VARIANT_OPTIONS,
} from 'lib/config/constantSelects';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getNumWord } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import { get } from 'lodash';
import * as React from 'react';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import { useLocaleContext } from '../context/localeContext';
import { useNotificationsContext } from '../context/notificationsContext';
import { useUserContext } from '../context/userContext';
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
import Percent from '../Percent';
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
  const {
    summary,
    originalName,
    shopProduct,
    itemId,
    price,
    totalPrice,
    finalPrice,
    isCanceled,
    orderPromo,
  } = orderProduct;
  const productImageSrc = summary?.mainImage || IMAGE_FALLBACK;
  const minAmount = 1;
  const supplierProducts = shopProduct?.supplierProducts || [];
  const barcode = shopProduct?.barcode || [];

  const [cancelOrderProductMutation] = useCancelOrderProduct();
  const [updateOrderProductMutation] = useUpdateOrderProduct();

  const summaryLinks = getProjectLinks({
    productId: summary?._id,
    rubricSlug: summary?.rubricSlug,
  });

  return (
    <div
      className={`mb-4 flex flex-col gap-4 rounded-lg bg-secondary py-8 px-4 sm:flex-row ${
        isCanceled ? 'opacity-60' : ''
      }`}
    >
      {/*image*/}
      <div className='flex w-full flex-col items-center gap-4 px-2 sm:w-28 lg:w-32'>
        <div className='relative flex h-[120px] w-[120px] flex-shrink-0 justify-center'>
          <div className='absolute top-0 left-0 w-full w-full pb-[100%]'>
            <WpImage
              url={productImageSrc}
              alt={`${originalName}`}
              title={`${originalName}`}
              width={120}
              className='absolute inset-0 h-full w-full object-contain'
            />
          </div>
        </div>

        {!isCanceled ? (
          <div className='mt-4 flex gap-4'>
            {/*edit button*/}
            {showAdminUi ? (
              <WpButton
                frameClassName='w-auto'
                title={'???????????????????????? ??????????'}
                size={'small'}
                icon={'pencil'}
                circle
                theme={'secondary'}
                onClick={() => {
                  window.open(
                    summaryLinks.cms.rubrics.rubricSlug.products.product.productId.url,
                    '_blank',
                  );
                }}
              />
            ) : (
              <WpButton
                frameClassName='w-auto'
                title={'?????????????????? ??????????'}
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
                      title: `???????????????????? ???? ?????????? ???????? ???????? ${minAmount}`,
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
              title={'???????????????? ??????????'}
              size={'small'}
              icon={'trash'}
              circle
              theme={'secondary'}
              onClick={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'cancel-order-product-modal',
                    message: `???? ????????????????, ?????? ???????????? ?????????????? ?????????? ${originalName}?`,
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
              <div className='text-secondary-text'>????????????</div>
              {status ? (
                <div className='font-medium' style={status ? { color: status.color } : {}}>
                  {status.name}
                </div>
              ) : (
                <div className='text-red-500 font-medium'>???????????? ???? ????????????</div>
              )}
            </div>*/}

            {/*article*/}
            <div className='mb-3 flex flex-wrap gap-4'>
              <div className='text-sm text-secondary-text'>{`??????????????: ${itemId}`}</div>
              {barcode.length > 0 ? (
                <div className='text-sm text-secondary-text'>
                  {`????????????????: ${barcode.join(', ')}`}
                </div>
              ) : null}
            </div>

            {/*name*/}
            <div className='mb-2 flex-grow text-lg font-bold'>
              {summary ? (
                <WpLink
                  href={`/${companySlug}/${citySlug}/${summary.slug}`}
                  className='block text-primary-text hover:text-theme hover:no-underline'
                  target={'_blank'}
                >
                  {summary.cardTitle}
                </WpLink>
              ) : null}
            </div>

            {/*availability*/}
            {shopProduct ? (
              <div className='mt-2'>
                <div>????????????????:{` ${shopProduct.available} ????.`}</div>
              </div>
            ) : (
              <div className='mt-2 font-medium text-red-500'>?????????? ???????????????? ???? ????????????</div>
            )}

            {/*suppliers*/}
            {supplierProducts.length > 0 ? (
              <div className='mt-6'>
                <div className='mb-2 text-lg font-medium'>????????????????????</div>
                <ProductsListSuppliersList supplierProducts={supplierProducts} />
              </div>
            ) : null}

            {orderPromo && orderPromo.length > 0 ? (
              <div className='mt-6'>
                <div className='mb-2 text-lg font-medium'>?????????????????????? ??????????</div>
                <div className='space-y-4 text-secondary-text'>
                  {orderPromo.map((promo) => {
                    return (
                      <div className='flex flex-wrap gap-3' key={`${promo._id}`}>
                        <div>{promo.promo?.name || '???????????????? ?????????? ???? ??????????????'}</div>
                        <div>
                          ???????????? <Percent value={promo.discountPercent} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className='flex flex-col gap-4 lg:col-span-2'>
            {/*amount*/}
            <div className='w-full text-secondary-text'>
              <InputLine low label={'????????????????????'} name={`products[${orderProductIndex}].amount`}>
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
                label={'??????. ???????????? %'}
                name={`products[${orderProductIndex}].customDiscount`}
                type={'number'}
              />
            </div>

            {/*price*/}
            <div className='items-baseline text-right text-secondary-text'>
              <div className='mb-1'>????????:</div>
              <Currency className='text-xl text-primary-text' value={price} />
            </div>

            {/* discounted price*/}
            <div className='items-baseline text-right text-secondary-text'>
              <div className='mb-1'>???????? ???? ??????????????:</div>
              <Currency className='text-xl text-primary-text' value={finalPrice} />
            </div>

            {/*total price*/}
            <div className='items-baseline text-right text-secondary-text'>
              <div className='mb-1'>??????????:</div>
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
    orderPromo,
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
  const productsCountWord = getNumWord(productsCount, ['??????????', '????????????', '??????????????']);

  return (
    <Inner testId={`order-details`}>
      <div className='mb-12 grid items-baseline justify-between gap-4 md:flex'>
        <div>
          <WpTitle
            low
            className='flex flex-wrap items-baseline gap-4'
            subtitle={`${productsCount} ${productsCountWord}`}
          >
            {title}
          </WpTitle>
          <div className='mt-2 text-secondary-text'>
            ???? <FormattedDateTime value={createdAt} />
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
              <div className='grid-cols-9 gap-8 md:grid'>
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
                  <div className='sticky rounded-lg bg-secondary py-8 px-6'>
                    {/*status*/}
                    {showAdminUi ? (
                      <FormikSelect
                        useIdField
                        label={'????????????'}
                        name={'statusId'}
                        options={orderStatuses}
                        testId={'statusId'}
                      />
                    ) : (
                      <div className='mb-6 flex items-baseline justify-between'>
                        <div className='text-secondary-text'>????????????</div>
                        {status ? (
                          <div
                            className='font-medium'
                            style={status ? { color: status.color } : {}}
                          >
                            {status.name}
                          </div>
                        ) : (
                          <div className='font-medium text-red-500'>???????????? ???? ????????????</div>
                        )}
                      </div>
                    )}

                    {/*delivery*/}
                    <div className='mb-6 flex items-baseline justify-between'>
                      <div className='text-secondary-text'>????????????????</div>
                      <div className='font-medium'>{deliveryName}</div>
                    </div>

                    {/*delivery info*/}
                    <OrderDeliveryInfo
                      className={'mb-6'}
                      labelClassName={'text-secondary-text mb-2'}
                      itemClassName={'flex gap-2 justify-between'}
                      valueClassName={'text-right text-primary-text'}
                      titleClassName={'font-medium lg:text-lg'}
                      deliveryInfo={deliveryInfo}
                    />

                    {/*payment*/}
                    <div className='mb-6 flex items-baseline justify-between'>
                      <div className='text-secondary-text'>????????????</div>
                      <div className='font-medium'>{paymentName}</div>
                    </div>

                    {/*customer*/}
                    <div className='mb-6'>
                      <div className='mb-3 text-secondary-text'>????????????????:</div>
                      {customer ? (
                        <div className='space-y-2'>
                          <div className='font-medium text-primary-text'>{customer?.fullName}</div>
                          <div className='font-medium text-secondary-text'>
                            <LinkEmail value={customer.email} />
                          </div>
                          <div className='font-medium text-secondary-text'>
                            <LinkPhone value={customer.formattedPhone} />
                          </div>
                        </div>
                      ) : (
                        <div className='font-medium text-red-500'>???????????????? ???? ????????????</div>
                      )}
                    </div>

                    {/*comment*/}
                    {comment && comment.length > 0 ? (
                      <div className='mb-6'>
                        <div className='mb-2 text-secondary-text'>?????????????????????? ??????????????????:</div>
                        <div className='prose'>{comment}</div>
                      </div>
                    ) : null}

                    {/*shop info*/}
                    <div className='mb-6'>
                      <div className='mb-2 text-secondary-text'>??????????????:</div>

                      {shop ? (
                        <div className='space-y-1'>
                          <span className='font-medium text-primary-text'>{shop.name}</span>
                          <div className='text-secondary-text'>{shop.address.readableAddress}</div>
                        </div>
                      ) : (
                        <div className='font-medium text-red-500'>?????????????? ???? ????????????</div>
                      )}
                    </div>

                    <div
                      className='flex flex-wrap items-baseline gap-2'
                      data-cy={'order-total-price'}
                    >
                      <div className='text-secondary-text'>??????????:</div>
                      <Currency
                        className='text-2xl'
                        valueClassName='font-medium'
                        value={totalPrice}
                      />
                    </div>

                    {totalPrice > discountedPrice ? (
                      <div data-cy={'order-discounted-price'}>
                        <div className='flex flex-wrap items-baseline gap-2'>
                          <div className='text-secondary-text'>???? ??????????????:</div>
                          <Currency
                            className='text-2xl'
                            valueClassName='font-medium'
                            value={discountedPrice}
                          />
                        </div>
                      </div>
                    ) : null}

                    {giftCertificate ? (
                      <div className='mt-4' data-cy={'order-gift-certificate'}>
                        <div className='mb-1 text-secondary-text'>
                          ???????????????? ???????????????????? ????????????????????
                        </div>
                        <div>
                          {giftCertificate.name ? `${giftCertificate.name}: ` : '?? ??????????: '}
                          {giftCertificate.code}
                          {' ???? ?????????? '}
                          <Currency value={giftCertificateChargedValue} />
                        </div>
                      </div>
                    ) : null}

                    {orderPromo && orderPromo.length > 0 ? (
                      <div className='mt-4' data-cy={'order-promo-list'}>
                        <div className='mb-1 text-secondary-text'>???????????????????? ??????????</div>
                        <div>
                          {orderPromo.map((promoItem) => {
                            return (
                              <div key={`${promoItem._id}`}>
                                {promoItem.promo
                                  ? promoItem.promo.name
                                  : '???????????????? ?????????? ???? ??????????????'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {showAdminUi ? (
                <FixedButtons>
                  <WpButton frameClassName={'w-auto'} type={'submit'}>
                    ??????????????????
                  </WpButton>
                </FixedButtons>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default ConsoleOrderDetails;
