import { useRouter } from 'next/router';
import * as React from 'react';
import { CatalogueFilterAttributeOptionInterface } from '../../db/uiInterfaces';
import WpIcon from '../WpIcon';
import TagLink, { TagLinkInterface } from './TagLink';

interface FilterLinkInterface extends Omit<TagLinkInterface, 'href' | 'as'> {
  counter?: number | string | null;
  option: CatalogueFilterAttributeOptionInterface;
  withCross?: boolean;
  disabled?: boolean;
  postfix?: string | null;
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
  showAsLink,
  ...props
}) => {
  const router = useRouter();
  const { name, nextSlug, isSelected } = option;
  return (
    <TagLink
      size={size}
      href={showAsLink ? nextSlug : undefined}
      isActive={isSelected}
      prefetch={false}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (!showAsLink) {
          router.push(nextSlug).catch(console.log);
        }
      }}
      className={`${
        disabled
          ? 'pointer-events-none cursor-default opacity-50'
          : 'cursor-pointer transition-all hover:text-theme'
      } ${className ? className : ''}`}
      {...props}
    >
      <span>
        {name}
        {postfix ? postfix : null}
      </span>
      {counter ? <span>{counter}</span> : null}
      {withCross ? (
        <WpIcon className='ml-2 h-3 w-3 flex-shrink-0 cursor-pointer fill-theme' name={'cross'} />
      ) : null}
    </TagLink>
  );
};

export default FilterLink;
