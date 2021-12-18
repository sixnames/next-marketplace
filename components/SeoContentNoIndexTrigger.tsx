import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import { useConfigContext } from 'context/configContext';
import { SeoContentInterface } from 'db/uiInterfaces';
import { useUpdateSeoContent } from 'hooks/mutations/useSeoContentMutations';
import * as React from 'react';

interface SeoContentNoIndexTriggerInterface {
  seoContent?: SeoContentInterface | null;
}

const SeoContentNoIndexTrigger: React.FC<SeoContentNoIndexTriggerInterface> = ({ seoContent }) => {
  const { configs } = useConfigContext();
  const [updateSeoContentMutation] = useUpdateSeoContent();

  if (!seoContent || !configs.useNoIndexRules) {
    return null;
  }

  return (
    <label className='flex gap-2 items-center cursor-pointer'>
      <Checkbox
        checked={Boolean(seoContent.showForIndex)}
        name={'showForIndex'}
        onChange={() => {
          updateSeoContentMutation({
            companySlug: seoContent.companySlug,
            seoContentId: `${seoContent._id}`,
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
