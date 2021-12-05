import Button from 'components/button/Button';
import FakeInput from 'components/FormElements/Input/FakeInput';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import { MapModalInterface } from 'components/Modal/MapModal';
import Socials from 'components/Socials';
import { ROUTE_BLOG_WITH_PAGE, ROUTE_CONTACTS, ROUTE_DOCS_PAGES } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { MAP_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useLocaleContext } from 'context/localeContext';
import { useSiteContext } from 'context/siteContext';
import { PagesGroupInterface } from 'db/uiInterfaces';
import { useShopMarker } from 'hooks/useShopMarker';
import { phoneToReadable } from 'lib/phoneUtils';
import * as React from 'react';
import { useConfigContext } from 'context/configContext';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';

export interface FooterInterface {
  footerPageGroups: PagesGroupInterface[];
}

const Footer: React.FC<FooterInterface> = ({ footerPageGroups }) => {
  const { showModal } = useAppContext();
  const { configs, domainCompany } = useConfigContext();
  const { locale } = useLocaleContext();
  const marker = useShopMarker(domainCompany?.mainShop);
  const { urlPrefix } = useSiteContext();

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
  const telegramLink = configs.telegram;
  const showBlog = configs.showBlog;
  const showSocials =
    facebookLink ||
    instagramLink ||
    vkontakteLink ||
    odnoklassnikiLink ||
    youtubeLink ||
    telegramLink ||
    twitterLink;

  const contactsLinkName = getConstantTranslation(`nav.contacts.${locale}`);
  const blogLinkName = getConstantTranslation(`nav.blog.${locale}`);

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
                  telegramLink={telegramLink}
                />
              </div>
            ) : null}

            {configs.isOneShopCompany && domainCompany && domainCompany.mainShop ? (
              <div
                className='flex items-center mt-8'
                onClick={() => {
                  showModal<MapModalInterface>({
                    variant: MAP_MODAL,
                    props: {
                      title: `${domainCompany.mainShop?.name}`,
                      testId: `shop-map-modal`,
                      markers: [
                        {
                          _id: domainCompany.mainShop?._id,
                          icon: marker,
                          name: `${domainCompany.mainShop?.name}`,
                          address: domainCompany.mainShop?.address,
                        },
                      ],
                    },
                  });
                }}
              >
                <div>
                  <div className='text-secondary-text'>Наш адрес</div>
                  <div className='cursor-pointer hover:text-theme transition-all'>
                    {domainCompany.mainShop.address.readableAddress}
                  </div>
                </div>
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
                            href={`${urlPrefix}${ROUTE_DOCS_PAGES}/${slug}`}
                            target={'_blank'}
                            className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme cursor-pointer'
                          >
                            {name}
                          </Link>
                        </li>
                      );
                    })}

                    {index === 0 && showBlog ? (
                      <li className=''>
                        <Link
                          href={`${urlPrefix}${ROUTE_BLOG_WITH_PAGE}`}
                          target={'_blank'}
                          className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme cursor-pointer'
                        >
                          {blogLinkName}
                        </Link>
                      </li>
                    ) : null}

                    {index === 0 ? (
                      <li className=''>
                        <Link
                          href={`${urlPrefix}${ROUTE_CONTACTS}`}
                          target={'_blank'}
                          className='block pt-1.5 pb-1.5 text-secondary-text hover:no-underline hover:text-theme cursor-pointer'
                        >
                          {contactsLinkName}
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className='lg:col-span-2'>
            <div className='grid gap-x-6 gap-y-2 sm:grid-cols-2 border-t border-border-300 pt-8 sm:border-0 sm:pt-0'>
              <div>
                <small className='text-secondary-text text-[1em]'>
                  {configSiteName} © {configFoundationYear || new Date().getFullYear()}
                </small>
              </div>

              <div>
                {(contactEmail || []).map((email) => {
                  return (
                    <LinkEmail
                      key={email}
                      value={email}
                      className='text-secondary-text hover:text-theme hover:no-underline lg:text-right'
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className='lg:col-span-4 flex lg:justify-end'>
            <div className='space-y-1'>
              {(phonesList || []).map((phone) => {
                return (
                  <LinkPhone
                    key={phone}
                    className='text-secondary-text hover:text-theme hover:no-underline'
                    value={{
                      raw: phone,
                      readable: phoneToReadable(phone),
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className='text-center text-sm text-secondary-text'>
          {'Powered by '}
          <span
            className='text-theme hover:underline cursor-pointer'
            onClick={() => {
              window.open('https://supercharger.site', '_blank');
            }}
          >
            Supercharger
          </span>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;
