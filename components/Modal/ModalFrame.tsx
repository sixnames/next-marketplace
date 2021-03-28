import * as React from 'react';
import ButtonCross from '../Buttons/ButtonCross';
import { useAppContext } from 'context/appContext';
import classes from './ModalFrame.module.css';
import { ModalSizeType } from 'types/clientTypes';

interface ModalFrameInterface {
  className?: string;
  size?: ModalSizeType;
  withInner?: boolean;
  warning?: boolean;
  testId?: string;
}

const ModalFrame: React.FC<ModalFrameInterface> = ({
  children,
  className,
  withInner,
  warning,
  testId,
  size = 'normal',
}) => {
  const { hideModal } = useAppContext();

  const sizeClass = `${size === 'small' ? classes.small : ''} ${
    size === 'midWide' ? classes.midWide : ''
  } ${size === 'wide' ? classes.wide : ''}`;

  return (
    <div
      data-cy={testId}
      className={`${classes.frame} ${sizeClass} ${warning ? classes.warning : ''} ${
        className ? className : ''
      } ${withInner ? classes.withInner : ''}`}
    >
      <div>{children}</div>
      <ButtonCross
        ariaLabel={'Закрыть окно'}
        onClick={hideModal}
        className={classes.close}
        testId={'close-modal'}
      />

      <div className={classes.closeLeft} onClick={hideModal} />
      <div className={classes.closeRight} onClick={hideModal} />
    </div>
  );
};

export default ModalFrame;
