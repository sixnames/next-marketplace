import React, { useState } from 'react';
import Inner from '../../components/Inner/Inner';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { CardFeatureFragment, ProductCardFragment } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';
import ProductMarker from '../../components/Product/ProductMarker/ProductMarker';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import RatingStars from '../../components/RatingStars/RatingStars';
import Icon from '../../components/Icon/Icon';
import Button from '../../components/Buttons/Button';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import { noNaN } from '../../utils/noNaN';
import { useAppContext } from '../../context/appContext';

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
    price,
    cardConnections,
    itemId,
    cardFeatures,
  } = cardData;
  const { isMobile } = useAppContext();
  const [amount, setAmount] = useState<number>(1);
  const imageWidth = 150;

  const { listFeatures, ratingFeatures } = cardFeatures;

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

              <div className={classes.connections}>
                {cardConnections.map(({ id, nameString, products }) => {
                  // Connections
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

              <div className={classes.mainDataBottom}>
                <div>
                  <div className={classes.price}>
                    <div className={classes.cardLabel}>Цена от</div>
                    <div className={classes.priceValue}>
                      <span>{price}</span>
                      р.
                    </div>
                  </div>

                  <div className={classes.helpers}>
                    <div className={classes.cardLabel}>В наличии в 16 винотеках</div>
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

        <div
          className={`${classes.mainFrame} ${classes.mainFrameNoBackground} ${classes.mainFrameLowTop} ${classes.mainFrameLowBottom}`}
        >
          <div />
          <div className={`${classes.mainData} ${classes.mainDataNoRightPadding}`}>
            <div />
            <div className={`${classes.addToCartForm}`}>
              <SpinnerInput
                onChange={(e) => {
                  setAmount(noNaN(e.target.value));
                }}
                frameClassName={`${classes.addToCartFormInput}`}
                min={1}
                name={'amount'}
                value={amount}
              />
              <Button className={classes.addToCartFormButton}>В корзину</Button>
            </div>
          </div>
        </div>

        {isMobile ? <CardRouteListFeatures features={listFeatures} /> : null}
      </Inner>
    </div>
  );
};

export default CardRoute;
