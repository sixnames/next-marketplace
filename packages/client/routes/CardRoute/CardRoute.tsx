import React from 'react';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Title from '../../components/Title/Title';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { ProductCardFragment } from '../../generated/apolloComponents';

interface CardRouteInterface {
  cardData: ProductCardFragment;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  if (!cardData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const imageWidth = 450;
  const { mainImage, nameString, cardNameString, descriptionString, price } = cardData;

  return (
    <Inner>
      <div className={classes.frame}>
        <div className={classes.image}>
          <Image url={mainImage} alt={nameString} title={nameString} width={imageWidth} />
        </div>

        <div>
          <Title>{cardNameString}</Title>
          <div style={{ marginBottom: 15 }}>{price} р.</div>
          <div style={{ marginBottom: 30 }}>{descriptionString}</div>
        </div>
      </div>
    </Inner>
  );
};

export default CardRoute;
