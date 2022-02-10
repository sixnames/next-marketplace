import { useGetBrandCollectionAlphabet } from 'hooks/mutations/useBrandMutations';
import * as React from 'react';
import OptionsModal, { OptionsModalCommonPropsInterface } from './OptionsModal';

export interface BrandCollectionOptionsModalInterface extends OptionsModalCommonPropsInterface {
  brandSlug?: string;
  brandId?: string;
  slugs?: string[];
}

const BrandCollectionOptionsModal: React.FC<BrandCollectionOptionsModalInterface> = ({
  title = 'Выберите коллекцию бренда',
  slugs,
  brandSlug,
  brandId,
  ...props
}) => {
  const payload = useGetBrandCollectionAlphabet({
    slugs,
    brandSlug,
    brandId,
  });

  return (
    <OptionsModal
      alphabet={payload.data?.payload}
      loading={payload.loading}
      error={payload.error}
      title={title}
      initialEmptyListMessage={'У выбранного бренда нет коллекций'}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandCollectionOptionsModal;
