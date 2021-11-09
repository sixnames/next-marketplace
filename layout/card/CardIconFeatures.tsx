import TagLink from 'components/Link/TagLink';
import { FILTER_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { useSiteContext } from 'context/siteContext';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardIconFeaturesInterface {
  iconFeatures: ProductAttributeInterface[];
  rubricSlug: string;
  className?: string;
}

const CardIconFeatures: React.FC<CardIconFeaturesInterface> = ({
  iconFeatures,
  rubricSlug,
  className,
}) => {
  const { urlPrefix } = useSiteContext();
  if (iconFeatures.length < 1) {
    return null;
  }
  return (
    <div className={className}>
      {iconFeatures.map((productAttribute) => {
        const { attribute } = productAttribute;
        if (!attribute) {
          return null;
        }
        return (
          <div key={`${productAttribute._id}`} className='mb-8'>
            <div className='text-2xl mb-4 font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name} ${
                  attribute?.metric ? ` ${attribute.metric.name}` : ''
                }`;

                return (
                  <li key={`${option?.name}`}>
                    <TagLink
                      icon={option.icon?.icon}
                      href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                      testId={`card-icon-option-${name}`}
                    >
                      {name}
                    </TagLink>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default CardIconFeatures;
