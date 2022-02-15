import { useRouter } from 'next/router';
import * as React from 'react';
import WpLink from 'components/Link/WpLink';
import { FILTER_SEPARATOR } from 'lib/config/common';
import { useConfigContext } from 'components/context/configContext';
import { noNaN } from 'lib/numbers';
import {
  StickyNavAttributeInterface,
  StickyNavDropdownInterface,
} from 'components/layout/header/StickyNav';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  parentHref,
}) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const { options, name, metric } = attribute;
  const postfix = metric ? ` ${metric.name}` : null;
  const visibleOptionsCount = configs.stickyNavVisibleOptionsCount;
  const showOptionsMoreLink = noNaN(visibleOptionsCount) === attribute.options?.length;

  if ((options || []).length < 1) {
    return null;
  }

  return (
    <div className='flex flex-col'>
      <div
        style={attributeStyle}
        className='flex min-h-[var(--minLinkHeight)] items-center font-medium uppercase'
      >
        {name}
      </div>
      <ul className='flex flex-grow flex-col'>
        {(options || []).map((option) => {
          return (
            <li key={`${option._id}`}>
              <WpLink
                onClick={hideDropdown}
                style={attributeLinkStyle}
                testId={`header-nav-dropdown-option`}
                prefetch={false}
                href={`${parentHref}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                className='flex items-center py-1 text-secondary-text'
              >
                {option.name}
                {postfix}
              </WpLink>
            </li>
          );
        })}

        {showOptionsMoreLink ? (
          <li>
            <div
              className='flex min-h-[var(--minLinkHeight)] cursor-pointer items-center text-theme hover:underline'
              onClick={() => {
                router
                  .push(parentHref)
                  .then(() => {
                    if (hideDropdown) {
                      hideDropdown();
                    }
                  })
                  .catch(console.log);
              }}
            >
              Показать все
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

const StickyNavDropdownDefault: React.FC<StickyNavDropdownInterface> = ({
  attributes,
  attributeStyle,
  attributeLinkStyle,
  hideDropdown,
  parentHref,
}) => {
  if (!attributes || attributes.length < 1) {
    return null;
  }

  return (
    <div className='grid grid-cols-5 gap-4'>
      {(attributes || []).map((attribute) => {
        return (
          <StickyNavAttribute
            hideDropdown={hideDropdown}
            key={`${attribute._id}`}
            attribute={attribute}
            parentHref={parentHref}
            attributeStyle={attributeStyle}
            attributeLinkStyle={attributeLinkStyle}
          />
        );
      })}
    </div>
  );
};

export default StickyNavDropdownDefault;
