import * as React from 'react';
import classes from './AppNavUser.module.css';
import { useUserContext } from 'context/userContext';
import Icon from '../../components/Icon/Icon';

interface AppNavUserInterface {
  compact: boolean;
  openNavHandler: () => void;
}

const AppNavUser: React.FC<AppNavUserInterface> = ({ compact, openNavHandler }) => {
  const { me } = useUserContext();

  if (!me) {
    return null;
  }

  const { shortName } = me;

  return (
    <div
      data-cy={'app-nav-user'}
      className={`${classes.frame} ${compact ? classes.frameCompact : ''}`}
      onClick={openNavHandler}
    >
      <Icon className={`${classes.icon} ${compact ? classes.iconCompact : ''}`} name={'user'} />

      <div className={`${classes.content} ${compact ? classes.contentCompact : ''}`}>
        <div className={`${classes.name}`} data-cy={'app-nav-user-name'}>
          {shortName}
        </div>
      </div>
    </div>
  );
};

export default AppNavUser;
