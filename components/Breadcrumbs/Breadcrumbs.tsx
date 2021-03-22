import * as React from 'react';
import classes from './Breadcrumbs.module.css';
import Inner from '../Inner/Inner';
import { useAppContext } from 'context/appContext';
import Link, { LinkInterface } from '../Link/Link';

export interface BreadcrumbsItemInterface extends LinkInterface {
  name: string;
}

interface BreadcrumbsInterface {
  currentPageName: string;
  config?: BreadcrumbsItemInterface[];
}

const Breadcrumbs: React.FC<BreadcrumbsInterface> = ({ currentPageName, config = [] }) => {
  const { isMobile } = useAppContext();

  if (isMobile) {
    return null;
  }

  return (
    <div className={classes.frame}>
      <Inner>
        <ul className={classes.list}>
          {config.map((configItem, index) => {
            return (
              <li className={classes.listItem} key={index}>
                <Link className={classes.link} href={configItem.href}>
                  <span>{configItem.name}</span> —
                </Link>
              </li>
            );
          })}
          <li className={`${classes.listItem} ${classes.listItemCurrent}`}>{currentPageName}</li>
        </ul>
      </Inner>
    </div>
  );
};

export default Breadcrumbs;
