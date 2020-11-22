import React from 'react';
import classes from './ArrowTrigger.module.css';
import Icon from '../Icon/Icon';

interface ArrowTriggerInterface {
  name: string;
  arrowPosition?: 'left' | 'right';
  onClick: () => void;
}

const ArrowTrigger: React.FC<ArrowTriggerInterface> = ({
  name,
  onClick,
  arrowPosition = 'right',
}) => {
  return (
    <div className={classes.frame} onClick={onClick}>
      {arrowPosition === 'left' ? <Icon className={classes.iconLeft} name={'arrow-left'} /> : null}
      {name}
      {arrowPosition === 'right' ? (
        <Icon className={classes.iconRight} name={'arrow-right'} />
      ) : null}
    </div>
  );
};

export default ArrowTrigger;
