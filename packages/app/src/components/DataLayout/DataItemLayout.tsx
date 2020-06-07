import React from 'react';
import DataLayoutTitle from './DataLayoutTitle';
import TabsNav, { TabsNavConfigInterface } from '../TabsNav/TabsNav';
import Inner from '../Inner/Inner';
import classes from './DataItemLayout.module.css';

interface DataItemLayoutInterface {
  title?: string;
  titleRight?: any;
  navConfig: TabsNavConfigInterface[];
}

const DataItemLayout: React.FC<DataItemLayoutInterface> = ({
  title = '',
  titleRight,
  navConfig = [],
  children,
}) => {
  return (
    <div title={title} className={classes.Frame}>
      <DataLayoutTitle titleRight={titleRight}>{title}</DataLayoutTitle>

      <Inner wide lowTop lowBottom className={classes.Inner}>
        <TabsNav navConfig={navConfig} />
      </Inner>

      <Inner wide lowTop lowBottom className={`${classes.Inner} ${classes.ContentFrame}`}>
        <div className={classes.Content}>{children}</div>
      </Inner>
    </div>
  );
};

export default DataItemLayout;
