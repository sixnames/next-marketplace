import React, { Fragment, useState } from 'react';
import Inner from '../../components/Inner/Inner';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { CardFeatureFragment, GetCatalogueCardQueryQuery } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';
import ProductMarker from '../../components/Product/ProductMarker/ProductMarker';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import RatingStars from '../../components/RatingStars/RatingStars';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from '../../context/appContext';
import ReachTabs from '../../components/ReachTabs/ReachTabs';
import Currency from '../../components/Currency/Currency';
import CardShops from './CardShops';
import SpinnerInput from '../../components/FormElements/SpinnerInput/SpinnerInput';
import Button from '../../components/Buttons/Button';
import { noNaN } from '@yagu/shared';
import { useSiteContext } from '../../context/siteContext';
import ControlButton from '../../components/Buttons/ControlButton';

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
  cardData: GetCatalogueCardQueryQuery['getProductCard'];
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const {
    id,
    slug,
    mainImage,
    nameString,
    cardNameString,
    cardPrices,
    cardConnections,
    itemId,
    cardFeatures,
    shopsCount,
  } = cardData;
  const { addShoplessProductToCart } = useSiteContext();
  const { isMobile } = useAppContext();
  const [amount, setAmount] = useState<number>(1);
  const imageWidth = 150;

  const { listFeatures, ratingFeatures, textFeatures, iconFeatures, tagFeatures } = cardFeatures;
  const isShopsPlural = shopsCount > 1;

  const tabsConfig = [
    { head: <Fragment>Характеристики</Fragment> },
    {
      head: (
        <Fragment>
          Где купить <span>{`(${shopsCount})`}</span>
        </Fragment>
      ),
    },
    { head: <Fragment>Отзывы</Fragment> },
    { head: <Fragment>Мнение экспертов</Fragment> },
  ];

  return (
    <div className={classes.card} data-cy={`card-${slug}`}>
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
                                data-cy={`connection-${product.slug}`}
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
                plusTestId={`card-${slug}-plus`}
                minusTestId={`card-${slug}-minus`}
                testId={`card-${slug}-amount`}
                frameClassName={`${classes.shoplessFromInput}`}
                min={1}
                name={'amount'}
                value={amount}
              />
              <Button
                onClick={() => {
                  addShoplessProductToCart({
                    amount,
                    productId: id,
                  });
                }}
                testId={`card-${slug}-add-to-cart`}
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

        {/* Shops */}
        <CardShops productId={id} />

        <div>Отзывы</div>

        <div>Мнение экспертов</div>
      </ReachTabs>
    </div>
  );
};

export default CardRoute;
