import React from 'react';
import Inner from '../../components/Inner/Inner';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { ProductCardFragment } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';
import useRefSizes from '../../hooks/useRefSizes';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';

interface CardRouteInterface {
  cardData: ProductCardFragment;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const { ref, outsideHalfWidth } = useRefSizes();

  const {
    mainImage,
    nameString,
    cardNameString,
    descriptionString,
    price,
    cardConnections,
    cardFeatures,
    itemId,
  } = cardData;

  const imageWidth = 150;

  return (
    <Inner>
      <div className={classes.mainFrame} ref={ref}>
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
            <div className={classes.cardName}>
              <h1>{cardNameString}</h1>
            </div>

            <div>
              {cardConnections.map(({ id, nameString, products }) => {
                // Connections
                return (
                  <div key={id}>
                    <div>{nameString}</div>
                    {products.map(({ value, id, product, isCurrent }) => {
                      if (isCurrent) {
                        return (
                          <span style={{ marginRight: 15 }} key={id}>
                            {value}
                          </span>
                        );
                      }
                      return (
                        <Link
                          style={{ marginRight: 15 }}
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
                );
              })}
            </div>
          </div>
        </div>

        <AnimateOpacity className={classes.mainFrameBg} />
        <AnimateOpacity className={classes.mainFrameShade} style={{ width: outsideHalfWidth }} />
      </div>

      <div>
        <div>
          <div style={{ marginBottom: 15 }}>Артикул: {itemId}</div>
          <div style={{ marginBottom: 15 }}>{price} р.</div>
          <div style={{ marginBottom: 30 }}>{descriptionString}</div>
        </div>
      </div>
    </Inner>
  );
};

export default CardRoute;
