import React, { useEffect, useState } from 'react';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import Icon from '../Icon/Icon';
import classes from './Accordion.module.css';

interface AccordionInterface {
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

const Accordion: React.FC<AccordionInterface> = ({
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
        className={`${noTitleStyle ? classes.titleNoStyle : classes.title} ${
          titleClassName ? titleClassName : ''
        }`}
      >
        {!!titleLeft && <div className={classes.titleLeft}>{titleLeft()}</div>}

        <div
          data-cy={testId}
          onClick={!disabled ? accordionHandler : undefined}
          className={`${classes.trigger} ${lastInTree || disabled ? classes.triggerDisabled : ''}`}
        >
          <span>{title}</span>

          {!lastInTree && (
            <div className={`${classes.arrow} ${open ? classes.arrowActive : ''}`}>
              <Icon name={'ExpandMore'} />
            </div>
          )}
        </div>

        {titleRight && <div className={classes.titleRight}>{titleRight}</div>}
      </div>

      {open && <AnimateOpacity>{children}</AnimateOpacity>}
    </div>
  );
};
export default Accordion;