import * as React from 'react';
import { useThemeContext } from '../context/themeContext';
import WpIcon from './WpIcon';

interface ThemeTriggerInterface {
  className?: string;
  staticColors?: boolean;
  style?: React.CSSProperties;
}

const ThemeTrigger: React.FC<ThemeTriggerInterface> = ({ className, style, staticColors }) => {
  const { toggleTheme, isDark } = useThemeContext();
  return (
    <div
      style={style}
      className={`flex items-center justify-center w-[30px] h-[30px] cursor-pointer ${
        staticColors ? 'text-[var(--wp-light-gray-100)]' : 'text-secondary-text'
      } ${className ? className : ''}`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <WpIcon name={'sun'} className={`w-[16px] h-[16px]`} />
      ) : (
        <WpIcon name={'moon'} className={`w-[18px] h-[18px]`} />
      )}
    </div>
  );
};

export default ThemeTrigger;
