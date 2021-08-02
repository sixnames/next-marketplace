import TagLink from 'components/Link/TagLink';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardRatingFeaturesInterface {
  ratingFeatures: ProductAttributeInterface[];
  className?: string;
}

const CardRatingFeatures: React.FC<CardRatingFeaturesInterface> = ({
  ratingFeatures,
  className,
}) => {
  if (ratingFeatures.length < 1) {
    return null;
  }
  return (
    <div className={className}>
      {ratingFeatures.length > 0 ? (
        <div className=''>
          <div className=''>Мнение экспертов:</div>
          <ul className='flex flex-wrap gap-4'>
            {ratingFeatures.map(({ _id, name, number }) => {
              const optionName = `${name} ${number}`;
              return (
                <li key={`${_id}`}>
                  <TagLink testId={`card-rating-option-${name}`}>{optionName}</TagLink>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default CardRatingFeatures;