import * as React from 'react';
import { LinkInterface } from '../../db/uiInterfaces';
import WpLink from './WpLink';

export interface TagLinkInterface extends Omit<LinkInterface, 'activeClassName' | 'href'> {
  theme?: 'primary' | 'secondary';
  isActive?: boolean;
  href?: string;
  icon?: string | null;
  size?: 'small' | 'normal' | 'big';
}

const TagLink: React.FC<TagLinkInterface> = ({
  className,
  children,
  theme = 'secondary',
  size = 'normal',
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
  const tagSizeClassName =
    icon || size === 'big'
      ? `min-h-[4rem] rounded-3xl px-6 text-lg py-1`
      : size === 'small'
      ? 'min-h-[1.5rem] rounded-xl px-3'
      : `min-h-[2.5rem] rounded-2xl px-4 py-1`;
  const tagClassName = `flex items-center border text-secondary-text ${tagSizeClassName} ${variantClassName} ${borderClassName}`;
  const iconClassName = `flex-shrink-0 tag-link__icon text-secondary-text mr-4`;

  if (href) {
    return (
      <WpLink
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
        {icon ? (
          <span dangerouslySetInnerHTML={{ __html: icon }} className={iconClassName} />
        ) : null}
        {children}
      </WpLink>
    );
  }

  return (
    <div
      onClick={onClick}
      data-cy={testId}
      className={`${tagClassName} ${className ? className : ''}`}
      {...props}
    >
      {icon ? <span dangerouslySetInnerHTML={{ __html: icon }} className={iconClassName} /> : null}
      {children}
    </div>
  );
};

export default TagLink;
