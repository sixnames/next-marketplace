import * as React from 'react';
import WpButton from '../../components/button/WpButton';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import Inner from '../../components/Inner';
import LinkEmail from '../../components/Link/LinkEmail';
import LinkPhone from '../../components/Link/LinkPhone';
import WpLink from '../../components/Link/WpLink';
import { MapModalInterface } from '../../components/Modal/MapModal';
import Socials from '../../components/Socials';
import WpIcon from '../../components/WpIcon';
import { ROUTE_BLOG, ROUTE_CONTACTS, ROUTE_DOCS } from '../../config/common';
import { getConstantTranslation } from '../../config/constantTranslations';
import { MAP_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import { useLocaleContext } from '../../context/localeContext';
import { PagesGroupInterface } from '../../db/uiInterfaces';
import { useShopMarker } from '../../hooks/useShopMarker';
import { phoneToRaw, phoneToReadable } from '../../lib/phoneUtils';

export interface FooterInterface {
  footerPageGroups: PagesGroupInterface[];
}

const Footer: React.FC<FooterInterface> = ({ footerPageGroups }) => {
  const { showModal } = useAppContext();
  const { configs, domainCompany } = useConfigContext();
  const { locale } = useLocaleContext();
  const marker = useShopMarker(domainCompany?.mainShop);

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
    <footer className='footer relative z-[100] bg-secondary pt-6 pb-8'>
      <Inner className='flex flex-col gap-8'>
        <div className='grid items-baseline gap-x-8 gap-y-6 lg:grid-cols-6 lg:gap-y-12'>
          <div className='flex max-w-[480px] flex-col lg:col-span-2'>
            <div className='mb-6 text-2xl font-medium'>
              Подписывайтесь на скидки <span className='inline-block'>и рекомендации</span>
            </div>
            <div className='flex'>
              <div className='flex-grow'>
                <FakeInput value={'Введите Ваш E-mail'} low theme={'secondary'} />
              </div>
              <div className='ml-4 w-form-input-height flex-shrink-0'>
                <WpButton
                  className='w-full'
                  icon={'arrow-right'}
                  theme={'secondary-b'}
                  ariaLabel={'submit'}
                  short
                />
              </div>
            </div>

            {/*socials*/}
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

            {/*main shop address*/}
            {configs.isOneShopCompany && domainCompany && domainCompany.mainShop ? (
              <div
                className='mt-6 flex cursor-pointer items-center gap-3 transition-all hover:text-theme'
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
                <div className='text-theme'>
                  <WpIcon name={'marker'} className='h-5 w-5' />
                </div>
                <div>{domainCompany.mainShop.address.readableAddress}</div>
              </div>
            ) : null}

            {/*phones*/}
            {phonesList && phonesList.length > 0 ? (
              <div className='mt-6 flex items-center gap-3'>
                <div className='text-theme'>
                  <WpIcon name={'phone'} className='h-5 w-5' />
                </div>
                <div>
                  {phonesList.map((phone) => {
                    return (
                      <LinkPhone
                        key={phone}
                        className='text-primary-text hover:text-theme hover:no-underline'
                        value={{
                          raw: phoneToRaw(phone),
                          readable: phoneToReadable(phone),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/*emails*/}
            {contactEmail && contactEmail.length > 0 ? (
              <div className='mt-6 flex items-center gap-3'>
                <div className='text-theme'>
                  <WpIcon name={'email'} className='h-5 w-5' />
                </div>
                <div>
                  {contactEmail.map((email) => {
                    return (
                      <LinkEmail
                        key={email}
                        value={email}
                        className='text-primary-text hover:text-theme hover:no-underline'
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className='grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4'>
            {footerPageGroups.map(({ name, _id, pages }, index) => {
              return (
                <div key={`${_id}`} className='font-sm'>
                  <div className='mb-1.5 uppercase'>{name}</div>
                  <ul>
                    {(pages || []).map(({ name, slug, _id }) => {
                      return (
                        <li className='' key={`${_id}`}>
                          <WpLink
                            href={`${ROUTE_DOCS}/${slug}`}
                            target={'_blank'}
                            className='block cursor-pointer pt-1.5 pb-1.5 text-secondary-text hover:text-theme hover:no-underline'
                          >
                            {name}
                          </WpLink>
                        </li>
                      );
                    })}

                    {index === 0 && showBlog ? (
                      <li className=''>
                        <WpLink
                          href={ROUTE_BLOG}
                          target={'_blank'}
                          className='block cursor-pointer pt-1.5 pb-1.5 text-secondary-text hover:text-theme hover:no-underline'
                        >
                          {blogLinkName}
                        </WpLink>
                      </li>
                    ) : null}

                    {index === 0 ? (
                      <li className=''>
                        <WpLink
                          href={`${ROUTE_CONTACTS}`}
                          target={'_blank'}
                          className='block cursor-pointer pt-1.5 pb-1.5 text-secondary-text hover:text-theme hover:no-underline'
                        >
                          {contactsLinkName}
                        </WpLink>
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <small className='text-[1em] text-secondary-text'>
            {configSiteName} © {configFoundationYear || new Date().getFullYear()} -{' '}
            {new Date().getFullYear()}
          </small>
        </div>
      </Inner>
    </footer>
  );
};

export default Footer;
