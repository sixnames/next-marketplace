import OptionsModal, { OptionsModalInterface } from 'components/Modal/OptionsModal';
import { FILTER_SEPARATOR } from 'config/common';
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
  isSearchResult?: boolean;
  basePath: string;
  excludedParams?: string[];
}

const CatalogueAdditionalOptionsModal: React.FC<CatalogueAdditionalOptionsModalInterface> = ({
  attributeSlug,
  title,
  companyId,
  notShowAsAlphabet,
  rubricSlug,
  isSearchResult,
  basePath,
  excludedParams,
}) => {
  const router = useRouter();
  const { query } = router;
  const { hideModal } = useAppContext();
  const { data, loading, error } = useGetCatalogueAdditionalOptionsQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        filter: alwaysArray(query.catalogue),
        attributeSlug,
        companyId,
        isSearchResult,
        rubricSlug,
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
      onSubmit={(selectedOptions) => {
        hideModal();
        const selectedOptionsSlugs = selectedOptions.map(({ slug }) => {
          return `${attributeSlug}${FILTER_SEPARATOR}${slug}`;
        });
        const nextParamsList = [...alwaysArray(query.filters), ...selectedOptionsSlugs].filter(
          (param) => {
            if (!excludedParams) {
              return param;
            }
            return !excludedParams.includes(param);
          },
        );
        const nextParams = nextParamsList.join('/');
        router.push(`${basePath}/${nextParams}`).catch((e) => {
          console.log(e);
        });
      }}
    />
  );
};

export default CatalogueAdditionalOptionsModal;
