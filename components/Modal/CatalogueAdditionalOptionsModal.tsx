import OptionsModal, { OptionsModalInterface } from 'components/Modal/OptionsModal';
import { CATALOGUE_OPTION_SEPARATOR, ROUTE_CATALOGUE } from 'config/common';
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
  rubricSlug: string;
}

const CatalogueAdditionalOptionsModal: React.FC<CatalogueAdditionalOptionsModalInterface> = ({
  attributeSlug,
  title,
  companyId,
  notShowAsAlphabet,
  rubricSlug,
}) => {
  const router = useRouter();
  const { hideModal } = useAppContext();
  const { query } = router;
  const { data, loading, error } = useGetCatalogueAdditionalOptionsQuery({
    variables: {
      input: {
        rubricSlug: `${query.rubricSlug}`,
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
      notShowAsAlphabet={notShowAsAlphabet}
      onSubmit={(options) => {
        hideModal();
        const selectedOptionsSlugs = options.map(({ slug }) => {
          return `${attributeSlug}${CATALOGUE_OPTION_SEPARATOR}${slug}`;
        });
        const nextParams = [...alwaysArray(query.catalogue), ...selectedOptionsSlugs].join('/');
        router.push(`${ROUTE_CATALOGUE}/${rubricSlug}/${nextParams}`).catch((e) => {
          console.log(e);
        });
      }}
    />
  );
};

export default CatalogueAdditionalOptionsModal;
