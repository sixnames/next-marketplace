import TagLink from 'components/Link/TagLink';
import { ProductAttributeInterface } from 'db/uiInterfaces';
import { FILTER_SEPARATOR } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';
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
  const links = getProjectLinks({
    rubricSlug,
  });
  return (
    <div className={className}>
      {tagFeatures.map((productAttribute) => {
        const { attribute } = productAttribute;
        if (!attribute) {
          return null;
        }
        return (
          <div key={`${attribute._id}`} className='mb-14'>
            <div className='mb-4 text-2xl font-medium'>{`${attribute.name}:`}</div>
            <ul className='flex flex-wrap gap-4'>
              {(attribute.options || []).map((option) => {
                const name = `${option?.name}`;

                return (
                  <li key={name}>
                    <TagLink
                      href={`${links.catalogue.rubricSlug.url}/${attribute.slug}${FILTER_SEPARATOR}${option.slug}`}
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
