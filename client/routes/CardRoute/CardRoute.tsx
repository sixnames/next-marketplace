import React from 'react';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Title from '../../components/Title/Title';
import Image from '../../components/Image/Image';
import classes from './CardRoute.module.css';
import { CardData } from '../../pages/product/[card]';

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

  const imageWidth = 450;
  const {
    mainImage,
    name,
    cardName,
    description,
    attributesGroups,
    price,
  } = cardData.getProductBySlug;

  return (
    <Inner>
      <div className={classes.frame}>
        <div className={classes.image}>
          <Image url={mainImage} alt={name} title={name} width={imageWidth} />
        </div>

        <div>
          <Title>{cardName}</Title>
          <div style={{ marginBottom: 15 }}>{price} р.</div>
          <div style={{ marginBottom: 30 }}>{description}</div>

          <ul>
            {attributesGroups.map((group) => (
              <li key={group.node.id}>
                <div style={{ marginBottom: 15 }}>{group.node.nameString}</div>
                <ul>
                  {group.attributes.map((attribute) => {
                    return (
                      <div
                        key={attribute.node.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 30,
                        }}
                      >
                        <div>{attribute.node.nameString}</div>
                        <div>
                          {attribute.value.map((valueItem) => (
                            <div key={valueItem}>{valueItem}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Inner>
  );
};

export default CardRoute;
