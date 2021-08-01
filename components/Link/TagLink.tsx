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
  onClick,
  ...props
}) => {
  const borderClassName = isActive
    ? `border-theme`
    : theme === 'secondary'
    ? `border-secondary`
    : `border-primary`;
  const variantClassName = theme === 'secondary' ? `bg-secondary` : `bg-primary`;
  const tagSizeClassName = icon
    ? `min-h-[4rem] rounded-3xl px-6 text-lg`
    : `min-h-[2.5rem] rounded-2xl px-4`;
  const tagClassName = `flex items-center border text-secondary-text py-1 ${tagSizeClassName} ${variantClassName} ${borderClassName}`;
  const iconClassName = `flex-shrink-0 w-10 h-10 mr-6`;

  if (href) {
    return (
      <Link
        href={href}
        testId={testId}
        prefetch={prefetch}
        shallow={shallow}
        onClick={onClick}
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
    <div
      onClick={onClick}
      data-cy={testId}
      className={`${tagClassName} ${className ? className : ''}`}
      {...props}
    >
      {icon ? <Icon className={iconClassName} name={icon} /> : null}
      {children}
    </div>
  );
};

export default TagLink;
