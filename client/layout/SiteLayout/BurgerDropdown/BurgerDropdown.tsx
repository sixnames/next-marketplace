import React from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderTop from '../Header/HeaderTop';
import useIsMobile from '../../../hooks/useIsMobile';
import { useSiteContext } from '../../../context/siteContext';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import classes from './BurgerDropdown.module.css';

export interface BurgerDropdownSizesInterface {
  top: number;
  height: number;
}

const BurgerDropdown: React.FC<BurgerDropdownSizesInterface> = ({ top, height }) => {
  const { isBurgerDropdownOpen, hideBurgerDropdown } = useSiteContext();
  const isMobile = useIsMobile();

  return isBurgerDropdownOpen ? (
    <AnimateOpacity className={classes.frame} style={{ top, height }}>
      <Inner lowBottom lowTop className={classes.inner}>
        <div className={classes.dropdown}>
          <div>
            <div className={classes.dropdownContent}>
              {isMobile ? <HeaderTop /> : null}
              <div />
            </div>
          </div>
        </div>
        <div className={classes.backdrop} onClick={hideBurgerDropdown} />
      </Inner>
    </AnimateOpacity>
  ) : null;
};

export default BurgerDropdown;
