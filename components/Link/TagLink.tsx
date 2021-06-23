import Icon from 'components/Icon';
import * as React from 'react';
import { IconType } from 'types/iconTypes';
import Link, { LinkInterface } from './Link';

export interface TagLinkInterface extends Omit<LinkInterface, 'activeClassName' | 'href'> {
  theme?: 'primary' | 'secondary';
  isActive?: boolean;
  href?: string;
  icon?: IconType | null;
}

const TagLink: React.FC<TagLinkInterface> = ({
  className,
  children,
  theme = 'secondary',
  href,
  testId,
  isActive,
  prefetch,
  shallow,
  icon,
  ...props
}) => {
  const borderClassName = isActive
    ? `border-theme`
    : theme === 'secondary'
    ? `border-secondary`
    : `border-primary`;
  const variantClassName = theme === 'secondary' ? `bg-secondary` : `bg-primary`;
  const tagSizeClassName = icon ? `h-16 rounded-3xl px-6 text-lg` : `h-9 rounded-2xl px-4`;
  const tagClassName = `flex items-center border text-secondary-text whitespace-nowrap ${tagSizeClassName} ${variantClassName} ${borderClassName}`;
  const iconClassName = `w-10 h-10 mr-6`;

  if (href) {
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
        {icon ? <Icon className={iconClassName} name={icon} /> : null}
        {children}
      </Link>
    );
  }

  return (
    <div data-cy={testId} className={`${tagClassName} ${className ? className : ''}`} {...props}>
      {icon ? <Icon className={iconClassName} name={icon} /> : null}
      {children}
    </div>
  );
};

export default TagLink;
