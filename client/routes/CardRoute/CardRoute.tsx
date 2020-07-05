import React from 'react';
import { CardData } from '../../pages/[catalogue]/[card]';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
// import classes from './CardRoute.module.css';

interface CardRouteInterface {
  cardData: CardData;
}

const CardRoute: React.FC<CardRouteInterface> = ({ cardData }) => {
  if (!cardData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  return (
    <div>
      <code>{JSON.stringify(cardData, null, 2)}</code>
    </div>
  );
};

export default CardRoute;
