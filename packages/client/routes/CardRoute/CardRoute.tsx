import React from 'react';
import Inner from '../../components/Inner/Inner';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { ProductCardFragment } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';
import ProductMarker from '../../components/Product/ProductMarker/ProductMarker';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import RatingStars from '../../components/RatingStars/RatingStars';
import Icon from '../../components/Icon/Icon';

interface CardRouteInterface {
  cardData: ProductCardFragment;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const {
    mainImage,
    nameString,
    cardNameString,
    price,
    cardConnections,
    cardFeatures,
    itemId,
  } = cardData;

  const imageWidth = 150;

  return (
    <div className={classes.card}>
      <Breadcrumbs />

      <Inner>
        <div className={classes.mainFrame}>
          <div className={classes.mainFrameFeatures}>
            {cardFeatures.map(({ id, showInCard, attributes }) => {
              if (!showInCard) {
                return null;
              }
              // Features
              return (
                <div key={id}>
                  {attributes.map(({ id, showInCard, nameString, value }) => {
                    if (!showInCard) {
                      return null;
                    }

                    return (
                      <div key={id} className={classes.feature}>
                        <div className={classes.featureTitle}>{nameString}</div>
                        {value.map((valueItem, valueIndex) => {
                          const isLast = value.length - 1 === valueIndex;
                          return (
                            <span className={classes.featureItem} key={valueItem}>
                              {isLast ? valueItem : `${valueItem}, `}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

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
                <div className={classes.cartLabel}>Мнение экспертов:</div>
                <div className={classes.outerRatingsItem}>vivino 4,2</div>
                <div className={classes.outerRatingsItem}>RP 88</div>
                <div className={classes.outerRatingsItem}>ws 88</div>
              </div>

              <div className={classes.connections}>
                {cardConnections.map(({ id, nameString, products }) => {
                  // Connections
                  return (
                    <div key={id} className={classes.connectionsGroup}>
                      <div className={classes.cartLabel}>{`${nameString}:`}</div>
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

              <div className={classes.mainDataBottom}>
                <div>
                  <div className={classes.price}>
                    <div className={classes.cartLabel}>Цена от</div>
                    <div className={classes.priceValue}>
                      <span>{price}</span>
                      р.
                    </div>
                  </div>

                  <div className={classes.helpers}>
                    <div className={classes.cartLabel}>В наличии в 16 винотеках</div>
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
                    <Icon name={'cart'} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProductMarker>Выбор покупателей</ProductMarker>
        </div>
      </Inner>
    </div>
  );
};

export default CardRoute;
