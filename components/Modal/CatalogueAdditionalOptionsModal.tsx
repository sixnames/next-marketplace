import OptionsModal, { OptionsModalInterface } from 'components/Modal/OptionsModal';
import { CATALOGUE_OPTION_SEPARATOR } from 'config/common';
import { useAppContext } from 'context/appContext';
import { useGetCatalogueAdditionalOptionsQuery } from 'generated/apolloComponents';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface CatalogueAdditionalOptionsModalInterface
  extends Omit<OptionsModalInterface, 'onSubmit'> {
  attributeSlug: string;
  title: string;
  companyId?: string;
}

const CatalogueAdditionalOptionsModal: React.FC<CatalogueAdditionalOptionsModalInterface> = ({
  attributeSlug,
  title,
  companyId,
}) => {
  const router = useRouter();
  const { hideModal } = useAppContext();
  const { query } = router;
  const { data, loading, error } = useGetCatalogueAdditionalOptionsQuery({
    variables: {
      input: {
        filter: alwaysArray(query.catalogue),
        attributeSlug,
        companyId,
      },
    },
  });

  return (
    <OptionsModal
      buttonText={'Показать'}
      title={title}
      error={error}
      loading={loading}
      alphabet={data?.getCatalogueAdditionalOptions}
      onSubmit={(options) => {
        hideModal();
        const selectedOptionsSlugs = options.map(({ slug }) => {
          return `${attributeSlug}${CATALOGUE_OPTION_SEPARATOR}${slug}`;
        });
        const nextParams = [...alwaysArray(query.catalogue), ...selectedOptionsSlugs].join('/');
        router.push(`/catalogue/${nextParams}`).catch((e) => {
          console.log(e);
        });
      }}
    />
  );
};

export default CatalogueAdditionalOptionsModal;
