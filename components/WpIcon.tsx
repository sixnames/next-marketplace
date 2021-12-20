import * as React from 'react';
import { IconType } from '../types/iconTypes';

interface IconPropsInterface {
  name: IconType;
  className?: string;
  style?: React.CSSProperties;
}

const WpIcon: React.FC<IconPropsInterface> = ({ name, className, style = {} }) => {
  return (
    <svg className={`icon-${name} ${className ? className : ''}`} style={style}>
      <use
        xmlnsXlink='http://www.w3.org/1999/xlink'
        xlinkHref={`/icons/symbol-defs.svg#icon-${name}`}
      />
    </svg>
  );
};

export default WpIcon;
