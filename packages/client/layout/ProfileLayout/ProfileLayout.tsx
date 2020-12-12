import React, { useEffect } from 'react';
import classes from './ProfileLayout.module.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import { useUserContext } from '../../context/userContext';
import { useRouter } from 'next/router';
import { ROUTE_SIGN_IN } from '../../config';
import { useNotificationsContext } from '../../context/notificationsContext';

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

  return (
    <div className={classes.frame}>
      <Breadcrumbs currentPageName={'Профиль'} config={[]} />
      <Inner lowTop testId={'profile'}>
        <div className={classes.content}>
          <div className={classes.aside} data-cy={'profile-nav'}>
            <Title>Личный кабинет</Title>
            <div className={classes.greeting}>С возвращением, {me?.name}</div>
          </div>
          <div data-cy={testId}>{children}</div>
        </div>
      </Inner>
    </div>
  );
};

export default ProfileLayout;
