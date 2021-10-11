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
import Icon from 'components/Icon';
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
          className='uppercase cursor-pointer hover:text-theme mt-6'
          onClick={() => {
            showModal<CatalogueAdditionalOptionsModalInterface>({
              variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
              props: {
                attributeSlug: attribute.slug,
                notShowAsAlphabet: attribute.notShowAsAlphabet,
                title: attribute.name,
                basePath,
                options: hiddenOptions,
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
  catalogueCounterString,
  hideFilterHandler,
  isFilterVisible,
  companyId,
  isSearchResult,
  clearSlug,
  basePath,
}) => {
  return (
    <div
      className={`catalogue__filter lg:col-span-2 lg:flex lg:items-end inset-0 fixed z-[140] lg:z-10 bg-primary lg:relative overflow-auto h-[var(--fullHeight,100vh)] lg:h-auto ${
        isFilterVisible ? 'block lg:flex' : 'hidden lg:flex'
      }`}
    >
      <div className='w-full px-inner-block-horizontal-padding py-inner-block-vertical-padding lg:p-0 lg:sticky lg:bottom-8'>
        <div className='hidden lg:block text-secondary-text h-[var(--catalogueVieButtonSize)] flex items-center mb-8'>
          {catalogueCounterString}
        </div>

        {/* Mobile title */}
        <div className='lg:hidden flex items-center justify-end min-h-[2rem] mb-4 text-lg font-medium'>
          <div className='truncate text-center w-[calc(100%-(var(--formInputHeightSmall)*2))]'>
            Фильтр
          </div>
          <div
            className='text-secondary-text flex items-center justify-center w-[var(--formInputHeightSmall)] h-[var(--formInputHeightSmall)]'
            onClick={hideFilterHandler}
          >
            <Icon className='w-4 h-4' name={'cross'} />
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default CatalogueFilterDefault;
