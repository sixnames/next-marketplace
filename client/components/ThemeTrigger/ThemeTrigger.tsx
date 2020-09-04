import React from 'react';
import classes from './ThemeTrigger.module.css';
import Icon from '../Icon/Icon';
import { useThemeContext } from '../../context/themeContext';

interface ThemeTriggerInterface {
  className?: string;
}

const ThemeTrigger: React.FC<ThemeTriggerInterface> = ({ className }) => {
  const { toggleTheme, isDark, isLight } = useThemeContext();
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
