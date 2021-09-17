import { HeadlessMenuGroupInterface } from 'components/HeadlessMenuButton';
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
import { useRouter } from 'next/router';
import * as React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { useUserContext } from 'context/userContext';
import AsideNav from 'components/AsideNav';

interface ProfileLayoutInterface {
  testId?: string;
}

const ProfileLayout: React.FC<ProfileLayoutInterface> = ({ children, testId }) => {
  const router = useRouter();
  const { me } = useUserContext();

  const navConfig = React.useMemo<HeadlessMenuGroupInterface[]>(() => {
    return [
      {
        name: 'Покупки',
        children: [
          {
            _id: 'История заказов',
            name: 'История заказов',
            testId: 'profile-orders-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE).catch(console.log);
            },
          },
          {
            _id: 'Избранное',
            name: 'Избранное',
            testId: 'profile-favorite-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_FAVORITE;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_FAVORITE).catch(console.log);
            },
          },
          {
            _id: 'Сравнение',
            name: 'Сравнение',
            href: ROUTE_PROFILE_COMPARE,
            testId: 'profile-compare-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_COMPARE;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_COMPARE).catch(console.log);
            },
          },
          {
            _id: 'Просмотренные товары',
            name: 'Просмотренные товары',
            href: ROUTE_PROFILE_VIEWED,
            testId: 'profile-viewed-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_VIEWED;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_VIEWED).catch(console.log);
            },
          },
          {
            _id: 'Персональные предложения',
            name: 'Персональные предложения',
            href: ROUTE_PROFILE_PROPOSALS,
            testId: 'profile-proposals-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_PROPOSALS;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_PROPOSALS).catch(console.log);
            },
          },
        ],
      },
      {
        name: 'Профиль',
        children: [
          {
            _id: 'Бонусный счет',
            name: 'Бонусный счет',
            href: ROUTE_PROFILE_BONUS,
            testId: 'profile-bonus-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_BONUS;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_BONUS).catch(console.log);
            },
          },
          {
            _id: 'Мои предпочтения',
            name: 'Мои предпочтения',
            href: ROUTE_PROFILE_PREFERENCES,
            testId: 'profile-preferences-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_PREFERENCES;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_PREFERENCES).catch(console.log);
            },
          },
          {
            _id: 'Моя переписка',
            name: 'Моя переписка',
            href: ROUTE_PROFILE_CHATS,
            testId: 'profile-chats-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_CHATS;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_CHATS).catch(console.log);
            },
          },
          {
            _id: 'Мои отзывы',
            name: 'Мои отзывы',
            href: ROUTE_PROFILE_FEEDBACK,
            testId: 'profile-feedback-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_FEEDBACK;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_FEEDBACK).catch(console.log);
            },
          },
          {
            _id: 'Профиль',
            name: 'Профиль',
            href: ROUTE_PROFILE_DETAILS,
            testId: 'profile-details-link',
            current: () => {
              return router.asPath === ROUTE_PROFILE_DETAILS;
            },
            onSelect: () => {
              router.push(ROUTE_PROFILE_DETAILS).catch(console.log);
            },
          },
        ],
      },
    ];
  }, [router]);

  return (
    <div className='mb-12'>
      <Breadcrumbs currentPageName={'Профиль'} />

      <Inner lowTop testId={'profile'}>
        <div className='flex flex-col gap-8 md:flex-row'>
          <div className='relative z-20 md:w-[var(--catalogue-filter-width)] flex-shrink-0'>
            <Title>Личный кабинет</Title>
            <div className='text-5 font-medium mb-8 md:mb-12'>С возвращением, {me?.name}</div>
            <AsideNav
              className='sticky left-0 top-6 lg:top-16'
              config={navConfig}
              testId={'profile-nav'}
            />
          </div>
          <div className='relative z-10 flex-grow' data-cy={testId}>
            {children}
          </div>
        </div>
      </Inner>
    </div>
  );
};

export default ProfileLayout;
