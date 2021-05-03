import * as React from 'react';
import Link, { LinkInterface } from './Link';

export interface TagLinkInterface extends Omit<LinkInterface, 'activeClassName'> {
  theme?: 'primary' | 'secondary';
  isActive?: boolean;
  asLink?: boolean;
}

const TagLink: React.FC<TagLinkInterface> = ({
  className,
  children,
  theme = 'secondary',
  href,
  testId,
  isActive,
  asLink = true,
  prefetch,
  shallow,
  ...props
}) => {
  const borderClassName = isActive
    ? `border-theme`
    : theme === 'secondary'
    ? `border-secondary`
    : `border-primary`;
  const variantClassName = theme === 'secondary' ? `bg-secondary` : `bg-primary`;
  const tagClassName = `flex items-center h-10 px-4 border rounded-2xl text-secondary-text ${variantClassName} ${borderClassName}`;
  if (asLink) {
    return (
      <Link
        href={href}
        testId={testId}
        prefetch={prefetch}
        shallow={shallow}
        className={`${tagClassName} hover:no-underline hover:text-theme ${
          className ? className : ''
        }`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <div className={`${tagClassName} ${className ? className : ''}`} {...props}>
      {children}
    </div>
  );
};

export default TagLink;
