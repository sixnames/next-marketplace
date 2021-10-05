import OptionsModal, { OptionsModalCommonPropsInterface } from 'components/Modal/OptionsModal';
import { useGetBrandAlphabetListsQuery } from 'generated/apolloComponents';
import * as React from 'react';

export interface BrandOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
}

const BrandOptionsModal: React.FC<BrandOptionsModalInterface> = ({
  title = 'Выберите бренд',
  slugs,
  ...props
}) => {
  const { data, loading, error } = useGetBrandAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        slugs,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getBrandAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandOptionsModal;
