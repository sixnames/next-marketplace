import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import { useRouter } from 'next/router';
import * as React from 'react';
import TagLink, { TagLinkInterface } from './TagLink';
import WpIcon from 'components/WpIcon';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: CatalogueFilterAttributeOptionInterface;
  withCross?: boolean;
  disabled?: boolean;
  postfix?: string | null;
  urlPrefix?: string;
  showAsLink?: boolean;
}

const FilterLink: React.FC<FilterLinkInterface> = ({
  className,
  option,
  counter,
  withCross,
  disabled,
  postfix,
  onClick,
  size,
  urlPrefix,
  showAsLink,
  ...props
}) => {
  const router = useRouter();
  const { name, nextSlug, isSelected } = option;
  const href = `${urlPrefix}${nextSlug}`;
  return (
    <TagLink
      size={size}
      href={showAsLink ? href : undefined}
      isActive={isSelected}
      prefetch={false}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (!showAsLink) {
          router.push(href).catch(console.log);
        }
      }}
      className={`${
        disabled
          ? 'cursor-default pointer-events-none opacity-50'
          : 'cursor-pointer hover:text-theme transition-all'
      } ${className ? className : ''}`}
      {...props}
    >
      <span>
        {name}
        {postfix ? postfix : null}
      </span>
      {counter ? <span>{counter}</span> : null}
      {withCross ? (
        <WpIcon className='flex-shrink-0 w-3 h-3 ml-2 fill-theme cursor-pointer' name={'cross'} />
      ) : null}
    </TagLink>
  );
};

export default FilterLink;
