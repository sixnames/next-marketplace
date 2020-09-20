import React from 'react';

interface BackLinkInterface {
  href: string;
  className?: string;
}

const BlankLink: React.FC<BackLinkInterface> = ({ href, children, className }) => {
  return (
    <a href={href} className={`${className ? className : ''}`}>
      {children}
    </a>
  );
};

export default BlankLink;
