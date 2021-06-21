import * as React from 'react';
import classes from 'layout/CmsLayout/CmsNavUser.module.css';
import { useUserContext } from 'context/userContext';
import Icon from 'components/Icon';

interface AppNavUserInterface {
  compact: boolean;
  openNavHandler: () => void;
}

const CmsNavUser: React.FC<AppNavUserInterface> = ({ compact, openNavHandler }) => {
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

export default CmsNavUser;
