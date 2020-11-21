import React from 'react';
import Inner from '../../components/Inner/Inner';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { CardFeatureFragment, ProductCardFragment } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';
import ProductMarker from '../../components/Product/ProductMarker/ProductMarker';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import RatingStars from '../../components/RatingStars/RatingStars';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from '../../context/appContext';
import ReachTabs from '../../components/ReachTabs/ReachTabs';
import Currency from '../../components/Currency/Currency';
import CardShop from './CardShop';

interface CardRouteFeaturesInterface {
  features: CardFeatureFragment[];
}

const CardRouteListFeatures: React.FC<CardRouteFeaturesInterface> = ({ features }) => {
  return features.length > 0 ? (
    <div className={classes.mainFrameFeatures}>
      {features.map(({ showInCard, node, readableValue }) => {
        if (!showInCard) {
          return null;
        }

        return (
          <div key={node.id} className={classes.feature}>
            <div className={classes.featureTitle}>{node.nameString}</div>
            <div>
              {readableValue.map((valueItem, valueIndex) => {
                const isLast = readableValue.length - 1 === valueIndex;
                return (
                  <span className={classes.featureItem} key={valueItem}>
                    {isLast ? valueItem : `${valueItem}, `}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  ) : null;
};

interface CardRouteInterface {
  cardData: ProductCardFragment;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const {
    mainImage,
    nameString,
    cardNameString,
    cardPrices,
    cardConnections,
    itemId,
    cardFeatures,
    shops,
  } = cardData;
  const { isMobile } = useAppContext();
  const imageWidth = 150;

  const { listFeatures, ratingFeatures, textFeatures, iconFeatures, tagFeatures } = cardFeatures;
  const shopsCount = shops.length;
  const isShopsPlural = shopsCount > 1;

  const tabsConfig = [
    { head: 'Характеристики' },
    { head: `Где купить (${shopsCount})` },
    { head: 'Отзывы' },
    { head: 'Мнение экспертов' },
  ];

  return (
    <div className={classes.card}>
      <Breadcrumbs />

      <Inner>
        <div className={classes.mainFrame}>
          {isMobile ? null : <CardRouteListFeatures features={listFeatures} />}

          <div className={classes.mainData}>
            <div className={classes.image}>
              <div className={classes.imageHolder}>
                <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
              </div>
            </div>
            <div className={classes.mainDataContent}>
              <div className={classes.cardNameHolder}>
                <div className={classes.cardName}>
                  <h1>{cardNameString}</h1>
                </div>
                <div className={classes.cardArt}>Артикул: {itemId}</div>
              </div>

              <div className={classes.innerRatings}>
                <RatingStars rating={4.5} className={classes.innerRatingsStars} />
                <div className={classes.innerRatingsFeedback}>12 отзывов</div>
              </div>

              <div className={classes.outerRatings}>
                <div className={classes.outerRatingsLabel}>Мнение экспертов:</div>

                <div className={classes.outerRatingsList}>
                  {ratingFeatures.map(({ node, readableValue }) => {
                    return (
                      <div key={node.id} className={classes.outerRatingsItem}>
                        {node.nameString} {readableValue[0]}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/*Connections*/}
              {cardConnections.length > 0 ? (
                <div className={classes.connections}>
                  {cardConnections.map(({ id, nameString, products }) => {
                    return (
                      <div key={id} className={classes.connectionsGroup}>
                        <div className={classes.connectionsGroupLabel}>{`${nameString}:`}</div>
                        <div className={classes.connectionsList}>
                          {products.map(({ value, id, product, isCurrent }) => {
                            if (isCurrent) {
                              return (
                                <span
                                  className={`${classes.connectionsGroupItem} ${classes.connectionsGroupItemCurrent}`}
                                  key={id}
                                >
                                  {value}
                                </span>
                              );
                            }
                            return (
                              <Link
                                className={`${classes.connectionsGroupItem}`}
                                key={id}
                                href={{
                                  pathname: `/product/[card]`,
                                }}
                                as={{
                                  pathname: `/product/${product.slug}`,
                                }}
                              >
                                {value}
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
                  <div className={classes.price}>
                    <div className={classes.cardLabel}>Цена от</div>
                    <div className={classes.priceValue}>
                      <Currency className={classes.priceItem} value={cardPrices.min} />
                      до
                      <Currency className={classes.priceItem} value={cardPrices.max} />
                    </div>
                  </div>

                  <div className={classes.helpers}>
                    <div className={classes.cardLabel}>
                      В наличии в {shopsCount} {isShopsPlural ? 'винотеках' : 'винотеке'}
                    </div>
                    <div>Сравнить цены</div>
                  </div>
                </div>

                <div className={classes.btns}>
                  <button className={`${classes.btnsItem}`}>
                    <Icon name={'compare'} />
                  </button>
                  <button className={`${classes.btnsItem}`}>
                    <Icon name={'heart'} />
                  </button>
                  <button className={`${classes.btnsItem}`}>
                    <Icon name={'upload'} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProductMarker>Выбор покупателей</ProductMarker>
        </div>

        {isMobile ? <CardRouteListFeatures features={listFeatures} /> : null}
      </Inner>

      {/* Tabs */}
      <ReachTabs config={tabsConfig}>
        {/* Shops */}
        <div>
          <div>
            {shops.map((shop) => {
              return <CardShop key={shop.id} shop={shop} />;
            })}
          </div>
          <pre>{JSON.stringify(shops, null, 2)}</pre>
        </div>

        {/* Features */}
        <div className={classes.cardFeatures}>
          <div className={classes.cardFeaturesAside}>
            {iconFeatures.map(({ node, readableOptions }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={node.id}>
                  <div className={classes.cardFeaturesLabel}>{node.nameString}</div>
                  <div className={classes.cardFeaturesCombinationsList}>
                    {readableOptions.map(({ id, nameString, icon }) => {
                      return (
                        <div className={classes.cardFeaturesCombination} key={id}>
                          <Icon className={classes.cardFeaturesCombinationIcon} name={`${icon}`} />
                          <div className={classes.cardFeaturesCombinationName}>{nameString}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {tagFeatures.map(({ node, readableValue }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={node.id}>
                  <div className={classes.cardFeaturesLabel}>{node.nameString}</div>
                  <div className={classes.cardFeaturesTagsList}>
                    {readableValue.map((value) => (
                      <div className={classes.cardFeaturesTag} key={value}>
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={classes.cardFeaturesContent}>
            {textFeatures.map(({ node, readableValue }) => {
              return (
                <div className={classes.cardFeaturesGroup} key={node.id}>
                  <div className={classes.cardFeaturesLabel}>{node.nameString}</div>
                  <div className={classes.cardFeaturesText}>
                    <p>{readableValue[0]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>Отзывы</div>

        <div>Мнение экспертов</div>
      </ReachTabs>
    </div>
  );
};

export default CardRoute;
