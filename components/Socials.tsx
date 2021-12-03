import Icon from 'components/Icon';
import * as React from 'react';
import { IconType } from 'types/iconTypes';

interface SocialLinkInterface {
  href?: string | null;
  icon: IconType;
}

const SocialLink: React.FC<SocialLinkInterface> = ({ href, icon }) => {
  if (!href) {
    return null;
  }

  return (
    <div
      className='flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-primary mr-4 hover:opacity-80 text-theme'
      onClick={() => {
        window.open(href, '_blank');
      }}
    >
      <Icon className='w-4 h-4' name={icon} />
    </div>
  );
};

interface SocialsInterface {
  facebookLink?: string | null;
  instagramLink?: string | null;
  vkontakteLink?: string | null;
  odnoklassnikiLink?: string | null;
  youtubeLink?: string | null;
  twitterLink?: string | null;
  telegramLink?: string | null;
}

const Socials: React.FC<SocialsInterface> = ({
  facebookLink,
  instagramLink,
  vkontakteLink,
  odnoklassnikiLink,
  twitterLink,
  youtubeLink,
  telegramLink,
}) => {
  return (
    <div className='flex items-center'>
      <SocialLink href={facebookLink} icon={'facebook'} />
      <SocialLink href={instagramLink} icon={'instagram'} />
      <SocialLink href={vkontakteLink} icon={'vkontakte'} />
      <SocialLink href={odnoklassnikiLink} icon={'odnoklassniki'} />
      <SocialLink href={twitterLink} icon={'twitter'} />
      <SocialLink href={telegramLink} icon={'telegram'} />
      <SocialLink href={youtubeLink} icon={'youtube'} />
    </div>
  );
};

export default Socials;
