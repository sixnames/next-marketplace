import React, { useRef } from 'react';
import Inner from '../../../components/Inner/Inner';
import HeaderSearch from './HeaderSearch';
import HeaderUi from './HeaderUI';
import HeaderNav from './HeaderNav';
import useIsMobile from '../../../hooks/useIsMobile';
import HeaderMobile from './HeaderMobile';
import Link from 'next/link';
import classes from './Header.module.css';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <header className={classes.frame} ref={headerRef}>
      <div className={classes.top}>
        <Inner lowTop lowBottom className={classes.inner}>
          <ul className={classes.topNav}>
            <li className={classes.topNavItem}>
              <Link href={'/about'}>
                <a>Наши кейсы</a>
              </Link>
            </li>
          </ul>

          <div className={classes.topRight}>
            <a href={`tel:contactPhone`}>contactPhone</a>

            <div className={classes.topNavItem}>
              <div className={classes.topLink}>Заказать звонок</div>
            </div>
          </div>
        </Inner>
      </div>

      <Inner className={classes.middle} lowTop lowBottom>
        <Link href={'/'}>
          <a className={classes.logo} />
        </Link>

        <HeaderSearch />

        {isMobile && <HeaderMobile headerRef={headerRef} />}

        <HeaderUi />
      </Inner>
      {!isMobile && <HeaderNav />}
    </header>
  );
};

export default Header;
