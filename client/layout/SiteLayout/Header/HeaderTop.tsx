import React from 'react';
import classes from './HeaderTop.module.css';
import ThemeTrigger from '../../../components/ThemeTrigger/ThemeTrigger';
import LanguageTrigger from '../../../components/LanguageTrigger/LanguageTrigger';
import Inner from '../../../components/Inner/Inner';

const HeaderTop: React.FC = () => {
  return (
    <Inner className={classes.frame} lowBottom lowTop>
      <ThemeTrigger />
      <LanguageTrigger />
    </Inner>
  );
};

export default HeaderTop;
