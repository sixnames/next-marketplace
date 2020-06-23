import React from 'react';
import useRouterQuery from '../../hooks/useRouterQuery';
import classes from './TabsContent.module.css';

interface TabsContentInterface {
  className?: string;
}

const TabsContent: React.FC<TabsContentInterface> = ({ className, children }) => {
  const { query } = useRouterQuery();
  const firstTab = '0';
  const tab = query && query.tab ? query.tab : firstTab;

  return (
    <div className={`${classes.tabsContent} ${className ? className : ''}`}>
      {React.Children.map(children, (child, index) => {
        if (index === +tab) {
          return child;
        }

        return null;
      })}
    </div>
  );
};

export default TabsContent;
