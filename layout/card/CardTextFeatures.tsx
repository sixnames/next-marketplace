import { ProductAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardTextFeaturesInterface {
  textFeatures: ProductAttributeInterface[];
  className?: string;
  cardTitle: string;
}

const CardTextFeatures: React.FC<CardTextFeaturesInterface> = ({
  textFeatures,
  children,
  className,
}) => {
  if (textFeatures.length < 1) {
    return null;
  }

  return (
    <div className={className}>
      {textFeatures.map(({ _id, attribute, readableValue }) => {
        if (!readableValue || !attribute) {
          return null;
        }
        return (
          <section className='mb-8' key={`${_id}`}>
            <h2 className='text-2xl mb-4 font-medium'>{attribute.name}</h2>
            <div className='prose max-w-full'>
              <p>{readableValue}</p>
            </div>
          </section>
        );
      })}
      {children}
    </div>
  );
};

export default CardTextFeatures;
