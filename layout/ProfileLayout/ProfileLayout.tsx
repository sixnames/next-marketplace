import { useRouter } from 'next/router';
import * as React from 'react';
import AsideNav from '../../components/AsideNav';
import { HeadlessMenuGroupInterface } from '../../components/HeadlessMenuButton';
import Inner from '../../components/Inner';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';
import WpTitle from '../../components/WpTitle';
import { useSiteUserContext } from '../../context/siteUserContext';
import { getProjectLinks } from '../../lib/getProjectLinks';

interface ProfileLayoutInterface {
  testId?: string;
}

const links = getProjectLinks();

const ProfileLayout: React.FC<ProfileLayoutInterface> = ({ children, testId }) => {
  const router = useRouter();
  const sessionUser = useSiteUserContext();

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
              return router.asPath === links.profile.url;
            },
            onSelect: () => {
              router.push(links.profile.url).catch(console.log);
            },
          },
          {
            _id: 'Избранное',
            name: 'Избранное',
            testId: 'profile-favorite-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push(`/`).catch(console.log);
            },
          },
          {
            _id: 'Сравнение',
            name: 'Сравнение',
            testId: 'profile-compare-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
          {
            _id: 'Просмотренные товары',
            name: 'Просмотренные товары',
            testId: 'profile-viewed-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
          {
            _id: 'Персональные предложения',
            name: 'Персональные предложения',
            testId: 'profile-proposals-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
        ],
      },
      {
        name: 'Профиль',
        children: [
          {
            _id: 'Подарочные сертификаты',
            name: 'Подарочные сертификаты',
            testId: 'profile-gift-certificates',
            current: () => {
              return router.asPath === links.profile.giftCertificates.url;
            },
            onSelect: () => {
              router.push(links.profile.giftCertificates.url).catch(console.log);
            },
          },
          {
            _id: 'Мои предпочтения',
            name: 'Мои предпочтения',
            testId: 'profile-preferences-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
          {
            _id: 'Моя переписка',
            name: 'Моя переписка',
            testId: 'profile-chats-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
          {
            _id: 'Мои отзывы',
            name: 'Мои отзывы',
            testId: 'profile-feedback-link',
            current: () => {
              return router.asPath === '';
            },
            onSelect: () => {
              router.push('/').catch(console.log);
            },
          },
          {
            _id: 'Профиль',
            name: 'Профиль',
            testId: 'profile-details-link',
            current: () => {
              return router.asPath === links.profile.details.url;
            },
            onSelect: () => {
              router.push(links.profile.details.url).catch(console.log);
            },
          },
        ],
      },
    ];
  }, [router]);

  return (
    <div className='mb-12'>
      <WpBreadcrumbs currentPageName={'Профиль'} />

      <Inner lowTop testId={'profile'}>
        <div className='flex flex-col gap-8 md:flex-row'>
          <div className='relative z-20 flex-shrink-0 md:w-[var(--catalogue-filter-width)]'>
            <WpTitle>Личный кабинет</WpTitle>
            <div className='text-5 mb-8 font-medium md:mb-12'>
              С возвращением, {sessionUser?.me.name}
            </div>
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
