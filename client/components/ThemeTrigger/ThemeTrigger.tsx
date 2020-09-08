import React from 'react';
import classes from './ThemeTrigger.module.css';
import Icon from '../Icon/Icon';
import { useThemeContext } from '../../context/themeContext';

interface ThemeTriggerInterface {
  className?: string;
  isCompact?: boolean;
}

const ThemeTrigger: React.FC<ThemeTriggerInterface> = ({ className, isCompact }) => {
  const { toggleTheme, isDark, isLight } = useThemeContext();

  if (isCompact) {
    return (
      <div
        className={`${classes.frame} ${classes.frameCompact} ${className ? className : ''}`}
        onClick={toggleTheme}
      >
        {isDark ? (
          <Icon
            name={'sun'}
            className={`${classes.icon} ${classes.iconSun}} ${classes.iconSunCompact} ${
              isLight ? classes.iconActive : ''
            }`}
          />
        ) : (
          <Icon
            name={'moon'}
            className={`${classes.icon} ${classes.iconMoon} ${classes.iconMoonCompact} ${
              isDark ? classes.iconActive : ''
            }`}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`${classes.frame} ${className ? className : ''}`} onClick={toggleTheme}>
      <Icon
        name={'sun'}
        className={`${classes.icon} ${classes.iconSun} ${isLight ? classes.iconActive : ''}`}
      />
      <div className={`${classes.trigger} ${isDark ? classes.triggerDark : ''}`} />
      <Icon
        name={'moon'}
        className={`${classes.icon} ${classes.iconMoon} ${isDark ? classes.iconActive : ''}`}
      />
    </div>
  );
};

export default ThemeTrigger;
