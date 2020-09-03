import React from 'react';
import classes from './ThemeTrigger.module.css';
import Icon from '../Icon/Icon';
import { useThemeContext } from '../../context/themeContext';

interface ThemeTriggerInterface {
  className?: string;
}

const ThemeTrigger: React.FC<ThemeTriggerInterface> = ({ className }) => {
  const { toggleTheme, isDark } = useThemeContext();
  return (
    <div className={`${classes.frame} ${className ? className : ''}`} onClick={toggleTheme}>
      <Icon name={'sun'} className={`${classes.icon} ${classes.iconSun}`} />
      <div className={`${classes.trigger} ${isDark ? classes.triggerDark : ''}`} />
      <Icon name={'moon'} className={`${classes.icon} ${classes.iconMoon}`} />
    </div>
  );
};

export default ThemeTrigger;
