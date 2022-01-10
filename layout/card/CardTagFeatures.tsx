import * as React from 'react';
import TagLink from '../../components/Link/TagLink';
import { FILTER_SEPARATOR, ROUTE_CATALOGUE } from '../../config/common';
import { useSiteContext } from '../../context/siteContext';
import { ProductAttributeInterface } from '../../db/uiInterfaces';

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
  const { urlPrefix } = useSiteContext();
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
          <div key={`${attribute._id}`} className='mb-14'>
            <div className='text-2xl mb-4 font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name}`;

                return (
                  <li key={name}>
                    <TagLink
                      href={`${urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
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
