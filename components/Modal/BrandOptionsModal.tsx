import { REQUEST_METHOD_POST } from 'config/common';
import {
  BrandAlphabetListsPayloadModel,
  BrandAlphabetModel,
} from 'db/dao/brands/getBrandAlphabetLists';
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
  const [state, setState] = React.useState<BrandAlphabetModel[] | null>(null);
  const [error, setError] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!state) {
      fetch('/api/brand/alphabet', {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify({
          slugs,
        }),
      })
        .then<BrandAlphabetListsPayloadModel>((res) => res.json())
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
  }, [slugs, state]);

  return (
    <OptionsModal
      alphabet={state}
      loading={!state}
      error={error}
      title={title}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default BrandOptionsModal;
