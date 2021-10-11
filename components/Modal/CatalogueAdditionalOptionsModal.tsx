import OptionsModal, { OptionsModalInterface } from 'components/Modal/OptionsModal';
import { ALL_ALPHABETS, FILTER_SEPARATOR } from 'config/common';
import { useAppContext } from 'context/appContext';
import { AlphabetListModelType } from 'db/dbModels';
import { CatalogueFilterAttributeOptionInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';

interface GetFilterOptionsAlphabetListInterface {
  options: CatalogueFilterAttributeOptionInterface[];
}

function getFilterOptionsAlphabetList({ options }: GetFilterOptionsAlphabetListInterface) {
  const countOptionNames = options.reduce((acc: number, option) => {
    return acc + noNaN(option.name);
  }, 0);
  const isNumber = countOptionNames > 0;

  const payload: AlphabetListModelType<CatalogueFilterAttributeOptionInterface>[] = [];
  ALL_ALPHABETS.forEach((letter) => {
    const realLetter = letter.toLowerCase();
    const letterOptions = options.filter(({ name }) => {
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
  excludedParams?: string[];
  options: CatalogueFilterAttributeOptionInterface[];
}

const CatalogueAdditionalOptionsModal: React.FC<CatalogueAdditionalOptionsModalInterface> = ({
  title,
  notShowAsAlphabet,
  basePath,
  excludedParams,
  attributeSlug,
  options,
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
