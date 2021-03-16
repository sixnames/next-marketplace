import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import ControlButton from 'components/Buttons/ControlButton';
import Currency from 'components/Currency/Currency';
import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import SpinnerInput from 'components/FormElements/SpinnerInput/SpinnerInput';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import Link from 'components/Link/Link';
import ProductMarker from 'components/Product/ProductMarker/ProductMarker';
import RatingStars from 'components/RatingStars/RatingStars';
import ReachTabs from 'components/ReachTabs/ReachTabs';
import { PRODUCT_CARD_RUBRIC_SLUG_PREFIX } from 'config/common';
import { useAppContext } from 'context/appContext';
import {
  CardFeatureFragment,
  GetCatalogueCardQuery,
  useUpdateProductCounterMutation,
} from 'generated/apolloComponents';
import useCartMutations from 'hooks/useCartMutations';
import useSessionCity from 'hooks/useSessionCity';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCardData } from 'lib/cardUtils';
import { noNaN } from 'lib/numbers';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import classes from 'routes/CardRoute/CardRoute.module.css';
import CardShops from 'routes/CardRoute/CardShops';

interface CardRouteFeaturesInterface {
  features: CardFeatureFragment[];
}

const CardRouteListFeatures: React.FC<CardRouteFeaturesInterface> = ({ features }) => {
  return features.length > 0 ? (
    <div className={classes.mainFrameFeatures}>
      {features.map(({ showInCard, _id, attributeName, readableValue }) => {
        if (!showInCard) {
          return null;
        }

        return (
          <div key={_id} className={classes.feature}>
            <div className={classes.featureTitle}>{attributeName}</div>
            <div>{readableValue}</div>
          </div>
        );
      })}
    </div>
  ) : null;
};

interface CardRouteInterface {
  cardData: GetCatalogueCardQuery['getProductCard'];
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const {
    _id,
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
    shopsCount,
    cardBreadcrumbs,
    cardShopProducts,
  } = cardData;
  const city = useSessionCity();
  const { query } = useRouter();
  const { addShoplessProductToCart } = useCartMutations();
  const { isMobile } = useAppContext();
  const [amount, setAmount] = React.useState<number>(1);

  const additionalSlug = alwaysArray(query.card).find((slug) => {
    return slug.includes(PRODUCT_CARD_RUBRIC_SLUG_PREFIX);
  });
  const additionalLinkSlug = additionalSlug ? `/${additionalSlug}` : '';

  const isShopsPlural = shopsCount > 1;
  const isShopless = shopsCount < 1;

  const [updateProductCounterMutation] = useUpdateProductCounterMutation();
  React.useEffect(() => {
    updateProductCounterMutation({
      variables: {
        input: {
          productSlug: cardData.slug,
        },
      },
    }).catch((e) => console.log(e));
  }, [cardData.slug, updateProductCounterMutation]);

  const tabsConfig = [
    {
      head: <React.Fragment>Характеристики</React.Fragment>,
      testId: 'features',
    },
    {
      head: (
        <React.Fragment>
          Где купить <span>{`(${shopsCount})`}</span>
        </React.Fragment>
      ),
      testId: 'shops',
    },
    {
      head: <React.Fragment>Отзывы</React.Fragment>,
      testId: 'feedback',
    },
    {
      head: <React.Fragment>Мнение экспертов</React.Fragment>,
      testId: 'reviews',
    },
  ];

  return (
    <div className={classes.card} data-cy={`card-${cardData.slug}`}>
      <Breadcrumbs currentPageName={originalName} config={cardBreadcrumbs} />

      <Inner>
        <div className={classes.mainFrame}>
          {isMobile ? null : <CardRouteListFeatures features={listFeatures} />}

          <div className={classes.mainData}>
            <div className={classes.image}>
              <div className={classes.imageHolder}>
                <Image
                  src={mainImage}
                  alt={originalName}
                  title={originalName}
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>
            <div className={classes.mainDataContent}>
              <div className={classes.cardNameHolder}>
                <div className={classes.cardName}>
                  <h1>{originalName}</h1>
                </div>
                <div className={classes.cardNameTranslation}>{name}</div>
                <div className={classes.cardArt}>Артикул: {itemId}</div>
              </div>

              <div className={classes.innerRatings}>
                <RatingStars rating={4.5} className={classes.innerRatingsStars} />
                <div className={classes.innerRatingsFeedback}>12 отзывов</div>
              </div>

              {ratingFeatures.length > 0 ? (
                <div className={classes.outerRatings}>
                  <div className={classes.outerRatingsLabel}>Мнение экспертов:</div>

                  <div className={classes.outerRatingsList}>
                    {ratingFeatures.map(({ attributeName, _id, number }) => {
                      return (
                        <div key={_id} className={classes.outerRatingsItem}>
                          {attributeName} {number}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/*Connections*/}
              {connections.length > 0 ? (
                <div className={classes.connections}>
                  {connections.map(({ _id, attributeName, connectionProducts }) => {
                    return (
                      <div key={_id} className={classes.connectionsGroup}>
                        <div className={classes.connectionsGroupLabel}>{`${attributeName}:`}</div>
                        <div className={classes.connectionsList}>
                          {connectionProducts.map(({ option, product }) => {
                            const isCurrent = product._id === cardData._id;

                            if (isCurrent) {
                              return (
                                <span
                                  className={`${classes.connectionsGroupItem} ${classes.connectionsGroupItemCurrent}`}
                                  key={option._id}
                                >
                                  {option.name}
                                </span>
                              );
                            }
                            return (
                              <Link
                                data-cy={`connection-${product.slug}`}
                                className={`${classes.connectionsGroupItem}`}
                                key={option._id}
                                href={`/${city}/product${additionalLinkSlug}/${product.slug}`}
                              >
                                {option.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className={classes.mainDataBottom}>
                <div>
                  {isShopless ? null : (
                    <div className={classes.price}>
                      <div className={classes.cardLabel}>Цена от</div>
                      <div className={classes.priceValue}>
                        <Currency className={classes.priceItem} value={cardPrices.min} />
                        до
                        <Currency className={classes.priceItem} value={cardPrices.max} />
                      </div>
                    </div>
                  )}

                  <div className={classes.helpers}>
                    <div className={classes.cardLabel}>
                      {isShopless
                        ? 'Нет в наличии'
                        : `В наличии в ${shopsCount} ${isShopsPlural ? 'винотеках' : 'винотеке'}`}
                    </div>
                    {isShopless ? null : <div>Сравнить цены</div>}
                  </div>
                </div>

                <div className={classes.btns}>
                  <ControlButton icon={'compare'} iconSize={'mid'} />
                  <ControlButton icon={'heart'} iconSize={'mid'} />
                  <ControlButton icon={'upload'} iconSize={'mid'} />
                </div>
              </div>
            </div>
          </div>

          <ProductMarker>Выбор покупателей</ProductMarker>
        </div>

        <div
          className={`${classes.mainFrame} ${classes.mainFrameNoBackground} ${classes.mainFrameLowTop} ${classes.mainFrameLowBottom}`}
        >
          <div />
          <div className={`${classes.mainData} ${classes.mainDataNoRightPadding}`}>
            <div />
            <div className={`${classes.shoplessFrom}`}>
              <SpinnerInput
                onChange={(e) => {
                  setAmount(noNaN(e.target.value));
                }}
                plusTestId={`card-${cardData.slug}-plus`}
                minusTestId={`card-${cardData.slug}-minus`}
                testId={`card-${cardData.slug}-amount`}
                frameClassName={`${classes.shoplessFromInput}`}
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
                testId={`card-${cardData.slug}-add-to-cart`}
                className={classes.shoplessFromButton}
              >
                В корзину
              </Button>
            </div>
          </div>
        </div>

        {isMobile ? <CardRouteListFeatures features={listFeatures} /> : null}
      </Inner>

      {/* Tabs */}
      <ReachTabs config={tabsConfig} testId={`card-tabs`}>
        {/* Features */}
        <div className={classes.cardFeatures}>
          <div className={classes.cardFeaturesAside}>
            {iconFeatures.map(({ attributeName, _id, selectedOptions }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={_id}>
                  <div className={classes.cardFeaturesLabel}>{attributeName}</div>
                  <div className={classes.cardFeaturesCombinationsList}>
                    {selectedOptions.map(({ _id, name, icon }) => {
                      return (
                        <div className={classes.cardFeaturesCombination} key={_id}>
                          <Icon className={classes.cardFeaturesCombinationIcon} name={`${icon}`} />
                          <div className={classes.cardFeaturesCombinationName}>{name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {tagFeatures.map(({ attributeName, selectedOptions, _id }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={_id}>
                  <div className={classes.cardFeaturesLabel}>{attributeName}</div>
                  <div className={classes.cardFeaturesTagsList}>
                    {selectedOptions.map((value) => (
                      <div className={classes.cardFeaturesTag} key={value._id}>
                        {value.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={classes.cardFeaturesContent}>
            {textFeatures.map(({ attributeName, _id, readableValue }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={_id}>
                  <div className={classes.cardFeaturesLabel}>{attributeName}</div>
                  <div className={classes.cardFeaturesText}>
                    <p>{readableValue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shops */}
        <CardShops productId={_id} initialShops={cardShopProducts} />

        <div>Отзывы</div>

        <div>Мнение экспертов</div>
      </ReachTabs>
    </div>
  );
};

interface CardInterface extends PagePropsInterface, SiteLayoutInterface {
  cardData?: GetCatalogueCardQuery['getProductCard'] | null;
}

const Card: NextPage<CardInterface> = ({ cardData, navRubrics }) => {
  if (!cardData) {
    return (
      <SiteLayout navRubrics={navRubrics}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout navRubrics={navRubrics}>
      <CardRoute cardData={cardData} />
    </SiteLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  CardInterface,
  { city: string; card: string[] }
> = async ({ params, locale }) => {
  const { card } = params || {};
  const { cityNotFound, props, revalidate, redirectPayload } = await getSiteInitialData({
    params,
    locale,
  });

  if (cityNotFound) {
    return redirectPayload;
  }

  // card data
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.sessionCity,
    slug: alwaysArray(card),
  });
  const cardData = castDbData(rawCardData);

  return {
    props: {
      ...props,
      cardData,
    },
    revalidate,
  };
};

export default Card;