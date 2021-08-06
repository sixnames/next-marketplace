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
  const { configs } = useConfigContext();
  const configSiteName = configs.siteName;
  const configFoundationYear = configs.siteFoundationYear;
  const contactEmail = configs.contactEmail;
  const phonesList = configs.phone;
  const facebookLink = configs.facebook;
  const instagramLink = configs.instagram;
  const vkontakteLink = configs.vkontakte;
  const odnoklassnikiLink = configs.odnoklassniki;
  const youtubeLink = configs.youtube;
  const twitterLink = configs.twitter;
  const showSocials =
    facebookLink ||
    instagramLink ||
    vkontakteLink ||
    odnoklassnikiLink ||
    youtubeLink ||
    twitterLink;

  return (
    <footer className='footer relative z-[100] pt-6 pb-8 bg-secondary'>
      <Inner className='flex flex-col gap-8'>
        <div className='grid gap-x-8 gap-y-6 lg:gap-y-12 lg:grid-cols-6 items-baseline'>
          <div className='flex flex-col lg:col-span-2 max-w-[480px]'>
            <div className='text-2xl font-medium mb-6'>
              Подписывайтесь на скидки <span className='inline-block'>и рекомендации</span>
            </div>
            <div className='flex'>
              <div className='flex-grow'>
                <FakeInput value={'Введите Ваш E-mail'} low theme={'secondary'} />
              </div>
              <div className='flex-shrink-0 w-form-input-height ml-4'>
                <Button
                  className='w-full'
                  icon={'arrow-right'}
                  theme={'secondary-b'}
                  ariaLabel={'submit'}
                  short
                />
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
                      <li className=''>
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
            <div className='grid gap-x-6 gap-y-2 sm:grid-cols-2'>
              <div>
                <small className='text-secondary-text text-[1em]'>
                  {configSiteName} © {configFoundationYear || new Date().getFullYear()}
                </small>
              </div>

              <a
                className='text-secondary-text hover:text-theme hover:no-underline lg:text-right'
                href={`mailTo:${contactEmail}`}
              >
                {contactEmail}
              </a>
            </div>
          </div>

          <div className='lg:col-span-4 flex lg:justify-end'>
            <div className='space-y-1'>
              {(phonesList || []).map((phone) => {
                return (
                  <div key={phone}>
                    <a
                      className='text-secondary-text hover:text-theme hover:no-underline'
                      href={`tel:${phone}`}
                    >
                      {phoneToReadable(phone)}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className='text-center text-sm text-secondary-text'>
          {'Powered by '}
          <a href={'https://supercharger.site'} target={'_blank'} rel='noreferrer'>
            Supercharger
          </a>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;
