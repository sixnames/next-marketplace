import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { StickyNavAttributeInterface, StickyNavDropdownInterface } from 'layout/header/StickyNav';
import * as React from 'react';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  hideDropdownHandler,
  rubricSlug,
  attributeLinkStyle,
}) => {
  const { options, metric } = attribute;
  const postfix = metric ? ` ${metric.name}` : null;

  if ((options || []).length < 1) {
    return null;
  }

  return (
    <React.Fragment>
      {(options || []).map((option) => {
        const childOptions = option.options || [];
        const isCentered = childOptions.length < 1;

        return (
          <div key={`${option._id}`}>
            <Link
              style={attributeLinkStyle}
              testId={`header-nav-dropdown-option`}
              prefetch={false}
              href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
              onClick={hideDropdownHandler}
            >
              {option.image ? (
                <span className='block mb-4 w-[120px]'>
                  <img src={option.image} width='100' height='100' alt={`${option.name}`} />
                </span>
              ) : null}
              <span
                className={`block text-xl font-medium text-primary-text ${
                  isCentered ? 'text-center' : ''
                }`}
              >
                {option.name}
                {postfix}
              </span>
            </Link>

            {childOptions.length > 0 ? (
              <ul className='mt-2 space-y-1'>
                {childOptions.map((childOption) => {
                  return (
                    <li key={`${childOption._id}`}>
                      <Link
                        style={attributeLinkStyle}
                        testId={`header-nav-dropdown-option`}
                        prefetch={false}
                        href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${childOption.slug}`}
                        onClick={hideDropdownHandler}
                      >
                        <span className='block text-secondary-text'>
                          {childOption.name}
                          {postfix}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </React.Fragment>
  );
};

const StickyNavDropdownOptionsOnly: React.FC<StickyNavDropdownInterface> = ({
  attributes,
  attributeStyle,
  attributeLinkStyle,
  dropdownStyle,
  hideDropdownHandler,
  isDropdownOpen,
  rubricSlug,
}) => {
  if (!attributes || attributes.length < 1) {
    return null;
  }

  return (
    <div
      style={dropdownStyle}
      data-cy={'header-nav-dropdown'}
      className={`absolute top-full w-full inset-x-0 bg-secondary shadow-lg ${
        isDropdownOpen ? '' : 'h-[1px] overflow-hidden header-hidden-dropdown'
      }`}
    >
      <Inner>
        <div className='grid gap-8 pb-10 grid-cols-5'>
          {(attributes || []).map((attribute) => {
            return (
              <StickyNavAttribute
                key={`${attribute._id}`}
                attribute={attribute}
                hideDropdownHandler={hideDropdownHandler}
                rubricSlug={rubricSlug}
                attributeStyle={attributeStyle}
                attributeLinkStyle={attributeLinkStyle}
              />
            );
          })}
        </div>
      </Inner>
    </div>
  );
};

export default StickyNavDropdownOptionsOnly;
