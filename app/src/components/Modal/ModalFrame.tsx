import React from 'react';
import ButtonCross from '../Buttons/ButtonCross';
import { useAppContext } from '../../context/appContext';
import classes from './ModalFrame.module.css';

interface ModalFrameInterface {
  className?: string;
  wide?: boolean;
  mid?: boolean;
  withInner?: boolean;
  warning?: boolean;
  testId?: string;
}

const ModalFrame: React.FC<ModalFrameInterface> = ({
  children,
  className,
  wide,
  mid,
  withInner,
  warning,
  testId,
}) => {
  const { hideModal } = useAppContext();

  return (
    <div
      data-cy={testId}
      className={`${classes.frame} ${warning ? classes.warning : ''} ${
        className ? className : ''
      } ${wide ? classes.wide : ''} ${mid ? classes.midWide : ''} ${
        withInner ? classes.withInner : ''
      }`}
    >
      <div>{children}</div>
      <ButtonCross onClick={hideModal} className={classes.close} />

      <div className={classes.closeLeft} onClick={hideModal} />
      <div className={classes.closeRight} onClick={hideModal} />
    </div>
  );
};

export default ModalFrame;
