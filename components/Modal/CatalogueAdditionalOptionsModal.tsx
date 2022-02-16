import { useRouter } from 'next/router';
import * as React from 'react';
import { AlphabetListModelType } from '../../db/dbModels';
import { CatalogueFilterAttributeOptionInterface } from '../../db/uiInterfaces';
import { alwaysArray } from '../../lib/arrayUtils';
import { ALL_ALPHABETS, FILTER_PAGE_KEY, FILTER_SEPARATOR } from '../../lib/config/common';
import { noNaN } from '../../lib/numbers';
import { useAppContext } from '../context/appContext';
import OptionsModal, { OptionsModalInterface } from './OptionsModal';

interface GetFilterOptionsAlphabetListInterface {
  options?: CatalogueFilterAttributeOptionInterface[] | null;
}

function getFilterOptionsAlphabetList({ options }: GetFilterOptionsAlphabetListInterface) {
  const countOptionNames = (options || []).reduce((acc: number, option) => {
    return acc + noNaN(option.name);
  }, 0);
  const isNumber = countOptionNames > 0;

  const payload: AlphabetListModelType<CatalogueFilterAttributeOptionInterface>[] = [];
  ALL_ALPHABETS.forEach((letter) => {
    const realLetter = letter.toLowerCase();
    const letterOptions = (options || []).filter(({ name }) => {
      const firstLetter = name.charAt(0).toLowerCase();
      return realLetter === firstLetter;
    });

    const sortedDocs = letterOptions.sort((a, b) => {
      if (isNumber) {
        return noNaN(a.name) - noNaN(b.name);
      }

      const aName = a.name;
      const bName = b.name;
      return aName.localeCompare(bName);
    });

    if (sortedDocs.length > 0) {
      payload.push({
        letter: letter.toLocaleUpperCase(),
        docs: sortedDocs,
      });
    }
  });

  return payload;
}

export interface CatalogueAdditionalOptionsModalInterface
  extends Omit<OptionsModalInterface, 'onSubmit' | 'alphabet'> {
  attributeSlug: string;
  title: string;
  basePath: string;
  excludedParams?: string[] | null;
  options?: CatalogueFilterAttributeOptionInterface[] | null;
}

const CatalogueAdditionalOptionsModal: React.FC<CatalogueAdditionalOptionsModalInterface> = ({
  title,
  notShowAsAlphabet,
  basePath,
  excludedParams,
  attributeSlug,
  options,
  optionVariant,
}) => {
  const router = useRouter();
  const { query } = router;
  const { hideModal } = useAppContext();
  const alphabet = getFilterOptionsAlphabetList({ options });

  return (
    <OptionsModal
      disableNestedOptions
      buttonText={'Показать'}
      title={title}
      alphabet={alphabet}
      optionVariant={optionVariant}
      notShowAsAlphabet={notShowAsAlphabet}
      onSubmit={(selectedOptions) => {
        hideModal();
        const filterSlugs = selectedOptions.map(({ slug }) => {
          return `${attributeSlug}${FILTER_SEPARATOR}${slug}`;
        });
        const nextParamsList = [...alwaysArray(query.filters), ...filterSlugs].filter((param) => {
          const paramParts = param.split(FILTER_SEPARATOR);
          if (paramParts[0] === FILTER_PAGE_KEY) {
            return false;
          }
          if (!excludedParams) {
            return param;
          }
          return !excludedParams.includes(param);
        });
        const nextParams = nextParamsList.join('/');
        router.push(`${basePath}/${nextParams}`).catch((e) => {
          console.log(e);
        });
      }}
    />
  );
};

export default CatalogueAdditionalOptionsModal;
