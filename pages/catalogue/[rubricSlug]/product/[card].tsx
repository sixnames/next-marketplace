import ArrowTrigger from 'components/ArrowTrigger/ArrowTrigger';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import ControlButton from 'components/Buttons/ControlButton';
import Currency from 'components/Currency/Currency';
import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Inner from 'components/Inner/Inner';
import TagLink from 'components/Link/TagLink';
import ShopsMap from 'components/ShopsMap/ShopsMap';
import Title from 'components/Title/Title';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useSiteContext } from 'context/siteContext';
import { ProductInterface, ShopInterface, ShopProductInterface } from 'db/uiInterfaces';
import { useUpdateProductCounterMutation } from 'generated/apolloComponents';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { alwaysArray } from 'lib/arrayUtils';
import { getCardData } from 'lib/cardUtils';
import { noNaN } from 'lib/numbers';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Image from 'next/image';
import * as React from 'react';
import CardShop from 'routes/CardRoute/CardShop';

interface CardShopsInterface {
  shopProducts: ShopProductInterface[];
}

export const CardShops: React.FC<CardShopsInterface> = ({ shopProducts }) => {
  const [isMap, setIsMap] = React.useState<boolean>(false);

  const shopsSnippets = shopProducts.reduce((acc: ShopInterface[], { shop }) => {
    if (!shop) {
      return acc;
    }
    return [...acc, shop];
  }, []);

  return (
    <section id={`card-shops`}>
      <div className='mb-6 flex flex-col gap-4 items-baseline sm:flex-row sm:justify-between'>
        <h2 className='text-2xl'>Наличие в винотеках</h2>

        <ArrowTrigger
          arrowPosition={isMap ? 'left' : 'right'}
          name={isMap ? 'К списку магазинов' : 'Показать на карте'}
          onClick={() => setIsMap((prevState) => !prevState)}
        />
      </div>

      <div data-cy={`card-shops`}>
        {isMap ? (
          <div data-cy={`card-shops-map`}>
            <ShopsMap shops={shopsSnippets} />
          </div>
        ) : (
          <div data-cy={`card-shops-list`}>
            {shopProducts.map((shopProduct, index) => {
              return (
                <CardShop
                  testId={`1-${index}`}
                  key={`${shopProduct._id}`}
                  shopProduct={shopProduct}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

interface CardRouteInterface {
  cardData: ProductInterface;
  companySlug?: string;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData, companySlug }) => {
  const {
    _id,
    rubricSlug,
    mainImage,
    name,
    originalName,
    cardPrices,
    connections,
    itemId,
    listFeatures,
    ratingFeatures,
    textFeatures,
    iconFeatures,
    tagFeatures,
    cardBreadcrumbs,
    cardShopProducts,
    shopsCount,
  } = cardData;
  const shopsCounterPostfix = noNaN(shopsCount) > 1 ? 'винотеках' : 'винотеке';
  const isShopless = noNaN(shopsCount) < 1;
  const { addShoplessProductToCart } = useSiteContext();
  const [amount, setAmount] = React.useState<number>(1);

  const [updateProductCounterMutation] = useUpdateProductCounterMutation();
  React.useEffect(() => {
    updateProductCounterMutation({
      variables: {
        input: {
          shopProductIds: alwaysArray(cardData.shopProductIds),
          companySlug,
        },
      },
    }).catch((e) => console.log(e));
  }, [cardData.shopProductIds, companySlug, updateProductCounterMutation]);

  return (
    <article className='pb-20 pt-8 lg:pt-0' data-cy={`card`}>
      <Breadcrumbs currentPageName={originalName} config={cardBreadcrumbs} />

      <div className='mb-12 relative'>
        <Inner className='relative z-20' lowBottom lowTop>
          {/*content holder*/}
          <div className='relative'>
            {/*content*/}
            <div className='relative z-20 grid gap-12 py-8 pr-inner-block-horizontal-padding md:grid-cols-2 lg:py-10 lg:grid-cols-12'>
              {/*image*/}
              <div className='md:col-span-1 md:order-2 lg:col-span-3 lg:flex lg:justify-center'>
                <div className='relative h-[300px] w-[160px] md:h-[500px] lg:h-[600px]'>
                  <Image
                    src={`${mainImage}`}
                    alt={originalName}
                    title={originalName}
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
              </div>

              {/*main data*/}
              <div className='flex flex-col md:col-span-2 md:order-3 lg:col-span-7'>
                {/*title*/}
                <div className='mb-6'>
                  <div className='mb-4 text-secondary-text text-sm'>Артикул: {itemId}</div>
                  <Title className='mb-1' low>
                    {originalName}
                  </Title>
                  <div className='text-secondary-text'>{name}</div>
                </div>

                {/*connections*/}
                {(connections || []).length > 0 ? (
                  <div className='mb-8'>
                    {(connections || []).map(({ _id, attribute, connectionProducts }) => {
                      return (
                        <div key={`${_id}`} className='mb-8'>
                          <div className='text-secondary-text mb-3 font-medium'>{`${attribute?.name}:`}</div>
                          <div className='flex flex-wrap gap-2'>
                            {(connectionProducts || []).map(({ option, productSlug }) => {
                              const isCurrent = productSlug === cardData.slug;
                              const name = `${option?.name} ${
                                attribute?.metric ? ` ${attribute.metric.name}` : ''
                              }`;

                              return (
                                <TagLink
                                  theme={'primary'}
                                  data-cy={`card-connection`}
                                  className={isCurrent ? `pointer-events-none` : ``}
                                  key={`${option?.name}`}
                                  isActive={isCurrent}
                                  href={`${ROUTE_CATALOGUE}/${rubricSlug}/product/${productSlug}`}
                                >
                                  {name}
                                </TagLink>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/*price*/}
                <div className='flex items-baseline mb-6 mt-auto'>
                  {isShopless ? null : noNaN(shopsCount) > 1 ? (
                    <React.Fragment>
                      <div className='mr-2'>Цена от</div>
                      <div className='flex items-baseline text-3xl sm:text-4xl'>
                        <Currency className='' value={cardPrices?.min} />
                        <div className='text-lg mx-2'>до</div>
                        <Currency className='' value={cardPrices?.max} />
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className='mr-2'>Цена</div>
                      <div className=''>
                        <Currency className='' value={cardPrices?.min} />
                      </div>
                    </React.Fragment>
                  )}
                </div>

                {/*cart action elements*/}
                <div className='flex flex-wrap gap-4 mb-8'>
                  <div className='flex flex-col xs:flex-row gap-6 max-w-[460px]'>
                    <SpinnerInput
                      onChange={(e) => {
                        setAmount(noNaN(e.target.value));
                      }}
                      plusTestId={`card-plus`}
                      minusTestId={`card-minus`}
                      testId={`card-amount`}
                      frameClassName='w-full sm:half-column'
                      min={1}
                      name={'amount'}
                      value={amount}
                    />
                    <Button
                      onClick={() => {
                        addShoplessProductToCart({
                          amount,
                          productId: _id,
                        });
                      }}
                      testId={`card-add-to-cart`}
                      className='w-full sm:half-column'
                    >
                      В корзину
                    </Button>
                  </div>

                  {/*controls*/}
                  <div className='flex'>
                    <ControlButton
                      icon={'compare'}
                      iconSize={'mid'}
                      ariaLabel={'Добавить в сравнение'}
                    />
                    <ControlButton
                      icon={'heart'}
                      iconSize={'mid'}
                      ariaLabel={'Добавить в избранное'}
                    />
                    <ControlButton icon={'upload'} iconSize={'mid'} ariaLabel={'Поделиться'} />
                  </div>
                </div>

                {/*availability*/}
                <a
                  href={`#card-shops`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = e.target as Element;
                    const distId = target.getAttribute('href');
                    const distElement = document.querySelector(`${distId}`);
                    if (distElement) {
                      window.scrollTo({
                        top: noNaN(distElement.getBoundingClientRect().top),
                        left: 0,
                        behavior: 'smooth',
                      });
                    }
                  }}
                >
                  {isShopless
                    ? 'Нет в наличии'
                    : `В наличии в ${shopsCount} ${shopsCounterPostfix}`}
                </a>
              </div>

              {/*list features*/}
              <div className='md:col-span-1 md:order-1 lg:col-span-2'>
                {(listFeatures || []).map(({ showInCard, _id, name, readableValue }) => {
                  if (!showInCard) {
                    return null;
                  }

                  return (
                    <div key={`${_id}`} className='mb-6'>
                      <div className='text-secondary-text mb-1 font-medium'>{name}</div>
                      <div>{readableValue}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/*bg*/}
            <div className='absolute inset-x-0 inset-y-0 --xl:top-[10%] --xl:h-[80%] z-10 bg-secondary rounded-tr-xl rounded-br-xl wp-shadow-bottom-right-100' />
          </div>
        </Inner>

        {/*bg left patch*/}
        <div className='absolute z-10 inset-x-0 inset-y-0 --xl:top-[10%] --xl:h-[80%] left-0 w-[50%] bg-secondary' />
      </div>

      <Inner lowTop>
        {/* Features */}
        <section id={`card-features mb-4`}>
          <div className='grid gap-8 md:grid-cols-7 mb-12'>
            <div className='md:col-span-2'>
              {(iconFeatures || []).map((attribute) => {
                return (
                  <div key={`${attribute._id}`} className='mb-8'>
                    <div className='text-secondary-text mb-3 font-medium'>{`${attribute.name}:`}</div>
                    <ul className='flex flex-wrap gap-4'>
                      {(attribute.options || []).map((option) => {
                        const name = `${option?.name} ${
                          attribute?.metric ? ` ${attribute.metric.name}` : ''
                        }`;

                        return (
                          <li key={`${option?.name}`}>
                            <TagLink
                              icon={option.icon}
                              href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                              testId={`card-icon-option-${name}`}
                            >
                              {name}
                            </TagLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {(tagFeatures || []).map((attribute) => {
                return (
                  <div key={`${attribute._id}`} className='mb-8'>
                    <div className='text-secondary-text mb-3 font-medium'>{`${attribute.name}:`}</div>
                    <ul className='flex flex-wrap gap-4'>
                      {(attribute.options || []).map((option) => {
                        const name = `${option?.name} ${
                          attribute?.metric ? ` ${attribute.metric.name}` : ''
                        }`;

                        return (
                          <li key={`${option?.name}`}>
                            <TagLink
                              href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                              testId={`card-tag-option-${name}`}
                            >
                              {name}
                            </TagLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {(ratingFeatures || []).length > 0 ? (
                <div className=''>
                  <div className=''>Мнение экспертов:</div>
                  <ul className='flex flex-wrap gap-4'>
                    {(ratingFeatures || []).map(({ _id, name, number }) => {
                      const optionName = `${name} ${number}`;
                      return (
                        <li key={`${_id}`}>
                          <TagLink testId={`card-rating-option-${name}`}>{optionName}</TagLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className='md:col-span-5'>
              {(textFeatures || []).map(({ _id, name, readableValue }) => {
                if (!readableValue) {
                  return null;
                }
                return (
                  <section className='mb-8' key={`${_id}`}>
                    <h2 className='text-2xl mb-4'>{name}</h2>
                    <div className='prose max-w-full'>
                      <p>{readableValue}</p>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <CardShops shopProducts={cardShopProducts || []} />
      </Inner>
    </article>
  );
};

interface CardInterface extends SiteLayoutProviderInterface {
  cardData?: ProductInterface | null;
}

const Card: NextPage<CardInterface> = ({ cardData, company, ...props }) => {
  const { currentCity } = props;
  const { getSiteConfigSingleValue } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayoutProvider {...props}>
        <ErrorBoundaryFallback />
      </SiteLayoutProvider>
    );
  }

  const prefixConfig = getSiteConfigSingleValue('cardMetaPrefix');
  const prefix = prefixConfig ? `${prefixConfig} ` : '';
  const cityDescription = currentCity ? ` в городе ${currentCity.name}` : '';

  return (
    <SiteLayoutProvider
      previewImage={cardData.mainImage}
      title={`${prefix}${cardData.originalName}${cityDescription}`}
      description={`${prefix}${cardData.originalName}${cityDescription}`}
      company={company}
      {...props}
    >
      <CardRoute cardData={cardData} companySlug={company?.slug} />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CardInterface>> {
  const { locale, query } = context;
  // console.log(' ');
  // console.log('==================================');
  // const startTime = new Date().getTime();

  const { props } = await getSiteInitialData({
    context,
  });
  // console.log(`After initial data `, new Date().getTime() - startTime);

  // card data
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: `${query.card}`,
    companyId: props.company?._id,
  });
  const cardData = castDbData(rawCardData);
  // console.log(`After card `, new Date().getTime() - startTime);

  return {
    props: {
      ...props,
      cardData,
    },
  };
}

export default Card;
