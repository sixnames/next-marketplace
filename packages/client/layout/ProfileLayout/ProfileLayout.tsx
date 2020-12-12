import React, { useEffect } from 'react';
import classes from './ProfileLayout.module.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import { useUserContext } from '../../context/userContext';
import { useRouter } from 'next/router';
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
  ROUTE_SIGN_IN,
} from '../../config';
import { useNotificationsContext } from '../../context/notificationsContext';
import AsideNav, { AsideNavConfigType } from '../../components/AsideNav/AsideNav';

interface ProfileLayoutInterface {
  testId?: string;
}

const ProfileLayout: React.FC<ProfileLayoutInterface> = ({ children, testId }) => {
  const { showErrorNotification } = useNotificationsContext();
  const router = useRouter();
  const { me } = useUserContext();

  useEffect(() => {
    if (!me) {
      router.push(ROUTE_SIGN_IN).catch(() => {
        showErrorNotification();
      });
    }
  }, [me, router, showErrorNotification]);

  const navConfig: AsideNavConfigType = [
    {
      name: 'Покупки',
      children: [
        {
          name: 'История заказов',
          href: `${ROUTE_PROFILE}`,
        },
        {
          name: 'Избранное',
          href: `${ROUTE_PROFILE_FAVORITE}`,
        },
        {
          name: 'Сравнение',
          href: `${ROUTE_PROFILE_COMPARE}`,
        },
        {
          name: 'Просмотренные товары',
          href: `${ROUTE_PROFILE_VIEWED}`,
        },
        {
          name: 'Персональные предложения',
          href: `${ROUTE_PROFILE_PROPOSALS}`,
        },
      ],
    },
    {
      name: 'Профиль',
      children: [
        {
          name: 'Бонусный счет',
          href: `${ROUTE_PROFILE_BONUS}`,
        },
        {
          name: 'Мои предпочтения',
          href: `${ROUTE_PROFILE_PREFERENCES}`,
        },
        {
          name: 'Моя переписка',
          href: `${ROUTE_PROFILE_CHATS}`,
        },
        {
          name: 'Мои отзывы',
          href: `${ROUTE_PROFILE_FEEDBACK}`,
        },
        {
          name: 'Профиль',
          href: `${ROUTE_PROFILE_DETAILS}`,
        },
      ],
    },
  ];

  return (
    <div className={classes.frame}>
      <Breadcrumbs currentPageName={'Профиль'} config={[]} />
      <Inner lowTop testId={'profile'}>
        <div className={classes.content}>
          <div className={classes.aside}>
            <Title>Личный кабинет</Title>
            <div className={classes.greeting}>С возвращением, {me?.name}</div>
            <AsideNav className={classes.asideNav} config={navConfig} testId={'profile-nav'} />
          </div>
          <div data-cy={testId}>{children}</div>
        </div>
      </Inner>
    </div>
  );
};

export default ProfileLayout;
