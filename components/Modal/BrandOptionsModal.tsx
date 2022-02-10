import { useGetBrandAlphabet } from 'hooks/mutations/useBrandMutations';
import * as React from 'react';
import OptionsModal, { OptionsModalCommonPropsInterface } from './OptionsModal';

export interface BrandOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
}

const BrandOptionsModal: React.FC<BrandOptionsModalInterface> = ({
  title = 'Выберите бренд',
  slugs,
  ...props
}) => {
  const payload = useGetBrandAlphabet({
    slugs,
  });

  return (
    <OptionsModal
      alphabet={payload.data?.payload}
      loading={payload.loading}
      error={payload.error}
      title={title}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandOptionsModal;
