import React, { useState } from 'react';
import HeaderUserNav from './HeaderUserNav';
import { useUserContext } from '../../../context/userContext';
import Icon from '../../../components/Icon/Icon';
import Link from '../../../components/Link/Link';
import classes from './HeaderUi.module.css';
import { ROUTE_SIGN_IN } from '../../../config';

const HeaderUi: React.FC = () => {
  const { me } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function toggleDropdownHandler() {
    setIsDropdownOpen((prevState) => !prevState);
  }

  function hideDropdownHandler() {
    setIsDropdownOpen(false);
  }

  return (
    <div className={classes.frame}>
      <div className={classes.item}>
        {/*<Link
          activeClassName={classes.linkCurrent}
          className={classes.link}
          href={'/favorite'}
          testId={'favorite-link'}
        >
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'FavoriteBorderOutlined'} />
          </span>
          <span className={classes.label}>Избранное</span>
        </Link>*/}

        <div className={classes.link}>
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'heart'} />
          </span>
          <span className={classes.label}>Избранное</span>
        </div>
      </div>

      {/*<div className={classes.item}>
        <Link
          activeClassName={classes.linkCurrent}
          className={classes.link}
          href={'/viewed'}
          testId={'viewed-link'}
        >
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'VisibilityOutlined'} />
          </span>
          <span className={classes.label}>Просмотры</span>
        </Link>

        <div className={classes.link}>
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'VisibilityOutlined'} />
          </span>
          <span className={classes.label}>Просмотры</span>
        </div>
      </div>*/}

      {/*<div className={classes.item}>
        <Link
          activeClassName={classes.linkCurrent}
          className={classes.link}
          href={'/cart'}
          testId={'cart-link'}
        >
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'ShoppingCartOutlined'} />
            {countCartItems > 0 && <span className={`header__ui-counter`}>{countCartItems}</span>}
          </span>
          <span className={classes.label}>Корзина</span>
        </Link>

        <div className={classes.link}>
          <span className={classes.iconHolder}>
            <Icon className={classes.icon} name={'ShoppingCartOutlined'} />
            {countCartItems > 0 && <span className={`header__ui-counter`}>{countCartItems}</span>}
          </span>
          <span className={classes.label}>Корзина</span>
        </div>
      </div>*/}

      <div className={classes.item}>
        {me ? (
          <div
            className={classes.link}
            data-cy={'user-nav-trigger'}
            onClick={toggleDropdownHandler}
          >
            <span className={classes.iconHolder}>
              <Icon className={classes.icon} name={'user'} />
            </span>
            <span className={classes.label}>{me.name}</span>
          </div>
        ) : (
          <Link
            activeClassName={classes.linkCurrent}
            className={classes.link}
            href={ROUTE_SIGN_IN}
            testId={'sign-in-link'}
          >
            <span className={classes.iconHolder}>
              <Icon className={classes.icon} name={'exit'} />
            </span>
            <span className={classes.label}>Войти</span>
          </Link>
        )}

        {isDropdownOpen && me && <HeaderUserNav hideDropdown={hideDropdownHandler} me={me} />}
      </div>
    </div>
  );
};

export default HeaderUi;
