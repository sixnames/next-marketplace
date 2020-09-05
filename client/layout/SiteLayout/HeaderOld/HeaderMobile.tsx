import React, { Fragment, MutableRefObject, useEffect, useState } from 'react';
import HeaderMobileItem from './HeaderMobileItem';
import useScrollPosition from '../../../hooks/useScrollPosition';
import Icon from '../../../components/Icon/Icon';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import { useSiteContext } from '../../../context/siteContext';
import classes from './HeaderMobile.module.css';

interface HeaderMobileInterface {
  headerRef: MutableRefObject<HTMLElement | null>;
}

const HeaderMobile: React.FC<HeaderMobileInterface> = ({ headerRef }) => {
  const { isScrolled } = useScrollPosition(headerRef, 88);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { getRubricsTree } = useSiteContext();

  function toggleNavHandler() {
    setIsNavOpen((prevState) => !prevState);
  }

  function hideNavHandler() {
    setIsNavOpen(false);
  }

  useEffect(() => {
    if (isScrolled) {
      hideNavHandler();
    }
  }, [isScrolled]);

  return (
    <Fragment>
      <div onClick={toggleNavHandler} className={classes.trigger}>
        <Icon
          className={`${classes.triggerIcon} ${isNavOpen ? classes.triggerIconActive : ''}`}
          name={'burger'}
        />
      </div>

      {isNavOpen && (
        <AnimateOpacity className={classes.frame}>
          <div className={classes.holder}>
            <div className={classes.scroll}>
              <ul>
                {getRubricsTree.map((rubric, i) => (
                  <HeaderMobileItem hideNav={hideNavHandler} rubric={rubric} key={i} />
                ))}
              </ul>
            </div>
          </div>

          <div onClick={hideNavHandler} className={classes.backdrop} />
        </AnimateOpacity>
      )}
    </Fragment>
  );
};

export default HeaderMobile;
