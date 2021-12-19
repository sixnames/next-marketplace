import * as React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useAppContext } from '../../context/appContext';
import { ModalSizeType } from '../../types/clientTypes';
import ButtonCross from '../button/ButtonCross';

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
  const sizeClass = `${size === 'small' ? 'max-w-[526px]' : ''} ${
    size === 'midWide' ? 'max-w-[980px]' : ''
  } ${size === 'wide' ? 'max-w-[1320px]' : ''} ${size === 'normal' ? 'max-w-[600px]' : ''}`;

  return (
    <div
      data-cy={testId}
      className={`relative z-[2] w-full mx-auto shadow-xl rounded-lg ${sizeClass} ${
        warning ? 'bg-red-400' : 'bg-primary'
      } ${className ? className : ''}`}
    >
      <OutsideClickHandler onOutsideClick={hideModal}>
        <div className={`py-14 ${withInner ? '' : 'px-inner-block-horizontal-padding'}`}>
          <div>{children}</div>
          <div className='absolute top-0 right-0 text-secondary-text z-10'>
            <ButtonCross ariaLabel={'Закрыть окно'} onClick={hideModal} testId={'close-modal'} />
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default ModalFrame;
