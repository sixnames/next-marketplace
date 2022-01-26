import * as React from 'react';
import { IconType } from '../types/iconTypes';
import WpIcon from './WpIcon';

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
      className='mr-4 flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-theme hover:opacity-80'
      onClick={() => {
        window.open(href, '_blank');
      }}
    >
      <WpIcon className='h-4 w-4' name={icon} />
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
