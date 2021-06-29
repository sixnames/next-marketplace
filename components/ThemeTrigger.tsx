import * as React from 'react';
import Icon from 'components/Icon';
import { useThemeContext } from 'context/themeContext';

interface ThemeTriggerInterface {
  className?: string;
  staticColors?: boolean;
}

const ThemeTrigger: React.FC<ThemeTriggerInterface> = ({ className, staticColors }) => {
  const { toggleTheme, isDark } = useThemeContext();
  return (
    <div
      className={`flex items-center justify-center w-[30px] h-[30px] cursor-pointer ${
        staticColors ? 'text-[var(--wp-light-gray-100)]' : 'text-secondary-text'
      } ${className ? className : ''}`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Icon name={'sun'} className={`w-[16px] h-[16px]`} />
      ) : (
        <Icon name={'moon'} className={`w-[18px] h-[18px]`} />
      )}
    </div>
  );
};

export default ThemeTrigger;
