import TagLink from 'components/Link/TagLink';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import { FILTER_SEPARATOR } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
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
  const links = getProjectLinks({
    rubricSlug,
  });
  return (
    <div className={className}>
      {iconFeatures.map((productAttribute) => {
        const { attribute } = productAttribute;
        if (!attribute) {
          return null;
        }
        return (
          <div key={`${attribute._id}`} className='mb-8'>
            <div className='mb-4 text-2xl font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name} ${
                  attribute?.metric ? ` ${attribute.metric.name}` : ''
                }`;

                return (
                  <li key={`${option?.name}`}>
                    <TagLink
                      icon={option.icon?.icon}
                      href={`${links.catalogue.rubricSlug.url}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
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
