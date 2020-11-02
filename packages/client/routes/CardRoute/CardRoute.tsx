import React from 'react';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { ProductCardFragment } from '../../generated/apolloComponents';
import Link from '../../components/Link/Link';

interface CardRouteInterface {
  cardData: ProductCardFragment;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  const imageWidth = 155;
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

  return (
    <Inner>
      <div className={classes.frame}>
        <div className={classes.image}>
          <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
        </div>

        <div>
          <Title>{cardNameString}</Title>
          <div style={{ marginBottom: 15 }}>Артикул: {itemId}</div>
          <div style={{ marginBottom: 15 }}>{price} р.</div>
          <div style={{ marginBottom: 30 }}>{descriptionString}</div>

          {/*Connections*/}
          <div style={{ marginBottom: 30 }}>
            {cardConnections.map(({ id, nameString, products }) => {
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

          {/*Features*/}
          <div>
            {cardFeatures.map(({ id, showInCard, attributes }) => {
              if (!showInCard) {
                return null;
              }

              return (
                <div key={id}>
                  {attributes.map(({ id, showInCard, nameString, value }) => {
                    if (!showInCard) {
                      return null;
                    }

                    return (
                      <div key={id} style={{ marginBottom: 15 }}>
                        <div>{nameString}</div>
                        {value.map((valueItem) => {
                          return <span key={valueItem}>{value}</span>;
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Inner>
  );
};

export default CardRoute;
