import TagLink from 'components/Link/TagLink';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
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
  if (iconFeatures.length < 1) {
    return null;
  }
  return (
    <div className={className}>
      {iconFeatures.map((attribute) => {
        return (
          <div key={`${attribute._id}`} className='mb-8'>
            <div className='text-secondary-text mb-3 font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name} ${
                  attribute?.metric ? ` ${attribute.metric.name}` : ''
                }`;

                return (
                  <li key={`${option?.name}`}>
                    <TagLink
                      icon={option.icon?.icon}
                      href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
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
