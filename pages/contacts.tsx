import Inner from 'components/Inner';
import Socials from 'components/Socials';
import Title from 'components/Title';
import { useConfigContext } from 'context/configContext';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { phoneToReadable } from 'lib/phoneUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, NextPage } from 'next';
import * as React from 'react';

const ContactsRoute: React.FC = () => {
  const { configs, currentCity } = useConfigContext();
  const configSiteName = configs.siteName;
  const contactEmail = configs.contactEmail;
  const phone = configs.phone;
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
    <Inner>
      <div className='pt-10'>
        <Title>Контакты {configSiteName}</Title>

        {currentCity ? (
          <address className='mb-6 text-lg font-medium not-italic'>{currentCity.name}</address>
        ) : null}

        <div className='mb-4 space-y-2'>
          {phone.map((phoneItem) => {
            return (
              <a
                key={phoneItem}
                className='block text-secondary-text hover:text-theme hover:no-underline'
                href={`tel:${phoneItem}`}
              >
                {phoneToReadable(phoneItem)}
              </a>
            );
          })}
        </div>
        <div className='mb-4'>
          <a
            className='text-secondary-text hover:text-theme hover:no-underline'
            href={`mailTo:${contactEmail}`}
          >
            {contactEmail}
          </a>
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
