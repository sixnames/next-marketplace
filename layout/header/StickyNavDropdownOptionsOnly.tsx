import * as React from 'react';
import WpLink from '../../components/Link/WpLink';
import { FILTER_SEPARATOR } from '../../config/common';
import { StickyNavAttributeInterface, StickyNavDropdownInterface } from './StickyNav';

const StickyNavAttribute: React.FC<StickyNavAttributeInterface> = ({
  attribute,
  attributeLinkStyle,
  hideDropdown,
  parentHref,
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
            <WpLink
              onClick={hideDropdown}
              style={attributeLinkStyle}
              testId={`header-nav-dropdown-option`}
              prefetch={false}
              href={`${parentHref}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
            >
              {option.image ? (
                <span className={`mb-4 flex ${isCentered ? 'justify-center' : ''}`}>
                  <span className='mx-auto block w-[100px]'>
                    <img src={option.image} width='100' height='100' alt={`${option.name}`} />
                  </span>
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
            </WpLink>

            {childOptions.length > 0 ? (
              <ul className='mt-2 space-y-1'>
                {childOptions.map((childOption) => {
                  return (
                    <li key={`${childOption._id}`}>
                      <WpLink
                        onClick={hideDropdown}
                        style={attributeLinkStyle}
                        testId={`header-nav-dropdown-option`}
                        prefetch={false}
                        href={`${parentHref}/${attribute.slug}${FILTER_SEPARATOR}${childOption.slug}`}
                      >
                        <span className='block text-secondary-text'>
                          {childOption.name}
                          {postfix}
                        </span>
                      </WpLink>
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
  hideDropdown,
  parentHref,
}) => {
  if (!attributes || attributes.length < 1) {
    return null;
  }

  return (
    <div className='grid grid-cols-5 gap-8 pb-10'>
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

export default StickyNavDropdownOptionsOnly;
