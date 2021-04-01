import {
  ROUTE_PROFILE,
  ROUTE_PROFILE_BONUS,
  ROUTE_PROFILE_CHATS,
  ROUTE_PROFILE_COMPARE,
  ROUTE_PROFILE_DETAILS,
  ROUTE_PROFILE_FAVORITE,
  ROUTE_PROFILE_FEEDBACK,
  ROUTE_PROFILE_PREFERENCES,
  ROUTE_PROFILE_PROPOSALS,
  ROUTE_PROFILE_VIEWED,
} from 'config/common';
import * as React from 'react';
import classes from './ProfileLayout.module.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import { useUserContext } from 'context/userContext';
import AsideNav, { AsideNavConfigType } from '../../components/AsideNav/AsideNav';
import Spinner from '../../components/Spinner/Spinner';

interface ProfileLayoutInterface {
  testId?: string;
}

const ProfileLayout: React.FC<ProfileLayoutInterface> = ({ children, testId }) => {
  const { state } = useUserContext();

  const navConfig = React.useMemo<AsideNavConfigType>(() => {
    return [
      {
        name: 'Покупки',
        children: [
          {
            name: 'История заказов',
            href: ROUTE_PROFILE,
            testId: 'profile-orders-link',
          },
          {
            name: 'Избранное',
            href: ROUTE_PROFILE_FAVORITE,
            testId: 'profile-favorite-link',
          },
          {
            name: 'Сравнение',
            href: ROUTE_PROFILE_COMPARE,
            testId: 'profile-compare-link',
          },
          {
            name: 'Просмотренные товары',
            href: ROUTE_PROFILE_VIEWED,
            testId: 'profile-viewed-link',
          },
          {
            name: 'Персональные предложения',
            href: ROUTE_PROFILE_PROPOSALS,
            testId: 'profile-proposals-link',
          },
        ],
      },
      {
        name: 'Профиль',
        children: [
          {
            name: 'Бонусный счет',
            href: ROUTE_PROFILE_BONUS,
            testId: 'profile-bonus-link',
          },
          {
            name: 'Мои предпочтения',
            href: ROUTE_PROFILE_PREFERENCES,
            testId: 'profile-preferences-link',
          },
          {
            name: 'Моя переписка',
            href: ROUTE_PROFILE_CHATS,
            testId: 'profile-chats-link',
          },
          {
            name: 'Мои отзывы',
            href: ROUTE_PROFILE_FEEDBACK,
            testId: 'profile-feedback-link',
          },
          {
            name: 'Профиль',
            href: ROUTE_PROFILE_DETAILS,
            testId: 'profile-details-link',
          },
        ],
      },
    ];
  }, []);

  if (state.loadingUser || !state.me) {
    return (
      <div className={classes.frame}>
        <Breadcrumbs currentPageName={'Профиль'} />
        <Inner lowTop>
          <Spinner isNested />
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.frame}>
      <Breadcrumbs currentPageName={'Профиль'} />
      <Inner lowTop testId={'profile'}>
        <div className={classes.content}>
          <div className={classes.aside}>
            <Title>Личный кабинет</Title>
            <div className={classes.greeting}>С возвращением, {state.me?.name}</div>
            <AsideNav className={classes.asideNav} config={navConfig} testId={'profile-nav'} />
          </div>
          <div data-cy={testId}>{children}</div>
        </div>
      </Inner>
    </div>
  );
};

export default ProfileLayout;
