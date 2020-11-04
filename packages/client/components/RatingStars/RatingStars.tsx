import React from 'react';
import classes from './RatingStars.module.css';
import { SizeType } from '../../types';
import Icon from '../Icon/Icon';

interface RatingStarsInterface {
  size?: SizeType;
  rating: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsInterface> = ({ rating, size = 'normal', className }) => {
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
      <div className={classes.ratingNumber}>{rating}</div>
      <div className={classes.ratingStars}>
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
