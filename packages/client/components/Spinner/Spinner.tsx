import React from 'react';
import classes from './Spinner.module.css';
import { useSpring, animated } from 'react-spring';

interface SpinnerInterface {
  className?: string;
  isNested?: boolean;
  isNestedAbsolute?: boolean;
  isTransparent?: boolean;
  wide?: boolean;
}

const Spinner: React.FC<SpinnerInterface> = ({
  className,
  isNested,
  isNestedAbsolute,
  wide = false,
  isTransparent,
}) => {
  const config = useSpring({
    delay: 300,
    config: {
      tension: 220,
    },
    to: { opacity: 1 },
    from: { opacity: 0 },
  });

  return (
    <animated.div
      style={{ ...config }}
      className={`${classes.frame} ${isTransparent ? classes.transparent : ''} ${
        className ? className : ''
      } ${isNested ? classes.nested : ''} ${isNestedAbsolute ? classes.absolute : ''} ${
        wide ? classes.wide : ''
      }`}
    >
      <svg className={classes.circular}>
        <circle
          className={classes.path}
          cx='50'
          cy='50'
          r='20'
          fill='none'
          strokeWidth='3'
          strokeMiterlimit='10'
        />
      </svg>
    </animated.div>
  );
};

export default Spinner;
