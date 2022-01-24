import * as React from 'react';
import { useGetOptionAlphabetListsQuery } from '../../generated/apolloComponents';
import OptionsModal, { OptionsModalCommonPropsInterface } from './OptionsModal';

export interface AttributeOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
  optionsGroupId: string;
  parentId?: string | null;
}

const AttributeOptionsModal: React.FC<AttributeOptionsModalInterface> = ({
  title = 'Выберите опцию',
  slugs,
  optionsGroupId,
  ...props
}) => {
  const { data, loading, error } = useGetOptionAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        optionsGroupId,
        slugs,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getOptionAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      {...props}
    />
  );
};

export default AttributeOptionsModal;
