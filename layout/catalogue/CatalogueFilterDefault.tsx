import FilterSelectedAttributes from 'components/FilterSelectedAttributes';
import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import { CATALOGUE_FILTER_VISIBLE_OPTIONS, FILTER_PRICE_KEY } from 'config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import {
  CatalogueFilterAttributePropsInterface,
  CatalogueFilterInterface,
} from 'layout/catalogue/CatalogueFilter';
import * as React from 'react';
import FilterLink from 'components/Link/FilterLink';
import Link from 'components/Link/Link';
import { useConfigContext } from 'context/configContext';
import { useAppContext } from 'context/appContext';

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
}) => {
  const { showModal } = useAppContext();
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;

  const { name, clearSlug, options, isSelected, slug } = attribute;
  const isPrice = slug === FILTER_PRICE_KEY;

  const visibleOptions = isPrice ? options : options.slice(0, maxVisibleOptions);
  const hiddenOptions = isPrice ? [] : options.slice(maxVisibleOptions);
  const hasMoreOptions = hiddenOptions.length > 0;

  return (
    <div className='mb-12'>
      <div className='flex items-baseline justify-between mb-4'>
        <span className='text-lg font-bold'>{name}</span>
        {isSelected ? (
          <Link href={clearSlug} onClick={onClick} className='font-medium text-theme'>
            Очистить
          </Link>
        ) : null}
      </div>

      <div className='flex flex-wrap gap-2'>
        {visibleOptions.map((option, optionIndex) => {
          const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
          return <FilterLink onClick={onClick} option={option} key={option.slug} testId={testId} />;
        })}
      </div>

      {hasMoreOptions ? (
        <div
          className='uppercase cursor-pointer text-theme mt-6'
          onClick={() => {
            showModal<CatalogueAdditionalOptionsModalInterface>({
              variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
              props: {
                attributeSlug: attribute.slug,
                notShowAsAlphabet: attribute.notShowAsAlphabet,
                title: attribute.name,
                basePath,
                options: attribute.options,
              },
            });
          }}
        >
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

const CatalogueFilterDefault: React.FC<CatalogueFilterInterface> = ({
  attributes,
  selectedAttributes,
  rubricSlug,
  hideFilterHandler,
  companyId,
  isSearchResult,
  clearSlug,
  basePath,
}) => {
  return (
    <React.Fragment>
      <FilterSelectedAttributes
        clearSlug={clearSlug}
        selectedAttributes={selectedAttributes}
        onClick={hideFilterHandler}
      />

      {attributes.map((attribute, attributeIndex) => {
        return (
          <CatalogueFilterAttribute
            onClick={hideFilterHandler}
            rubricSlug={rubricSlug}
            companyId={companyId}
            attribute={attribute}
            key={`${attribute._id}`}
            isSearchResult={isSearchResult}
            attributeIndex={attributeIndex}
            basePath={basePath}
          />
        );
      })}
    </React.Fragment>
  );
};

export default CatalogueFilterDefault;
