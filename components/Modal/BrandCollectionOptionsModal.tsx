import * as React from 'react';
import { useGetBrandCollectionAlphabetListsQuery } from '../../generated/apolloComponents';
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
  const { data, loading, error } = useGetBrandCollectionAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        slugs,
        brandSlug,
        brandId,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getBrandCollectionAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      initialEmptyListMessage={'У выбранного бренда нет коллекций'}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandCollectionOptionsModal;
