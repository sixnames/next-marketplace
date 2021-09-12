import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Socials from 'components/Socials';
import Title from 'components/Title';
import WpMap from 'components/WpMap';
import { useConfigContext } from 'context/configContext';
import { AddressModel } from 'db/dbModels';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { noNaN } from 'lib/numbers';
import { phoneToReadable } from 'lib/phoneUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, NextPage } from 'next';
import * as React from 'react';

const ContactsRoute: React.FC = () => {
  const mapRef = React.useRef<any>(null);
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

  return (
    <Inner>
      <div className='pt-10'>
        <div
          className={`mb-16 ${
            actualAddress && actualAddress.point ? 'grid lg:grid-cols-2 gap-12' : ''
          }`}
        >
          <div>
            <Title>Контакты {configSiteName}</Title>

            {actualAddress && actualAddress.formattedAddress ? (
              <div className='mb-8 font-medium not-italic'>
                <div className='mb-1 text-secondary-text'>Наш адрес</div>
                <a
                  className='text-primary-text hover:text-theme hover:no-underline'
                  target={'_blank'}
                  rel={'nofollow noreferrer'}
                  href={`http://www.google.com/maps/place/${actualAddress.point.coordinates[1]},${actualAddress.point.coordinates[0]}`}
                >
                  {actualAddress.formattedAddress}
                </a>
              </div>
            ) : null}
            <div className='mb-8 space-y-2'>
              <div className='mb-1 text-secondary-text'>Контактный телефон</div>
              {phone.map((phoneItem) => {
                return (
                  <a
                    key={phoneItem}
                    className='block text-primary-text hover:text-theme hover:no-underline'
                    href={`tel:${phoneItem}`}
                  >
                    {phoneToReadable(phoneItem)}
                  </a>
                );
              })}
            </div>
            <div className='mb-8'>
              <div className='mb-1 text-secondary-text'>Email</div>
              <a
                className='text-primary-text hover:text-theme hover:no-underline'
                href={`mailTo:${contactEmail}`}
              >
                {contactEmail}
              </a>
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
                    name: actualAddress.formattedAddress,
                    address: {
                      ...actualAddress,
                      formattedCoordinates: {
                        lng: noNaN(actualAddress.point.coordinates[0]),
                        lat: noNaN(actualAddress.point.coordinates[1]),
                      },
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
    <SiteLayoutProvider {...props}>
      <ContactsRoute />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getSiteInitialData({
    context,
  });
}

export default Contacts;
