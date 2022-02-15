import * as React from 'react';
import { useConfigContext } from './context/configContext';
import { SeoContentInterface } from '../db/uiInterfaces';
import { useUpdateSeoContent } from '../hooks/mutations/useSeoContentMutations';
import WpCheckbox from './FormElements/Checkbox/WpCheckbox';

interface SeoContentNoIndexTriggerInterface {
  seoContent?: SeoContentInterface | null;
}

const SeoContentNoIndexTrigger: React.FC<SeoContentNoIndexTriggerInterface> = ({ seoContent }) => {
  const { configs } = useConfigContext();
  const [updateSeoContentMutation] = useUpdateSeoContent();

  if (!configs.useNoIndexRules) {
    return null;
  }

  if (!seoContent) {
    return null;
  }

  return (
    <label className='flex cursor-pointer items-center gap-2'>
      <WpCheckbox
        checked={Boolean(seoContent.showForIndex)}
        name={'showForIndex'}
        onChange={() => {
          updateSeoContentMutation({
            _id: `${seoContent._id}`,
            slug: seoContent.slug,
            url: seoContent.url,
            rubricSlug: seoContent.rubricSlug,
            companySlug: seoContent.companySlug,
            content: seoContent.content,
            showForIndex: !seoContent.showForIndex,
            metaTitleI18n: seoContent.metaTitleI18n,
            metaDescriptionI18n: seoContent.metaDescriptionI18n,
            titleI18n: seoContent.titleI18n,
          }).catch(console.log);
        }}
      />
      <span>Открыть для индексации</span>
    </label>
  );
};

export default SeoContentNoIndexTrigger;
