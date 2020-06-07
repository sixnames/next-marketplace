import React from 'react';
// import { useRouter } from 'next/router';

interface TabsContentInterface {
  className?: string;
}

const TabsContent: React.FC<TabsContentInterface> = ({ className, children }) => {
  // TODO query string
  const query: any = {};
  const firstTab = '0';
  const tab = query && query.tab ? query.tab : firstTab;

  return (
    <div className={`${className ? className : ''}`}>
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
