import React from 'react';
import classes from './StickyNav.module.css';
import Inner from '../../../components/Inner/Inner';

// interface StickyNavInterface {}

const StickyNav: React.FC = () => {
  return (
    <nav className={classes.nav}>
      <Inner>nav</Inner>
    </nav>
  );
};

export default StickyNav;
