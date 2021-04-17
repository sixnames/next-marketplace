import * as React from 'react';
import ButtonCross from '../Buttons/ButtonCross';
import { useAppContext } from 'context/appContext';
import { ModalSizeType } from 'types/clientTypes';

interface ModalFrameInterface {
  className?: string;
  size?: ModalSizeType;
  withInner?: boolean;
  warning?: boolean;
  testId?: string;
}

const backdropClassName = 'absolute top-0 w-[50vw] h-full';

const ModalFrame: React.FC<ModalFrameInterface> = ({
  children,
  className,
  withInner,
  warning,
  testId,
  size = 'normal',
}) => {
  const { hideModal } = useAppContext();

  const sizeClass = `${size === 'small' ? 'max-w-[526px]' : ''} ${
    size === 'midWide' ? 'max-w-[1320px]' : ''
  } ${size === 'wide' ? 'max-w-[980px]' : ''} ${size === 'normal' ? 'max-w-[600px]' : ''}`;

  return (
    <div
      data-cy={testId}
      className={`relative z-[2] w-full py-14 mx-auto my-4 shadow-xl rounded-lg ${sizeClass} ${
        warning ? 'bg-red-400' : 'bg-primary-background'
      } ${className ? className : ''} ${withInner ? '' : 'px-inner-block-horizontal-padding'}`}
    >
      <div>{children}</div>
      <div className='absolute top-0 right-0 text-secondary-text z-10'>
        <ButtonCross ariaLabel={'Закрыть окно'} onClick={hideModal} testId={'close-modal'} />
      </div>

      <div className={`${backdropClassName} right-full`} onClick={hideModal} />
      <div className={`${backdropClassName} left-full`} onClick={hideModal} />
    </div>
  );
};

export default ModalFrame;
