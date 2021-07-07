import Button from 'components/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import Link from 'components/Link/Link';
import Socials from 'components/Socials';
import { ROUTE_CONTACTS, ROUTE_DOCS_PAGES } from 'config/common';
import { PagesGroupInterface } from 'db/uiInterfaces';
import { phoneToReadable } from 'lib/phoneUtils';
import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from 'components/Inner';

export interface FooterInterface {
  footerPageGroups: PagesGroupInterface[];
}

const Footer: React.FC<FooterInterface> = ({ footerPageGroups }) => {
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
    <footer className='footer relative z-[100] pt-6 pb-mobile-nav-height lg:pb-8 bg-secondary'>
      <Inner className='grid gap-x-8 gap-y-12 lg:grid-cols-6 items-baseline'>
        <div className='flex flex-col lg:col-span-2 max-w-[480px]'>
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
            <div className='mt-auto pt-10'>
              <div className='mb-2'>Мы в социальных сетях</div>
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

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 lg:col-span-4 gap-x-6 gap-y-6'>
          {footerPageGroups.map(({ name, _id, pages }, index) => {
            return (
              <div key={`${_id}`} className='font-sm'>
                <div className='uppercase mb-1.5'>{name}</div>
                <ul>
                  {(pages || []).map(({ name, slug, _id }) => {
                    return (
                      <li className='' key={`${_id}`}>
                        <Link
                          target={'_blank'}
                          className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme'
                          href={`${ROUTE_DOCS_PAGES}/${slug}`}
                        >
                          {name}
                        </Link>
                      </li>
                    );
                  })}

                  {index === 0 ? (
                    <li className='' key={`${_id}`}>
                      <Link
                        target={'_blank'}
                        className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme'
                        href={ROUTE_CONTACTS}
                      >
                        Контакты
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>

        <div className='lg:col-span-2'>
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

        <div className='lg:col-span-4 flex lg:justify-end'>
          <small className='text-secondary-text text-[1em]'>
            {configSiteName} © {new Date().getFullYear()}
          </small>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;
