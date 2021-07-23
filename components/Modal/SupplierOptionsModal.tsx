import OptionsModal, { OptionsModalCommonPropsInterface } from 'components/Modal/OptionsModal';
import { useGetSupplierAlphabetListsQuery } from 'generated/apolloComponents';
import * as React from 'react';

export interface SupplierOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
}

const SupplierOptionsModal: React.FC<SupplierOptionsModalInterface> = ({
  title = 'Выберите поставщика',
  slugs,
  ...props
}) => {
  const { data, loading, error } = useGetSupplierAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        slugs,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getSupplierAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      {...props}
    />
  );
};

export default SupplierOptionsModal;
