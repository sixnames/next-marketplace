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
  const { getSiteConfigSingleValue, currentCity } = useConfigContext();
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
    <Inner>
      <div className='pt-10'>
        <Title>Контакты {configSiteName}</Title>

        {currentCity ? (
          <address className='mb-6 text-lg font-medium not-italic'>{currentCity.name}</address>
        ) : null}

        <div className='mb-4'>
          <a
            className='text-secondary-text hover:text-theme hover:no-underline'
            href={`tel:${phone}`}
          >
            {phoneToReadable(phone)}
          </a>
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
