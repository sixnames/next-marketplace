import { noNaN } from 'lib/numbers';
import * as React from 'react';
import Icon from 'components/Icon';
import { SizeType } from 'types/clientTypes';

interface RatingStarsInterface {
  size?: SizeType;
  rating?: number | null;
  className?: string;
  showRatingNumber?: boolean;
  smallStars?: boolean;
}

const RatingStars: React.FC<RatingStarsInterface> = ({
  rating,
  size = 'normal',
  className,
  showRatingNumber = true,
  smallStars,
}) => {
  if (size === 'small') {
    return (
      <div className={`flex items-center text-lg font-medium ${className ? className : ''}`}>
        <span>{noNaN(rating)}</span>
        <div className='text-wp-yellow ml-2'>
          <Icon className='w-5 h-5' name={'star'} />
        </div>
      </div>
    );
  }

  const maximumRating = 5;
  const fullWidthPercent = 100;
  const filledStarWidth = fullWidthPercent / maximumRating;
  const filledRatingWidth = filledStarWidth * noNaN(rating);
  const starSizeClassName = smallStars ? 'min-w-[0.75rem] w-3 h-3' : 'min-w-[1.25rem] w-5 h-5';
  const starClassName = `relative z-10 shrink-0 ${starSizeClassName}`;
  return (
    <div className={`flex items-center text-[2rem] md:text-[2.5rem] ${className ? className : ''}`}>
      {showRatingNumber ? <div className='text-lg font-medium mr-2'>{noNaN(rating)}</div> : null}
      <div className='relative'>
        <div className='flex gap-[0.1rem] relative z-10'>
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
        </div>

        <div
          className='absolute top-0 left-0 z-20 flex gap-[0.1rem] text-wp-yellow overflow-hidden'
          style={{ width: `${filledRatingWidth}%` }}
        >
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
          <Icon name={'star'} className={`${starClassName}`} />
        </div>
      </div>
    </div>
  );
};

export default RatingStars;
