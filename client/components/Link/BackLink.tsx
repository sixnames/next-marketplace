import React from 'react';
import classes from './BackLink.module.css';
import { useRouter } from 'next/router';
import Icon from '../Icon/Icon';

const BackLink: React.FC = () => {
  const router = useRouter();

  return (
    <div className={classes.frame}>
      <a href={'#'} className={classes.link} onClick={router.back}>
        <Icon name={'chevron-left'} className={classes.icon} />
        Назад
      </a>
    </div>
  );
};

export default BackLink;
