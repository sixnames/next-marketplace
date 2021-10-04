import OptionsModal, { OptionsModalCommonPropsInterface } from 'components/Modal/OptionsModal';
import { useGetCategoriesAlphabetListsQuery } from 'generated/apolloComponents';
import * as React from 'react';

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
      {...props}
    />
  );
};

export default CategoryOptionsModal;
