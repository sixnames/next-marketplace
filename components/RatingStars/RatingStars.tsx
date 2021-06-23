import * as React from 'react';
import classes from './RatingStars.module.css';
import Icon from 'components/Icon';
import { SizeType } from 'types/clientTypes';

interface RatingStarsInterface {
  size?: SizeType;
  rating: number;
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
      <div className={`${classes.ratingSmall} ${className ? className : ''}`}>
        <span>{rating}</span>
        <Icon name={'star'} />
      </div>
    );
  }

  const maximumRating = 5;
  const fullWidthPercent = 100;
  const filledStarWidth = fullWidthPercent / maximumRating;
  const filledRatingWidth = filledStarWidth * rating;

  return (
    <div className={`${classes.rating} ${className ? className : ''}`}>
      {showRatingNumber ? <div className={classes.ratingNumber}>{rating}</div> : null}
      <div className={`${classes.ratingStars} ${smallStars ? classes.ratingStarsSmall : ''}`}>
        <Icon name={'star'} />
        <Icon name={'star'} />
        <Icon name={'star'} />
        <Icon name={'star'} />
        <Icon name={'star'} />

        <div className={classes.ratingStarsFilled} style={{ width: filledRatingWidth }}>
          <Icon name={'star'} />
          <Icon name={'star'} />
          <Icon name={'star'} />
          <Icon name={'star'} />
          <Icon name={'star'} />
        </div>
      </div>
    </div>
  );
};

export default RatingStars;
