import React from 'react';
import classes from './Breadcrumbs.module.css';
import Inner from '../Inner/Inner';
import { useAppContext } from '../../context/appContext';

const Breadcrumbs: React.FC = () => {
  const { isMobile } = useAppContext();

  if (isMobile) {
    return null;
  }

  return (
    <div className={classes.frame}>
      <Inner>
        <ul className={classes.list}>
          <li className={classes.listItem}>Главная —</li>
          <li className={classes.listItem}>Вино —</li>
          <li className={classes.listItem}>Белое —</li>
          <li className={classes.listItem}>Сухое —</li>
          <li className={classes.listItem}>Brancott Estate</li>
        </ul>
      </Inner>
    </div>
  );
};

export default Breadcrumbs;
