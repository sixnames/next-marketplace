import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import '@reach/tabs/styles.css';
import classes from './ReachTabs.module.css';
import Inner from '../Inner/Inner';

export interface ReachTabsConfigItemInterface {
  head: any;
}

interface ReachTabsInterface {
  config: ReachTabsConfigItemInterface[];
  frameClassName?: string;
  testId?: string;
}

const ReachTabs: React.FC<ReachTabsInterface> = ({ config, testId, frameClassName, children }) => {
  return (
    <div className={`${classes.frame} ${frameClassName ? frameClassName : ''}`} data-cy={testId}>
      <Tabs>
        <Inner className={`${classes.list}`} lowBottom lowTop>
          <TabList>
            {config.map(({ head }, index) => {
              return (
                <Tab key={index} data-cy={`${testId}-${index}`}>
                  {head}
                </Tab>
              );
            })}
          </TabList>
        </Inner>
        <Inner lowBottom lowTop>
          <TabPanels>
            {React.Children.map(children, (child, index) => {
              return (
                <TabPanel key={index} data-cy={`${testId}-${index}-content`}>
                  {child}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Inner>
      </Tabs>
    </div>
  );
};

export default ReachTabs;
