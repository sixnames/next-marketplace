import React from 'react';
import { useSpring, animated } from 'react-spring';

interface AnimateOpacityInterface {
  children?: any;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const AnimateOpacity: React.FC<AnimateOpacityInterface> = ({
  children,
  className,
  delay,
  ...props
}) => {
  const config = useSpring({
    delay,
    config: {
      tension: 220,
    },
    to: { opacity: 1 },
    from: { opacity: 0 },
  });
  return (
    <animated.div style={config} className={className ? className : ''} {...props}>
      {children}
    </animated.div>
  );
};

export default AnimateOpacity;
