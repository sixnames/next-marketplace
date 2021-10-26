import TagLink from 'components/Link/TagLink';
import { FILTER_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import * as React from 'react';

interface CardTagFeaturesInterface {
  tagFeatures: ProductAttributeInterface[];
  rubricSlug: string;
  className?: string;
}

const CardTagFeatures: React.FC<CardTagFeaturesInterface> = ({
  tagFeatures,
  rubricSlug,
  className,
}) => {
  if (tagFeatures.length < 1) {
    return null;
  }

  return (
    <div className={className}>
      {tagFeatures.map((productAttribute) => {
        const { attribute } = productAttribute;
        if (!attribute) {
          return null;
        }
        return (
          <div key={`${productAttribute._id}`} className='mb-8'>
            <div className='text-secondary-text mb-3 font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name} ${
                  attribute?.metric ? ` ${attribute.metric.name}` : ''
                }`;

                return (
                  <li key={`${option?.name}`}>
                    <TagLink
                      href={`${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
                      testId={`card-tag-option-${name}`}
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

export default CardTagFeatures;
