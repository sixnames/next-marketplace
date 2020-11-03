import React from 'react';
import classes from './Breadcrumbs.module.css';
import Inner from '../Inner/Inner';

const Breadcrumbs: React.FC = () => {
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
