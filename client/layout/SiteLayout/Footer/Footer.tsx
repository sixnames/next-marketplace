import React from 'react';
import Inner from '../../../components/Inner/Inner';
import BlankLink from '../../../components/Link/BlankLink';
import Icon from '../../../components/Icon/Icon';
import Link from 'next/link';
import classes from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={classes.frame}>
      <Inner className={classes.inner} lowBottom>
        <ul className={classes.nav}>
          {/*<li className={classes.navItem}>
            <Link href={'/about'}>
              <a>О компании</a>
            </Link>
          </li>
          <li className={classes.navItem}>
            <Link href={'/about'}>
              <a>Наши кейсы</a>
            </Link>
          </li>*/}
        </ul>

        <div className={classes.right}>
          <Link href={'/'}>
            <a className={classes.logo} />
          </Link>

          <ul className={classes.contacts}>
            <li className={classes.contactsItem}>
              <address>contactAddress</address>
            </li>
            <li className={classes.contactsItem}>
              <a href={`tel:contactPhoneLink`}>contactPhone</a>
            </li>
            <li className={classes.contactsItem}>
              <a href={`mailto:contactEmail`}>E-mail: contactEmail</a>
            </li>
            <li className={classes.contactsItem}>schedule</li>
          </ul>

          <div className={classes.socials}>
            <span>Следите за нами:</span>

            <BlankLink href={'socialLinkInstagram'}>
              <Icon name={'Instagram'} />
            </BlankLink>

            <BlankLink href={'socialLinkFacebook'}>
              <Icon name={'Facebook'} />
            </BlankLink>
          </div>
        </div>

        <small className={classes.copyright}>
          © 2010 - {new Date().getFullYear()} Site™. Все для мероприятий.
        </small>
      </Inner>
    </footer>
  );
};

export default Footer;
