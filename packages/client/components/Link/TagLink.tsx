import React from 'react';
import classes from './TagLink.module.css';
import Link, { LinkInterface } from './Link';

export interface TagLinkInterface extends Omit<LinkInterface, 'activeClassName'> {
  variant?: 'dark' | 'normal';
  isActive?: boolean;
  asLink?: boolean;
}

const TagLink: React.FC<TagLinkInterface> = ({
  className,
  children,
  variant = 'normal',
  href,
  testId,
  isActive,
  asLink = true,
  ...props
}) => {
  if (asLink) {
    return (
      <Link
        href={href}
        testId={testId}
        className={`${classes.tagLink} ${isActive ? classes.tagLinkActive : ''} ${
          variant === 'dark' ? classes.tagLinkDark : ''
        } ${className ? className : ''}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={`${classes.tagLink} ${isActive ? classes.tagLinkActive : ''} ${
        variant === 'dark' ? classes.tagLinkDark : ''
      } ${className ? className : ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default TagLink;
