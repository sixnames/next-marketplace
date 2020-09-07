import React from 'react';
import classes from './HeaderSearch.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import OutsideClickHandler from 'react-outside-click-handler';

const HeaderSearch: React.FC = () => {
  const { isSearchOpen, hideSearchDropdown } = useSiteContext();
  return isSearchOpen ? (
    <div className={classes.frame}>
      <OutsideClickHandler onOutsideClick={hideSearchDropdown}>
        <Inner>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam autem dolorum ea eaque
          eius eligendi eum fugiat illum ipsa, ipsam iste, laborum modi neque repellendus sit soluta
          tempora tempore voluptate?
        </Inner>
      </OutsideClickHandler>
    </div>
  ) : null;
};

export default HeaderSearch;
