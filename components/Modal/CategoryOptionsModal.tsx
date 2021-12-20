import * as React from 'react';
import { useGetCategoriesAlphabetListsQuery } from '../../generated/apolloComponents';
import OptionsModal, { OptionsModalCommonPropsInterface } from './OptionsModal';

export interface CategoryOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
}

const CategoryOptionsModal: React.FC<CategoryOptionsModalInterface> = ({
  title = 'Выберите категорию',
  slugs,
  ...props
}) => {
  const { data, loading, error } = useGetCategoriesAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        slugs,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getCategoriesAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      notShowAsAlphabet
      {...props}
    />
  );
};

export default CategoryOptionsModal;
