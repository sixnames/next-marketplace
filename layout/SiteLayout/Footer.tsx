import Button from 'components/Buttons/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import Link from 'components/Link/Link';
import Socials from 'components/Socials/Socials';
import { ROUTE_CONTACTS } from 'config/common';
import { phoneToReadable } from 'lib/phoneUtils';
import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from 'components/Inner/Inner';

const navConfig = (companyName: string) => [
  {
    title: companyName,
    links: [
      {
        name: 'О компании',
      },
      {
        name: 'Контакты',
        href: ROUTE_CONTACTS,
      },
      {
        name: 'Служба поддержки',
      },
      {
        name: 'Винотеки',
      },
      {
        name: 'Вакансии',
      },
      {
        name: 'Блог компании',
      },
    ],
  },
  {
    title: 'Покупателям',
    links: [
      {
        name: 'Покупка и оплата',
      },
      {
        name: 'Программа лояльности',
      },
      {
        name: 'Консультации',
      },
      {
        name: 'Статус заявки',
      },
      {
        name: 'Срочная покупка',
      },
      {
        name: 'Гарантии',
      },
    ],
  },
  {
    title: 'Интересно',
    links: [
      {
        name: 'Отзывы о вине',
      },
      {
        name: 'Советы сомелье',
      },
      {
        name: `Лучшие вина ${new Date().getFullYear()}`,
      },
      {
        name: 'Популярные товары',
      },
      {
        name: 'Новинки',
      },
      {
        name: 'Акции',
      },
    ],
  },
  {
    title: 'Сотрудничество',
    links: [
      {
        name: 'Партнерская программа',
      },
      {
        name: 'Начать сотрудничество',
      },
      {
        name: 'Преимущества',
      },
    ],
  },
];

const Footer: React.FC = () => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configSiteName = getSiteConfigSingleValue('siteName');
  const contactEmail = getSiteConfigSingleValue('contactEmail');
  const phone = getSiteConfigSingleValue('phone');
  const facebookLink = getSiteConfigSingleValue('facebook');
  const instagramLink = getSiteConfigSingleValue('instagram');
  const vkontakteLink = getSiteConfigSingleValue('vkontakte');
  const odnoklassnikiLink = getSiteConfigSingleValue('odnoklassniki');
  const youtubeLink = getSiteConfigSingleValue('youtube');
  const twitterLink = getSiteConfigSingleValue('twitter');
  const showSocials =
    facebookLink ||
    instagramLink ||
    vkontakteLink ||
    odnoklassnikiLink ||
    youtubeLink ||
    twitterLink;

  return (
    <footer className='footer relative z-[100] pt-6 pb-mobile-nav-height wp-desktop:pb-8 bg-secondary-background'>
      <Inner className='grid gap-x-8 gap-y-12 wp-desktop:grid-cols-6'>
        <div className='flex flex-col wp-desktop:col-span-2 max-w-[480px]'>
          <div className='text-2xl font-medium mb-6'>
            Подписывайтесь на скидки <span className='inline-block'>и рекомендации</span>
          </div>
          <div className='flex'>
            <div className='flex-grow'>
              <FakeInput value={'Введите Ваш E-mail'} low theme={'secondary'} />
            </div>
            <div className='flex-shrink-0 w-form-input-height ml-4'>
              <Button className='w-full' icon={'arrow-right'} theme={'secondary-b'} short />
            </div>
          </div>

          {showSocials ? (
            <div className='mt-auto pt-12'>
              <Socials
                facebookLink={facebookLink}
                instagramLink={instagramLink}
                vkontakteLink={vkontakteLink}
                odnoklassnikiLink={odnoklassnikiLink}
                youtubeLink={youtubeLink}
                twitterLink={twitterLink}
              />
            </div>
          ) : null}
        </div>

        <div className='grid sm:grid-cols-2 wp-desktop:grid-cols-4 wp-desktop:col-span-4 gap-x-6 gap-y-6'>
          {navConfig(`${configSiteName}`).map(({ title, links }) => {
            return (
              <div key={title} className='font-sm'>
                <div className='uppercase mb-1.5'>{title}</div>
                <ul>
                  {links.map(({ name, href }) => {
                    return (
                      <li className='' key={name}>
                        {href ? (
                          <Link
                            className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme'
                            href={href}
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className='block pt-1.5 pb-1.5 text-secondary-text'>{name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className='wp-desktop:col-span-2'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <a
              className='text-secondary-text hover:text-theme hover:no-underline'
              href={`tel:${phone}`}
            >
              {phoneToReadable(phone)}
            </a>
            <a
              className='text-secondary-text hover:text-theme hover:no-underline'
              href={`mailTo:${contactEmail}`}
            >
              {contactEmail}
            </a>
          </div>
        </div>

        <div className='grid sm:grid-cols-2 wp-desktop:grid-cols-4 wp-desktop:col-span-4 gap-x-6 gap-y-6 text-xs'>
          <div className='hidden wp-desktop:block text-secondary-text' />
          <div className='text-secondary-text'>Карта сайта</div>
          <div className='text-secondary-text'>Политика конфиденциальности</div>
          <small className='text-secondary-text text-[1em]'>
            {configSiteName} © {new Date().getFullYear()}
          </small>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;
