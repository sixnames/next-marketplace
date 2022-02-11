import { REQUEST_METHOD_POST } from 'config/common';
import {
  BrandCollectionAlphabetListsPayloadModel,
  BrandCollectionAlphabetModel,
} from 'db/dao/brands/getBrandCollectionAlphabetLists';
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
  const [state, setState] = React.useState<BrandCollectionAlphabetModel[] | null>(null);
  const [error, setError] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!state) {
      fetch('/api/brand-collections/alphabet', {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify({
          slugs,
          brandSlug,
          brandId,
        }),
      })
        .then<BrandCollectionAlphabetListsPayloadModel>((res) => res.json())
        .then((payload) => {
          if (!payload.success || !payload.payload) {
            setError(true);
            return;
          }
          setState(payload.payload);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [brandId, brandSlug, slugs, state]);

  return (
    <OptionsModal
      alphabet={state}
      loading={!state}
      error={error}
      title={title}
      initialEmptyListMessage={'У выбранного бренда нет коллекций'}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandCollectionOptionsModal;
