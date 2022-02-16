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
          <div className='mb-4 text-2xl font-medium'>Мнение экспертов:</div>
          <ul className='flex flex-wrap gap-4'>
            {ratingFeatures.map(({ attribute, number }) => {
              if (!attribute) {
                return null;
              }
              const optionName = `${attribute.name} ${number}`;
              return (
                <li key={`${attribute._id}`}>
                  <TagLink testId={`card-rating-option-${attribute.name}`}>{optionName}</TagLink>
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
