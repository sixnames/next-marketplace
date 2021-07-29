import ControlButton from 'components/ControlButton';
import * as React from 'react';

interface CardActionsInterface {
  className?: string;
}

const CardActions: React.FC<CardActionsInterface> = ({ className }) => {
  return (
    <div className={`flex ${className ? className : ''}`}>
      <ControlButton
        size={'small'}
        icon={'compare'}
        iconSize={'mid'}
        ariaLabel={'Добавить в сравнение'}
      />
      <ControlButton
        size={'small'}
        icon={'heart'}
        iconSize={'mid'}
        ariaLabel={'Добавить в избранное'}
      />
      <ControlButton size={'small'} icon={'upload'} iconSize={'mid'} ariaLabel={'Поделиться'} />
    </div>
  );
};

export default CardActions;
