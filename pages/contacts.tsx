import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import Inner from '../components/Inner';
import LinkEmail from '../components/Link/LinkEmail';
import LinkPhone from '../components/Link/LinkPhone';
import PageEditor from '../components/PageEditor';
import Socials from '../components/Socials';
import WpMap from '../components/WpMap';
import WpTitle from '../components/WpTitle';
import { useConfigContext } from '../context/configContext';
import { useThemeContext } from '../context/themeContext';
import { AddressModel } from '../db/dbModels';
import SiteLayout, { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import { phoneToReadable } from '../lib/phoneUtils';
import { getSiteInitialData } from '../lib/ssrUtils';

const ContactsRoute: React.FC = () => {
  const mapRef = React.useRef<any>(null);
  const { isDark } = useThemeContext();
  const { configs } = useConfigContext();
  const configSiteName = configs.siteName;
  const contactEmail = configs.contactEmail;
  const phone = configs.phone;
  const facebookLink = configs.facebook;
  const instagramLink = configs.instagram;
  const vkontakteLink = configs.vkontakte;
  const odnoklassnikiLink = configs.odnoklassniki;
  const youtubeLink = configs.youtube;
  const twitterLink = configs.twitter;
  const telegramLink = configs.telegram;
  const contactsContent = configs.contactsContent;
  const actualAddress: AddressModel | null = configs.actualAddress
    ? JSON.parse(configs.actualAddress)
    : null;
  const showSocials =
    facebookLink ||
    instagramLink ||
    vkontakteLink ||
    odnoklassnikiLink ||
    youtubeLink ||
    twitterLink;

  const lightThemeMarker = configs.mapMarkerLightTheme;
  const darkThemeMarker = configs.mapMarkerDarkTheme;
  const marker = (isDark ? darkThemeMarker : lightThemeMarker) || '/marker.svg';

  return (
    <Inner>
      <Head>
        <title>Контакты {configSiteName}</title>
      </Head>

      <div className='pt-10'>
        <div
          className={`mb-16 ${
            actualAddress && actualAddress.point ? 'grid lg:grid-cols-2 gap-12' : ''
          }`}
        >
          <div>
            <WpTitle>Контакты {configSiteName}</WpTitle>

            {actualAddress && actualAddress.readableAddress ? (
              <div className='mb-8 font-medium not-italic'>
                <div className='mb-1 text-secondary-text'>Наш адрес</div>
                <a
                  className='text-primary-text hover:text-theme hover:no-underline'
                  target={'_blank'}
                  rel={'nofollow noreferrer'}
                  href={`https://www.google.com/maps/place/${actualAddress.point.coordinates[1]},${actualAddress.point.coordinates[0]}`}
                >
                  {actualAddress.readableAddress}
                </a>
              </div>
            ) : null}
            <div className='mb-8 space-y-2'>
              <div className='mb-1 text-secondary-text'>Контактный телефон</div>
              {phone.map((phoneItem) => {
                return (
                  <LinkPhone
                    key={phoneItem}
                    className='block text-primary-text hover:text-theme hover:no-underline'
                    value={{
                      raw: phoneItem,
                      readable: phoneToReadable(phoneItem),
                    }}
                  />
                );
              })}
            </div>
            <div className='mb-8 space-y-2'>
              <div className='mb-1 text-secondary-text'>Email</div>
              {contactEmail.map((email) => {
                return (
                  <LinkEmail
                    key={email}
                    value={email}
                    className='block text-primary-text hover:text-theme hover:no-underline'
                  />
                );
              })}
            </div>
            {showSocials ? (
              <div className='mt-auto pt-6'>
                <div className='mb-1 text-secondary-text'>Мы в соцсетях</div>
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
          </div>

          {actualAddress && actualAddress.point && actualAddress.point.coordinates ? (
            <div>
              <WpMap
                mapRef={mapRef}
                markers={[
                  {
                    _id: 'address',
                    name: actualAddress.readableAddress,
                    icon: marker,
                    address: {
                      ...actualAddress,
                    },
                  },
                ]}
              />
            </div>
          ) : null}
        </div>

        {contactsContent ? <PageEditor value={JSON.parse(contactsContent)} readOnly /> : null}
      </div>
    </Inner>
  );
};

type ContactsInterface = SiteLayoutProviderInterface;

const Contacts: NextPage<ContactsInterface> = (props) => {
  return (
    <SiteLayout {...props}>
      <ContactsRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getSiteInitialData({
    context,
  });
}

export default Contacts;
