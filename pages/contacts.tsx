import { GetServerSidePropsContext, NextPage } from 'next';
import * as React from 'react';
import { useConfigContext } from '../components/context/configContext';
import { useThemeContext } from '../components/context/themeContext';
import Inner from '../components/Inner';
import SiteLayout, { SiteLayoutProviderInterface } from '../components/layout/SiteLayout';
import LinkEmail from '../components/Link/LinkEmail';
import LinkPhone from '../components/Link/LinkPhone';
import PageEditor from '../components/PageEditor';
import Socials from '../components/Socials';
import WpMap from '../components/WpMap';
import WpTitle from '../components/WpTitle';
import { AddressModel } from '../db/dbModels';
import { phoneToReadable } from '../lib/phoneUtils';
import { getSiteInitialData } from '../lib/ssrUtils';

const ContactsRoute: React.FC = () => {
  const mapRef = React.useRef<any>(null);
  const { isDark } = useThemeContext();
  const { configs } = useConfigContext();
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
  const contactsTitle = configs.contactsTitle;
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
      <div className='pt-10'>
        <div
          className={`mb-16 ${
            actualAddress && actualAddress.point ? 'grid gap-12 lg:grid-cols-2' : ''
          }`}
        >
          <div>
            <WpTitle>{contactsTitle}</WpTitle>

            {actualAddress && actualAddress.readableAddress ? (
              <div className='mb-8 font-medium not-italic'>
                <div className='mb-1 text-secondary-text'>?????? ??????????</div>
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
              <div className='mb-1 text-secondary-text'>???????????????????? ??????????????</div>
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
                <div className='mb-1 text-secondary-text'>???? ?? ????????????????</div>
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

const Contacts: NextPage<SiteLayoutProviderInterface> = (props) => {
  return (
    <SiteLayout
      {...props}
      title={props.initialData.configs.contactsMetaTitle}
      description={props.initialData.configs.contactsMetaDescription}
    >
      <ContactsRoute />
    </SiteLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { props } = await getSiteInitialData({
    context,
  });
  return {
    props: {
      ...props,
      showForIndex: true,
    },
  };
}

export default Contacts;
