import React from 'react';
import AnimateOpacity from '../../../components/AnimateOpacity/AnimateOpacity';
import Icon from '../../../components/Icon/Icon';
import { MeType } from '../../../context/userContext';
import Link from '../../../components/Link/Link';
import classes from './HeaderUserNav.module.css';
import Backdrop from '../../../components/Backdrop/Backdrop';
import useSignOut from '../../../hooks/useSignOut';

interface HeaderUserNavInterface {
  me: MeType;
  hideDropdown: () => void;
}

const HeaderUserNav: React.FC<HeaderUserNavInterface> = ({ me, hideDropdown }) => {
  const signOutHandler = useSignOut();
  if (!me) {
    return null;
  }

  const { isAdmin } = me;
  const isPersonnel = isAdmin;

  return (
    <AnimateOpacity className={classes.frame}>
      <div className={classes.holder} data-cy={'user-nav-container'}>
        <ul>
          <li className={classes.item}>
            <Link href={'/orders'} className={classes.link} testId={'user-nav-orders'}>
              <Icon name={'ShoppingCartOutlined'} className={classes.icon} />
              <span className={classes.linkName}>{isPersonnel ? 'Кабинет' : 'Мои заказы'}</span>
            </Link>
          </li>

          <li className={classes.item}>
            <div className={classes.link} onClick={signOutHandler} data-cy={'user-nav-sign-out'}>
              <Icon name={'ExitToApp'} className={classes.icon} />
              <span className={classes.linkName}>Выход</span>
            </div>
          </li>
        </ul>
      </div>

      <Backdrop onClick={hideDropdown} />
    </AnimateOpacity>
  );
};

export default HeaderUserNav;
