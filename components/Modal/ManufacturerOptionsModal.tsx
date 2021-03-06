import * as React from 'react';
import { useGetManufacturerAlphabetListsQuery } from '../../generated/apolloComponents';
import OptionsModal, { OptionsModalCommonPropsInterface } from './OptionsModal';

export interface ManufacturerOptionsModalInterface extends OptionsModalCommonPropsInterface {
  slugs?: string[];
}

const ManufacturerOptionsModal: React.FC<ManufacturerOptionsModalInterface> = ({
  title = 'Выберите производителя',
  slugs,
  ...props
}) => {
  const { data, loading, error } = useGetManufacturerAlphabetListsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        slugs,
      },
    },
  });

  return (
    <OptionsModal
      alphabet={data?.getManufacturerAlphabetLists}
      loading={loading}
      error={error}
      title={title}
      {...props}
    />
  );
};

export default ManufacturerOptionsModal;
