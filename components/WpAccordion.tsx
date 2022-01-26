import * as React from 'react';
import WpIcon from './WpIcon';

export interface WpAccordionInterface {
  titleClassName?: string;
  className?: string;
  isOpen?: boolean;
  onClick?: () => void;
  titleRight?: any;
  titleLeft?: any;
  title: string;
  lastInTree?: boolean;
  disabled?: boolean;
  noTitleStyle?: boolean;
  testId?: string;
}

const WpAccordion: React.FC<WpAccordionInterface> = ({
  titleClassName,
  className,
  isOpen,
  onClick,
  titleRight,
  titleLeft,
  children,
  title,
  lastInTree = false,
  disabled,
  noTitleStyle = false,
  testId,
}) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (onClick) onClick();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isOpen, onClick]);

  const accordionHandler = React.useCallback(() => {
    setOpen((isOpen) => {
      if (!isOpen && onClick) onClick();
      return !isOpen;
    });
  }, [onClick]);

  return (
    <div className={className ? className : ''}>
      <div
        className={`flex items-center pr-2 pb-2 ${
          noTitleStyle
            ? ''
            : 'min-h-[3rem] rounded-md border-l-4 border-gray-500 bg-secondary pt-2 pl-4 shadow-md'
        } ${titleClassName ? titleClassName : ''}`}
      >
        {titleLeft ? <div>{titleLeft}</div> : null}

        <div
          data-cy={testId}
          onClick={!disabled ? accordionHandler : undefined}
          className={`mr-4 flex items-center overflow-ellipsis whitespace-nowrap ${
            lastInTree || disabled ? 'cursor-default' : 'cursor-pointer hover:text-theme'
          }`}
        >
          <span>{title}</span>

          {lastInTree || disabled ? null : (
            <div className={`relative ml-2`}>
              <WpIcon
                className={`transition-duration-150 h-4 w-4 fill-theme transition ${
                  open ? 'rotate-180 transform' : ''
                }`}
                name={'chevron-down'}
              />
            </div>
          )}
        </div>

        {titleRight ? <div className='ml-auto flex-shrink-0'>{titleRight}</div> : null}
      </div>

      {open && <div>{children}</div>}
    </div>
  );
};
export default WpAccordion;
