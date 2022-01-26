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
      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center ${
        staticColors ? 'text-[var(--wp-light-gray-100)]' : 'text-secondary-text'
      } ${className ? className : ''}`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <WpIcon name={'sun'} className={`h-[16px] w-[16px]`} />
      ) : (
        <WpIcon name={'moon'} className={`h-[18px] w-[18px]`} />
      )}
    </div>
  );
};

export default ThemeTrigger;
