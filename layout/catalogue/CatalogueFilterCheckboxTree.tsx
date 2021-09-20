import FilterCheckbox from 'components/FilterCheckbox';
import FilterCheckboxGroup from 'components/FilterCheckboxGroup';
import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import { CATALOGUE_FILTER_VISIBLE_OPTIONS, CATALOGUE_PRICE_KEY } from 'config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import {
  CatalogueFilterAttributePropsInterface,
  CatalogueFilterInterface,
} from 'layout/catalogue/CatalogueFilter';
import * as React from 'react';
import Link from 'components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from 'components/Icon';
import { useAppContext } from 'context/appContext';
import 'rc-slider/assets/index.css';

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
  companyId,
  rubricSlug,
  onClick,
  isSearchResult,
  attributeIndex,
}) => {
  const { showModal } = useAppContext();
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;

  const { name, clearSlug, options, isSelected, metric, slug, totalOptionsCount } = attribute;
  const isPrice = slug === CATALOGUE_PRICE_KEY;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;
  const testId = `catalogue-option-${attributeIndex}`;
  return (
    <FilterCheckboxGroup
      testId={testId}
      isSelected={isSelected}
      clearSlug={clearSlug}
      label={name}
      checkboxItems={options}
      attributeSlug={slug}
      postfix={postfix}
      onClick={onClick}
      showMoreHandler={
        totalOptionsCount > maxVisibleOptions && !isPrice
          ? () => {
              showModal<CatalogueAdditionalOptionsModalInterface>({
                variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
                props: {
                  rubricSlug,
                  attributeSlug: attribute.slug,
                  notShowAsAlphabet: attribute.notShowAsAlphabet,
                  title: attribute.name,
                  companyId,
                  isSearchResult,
                },
              });
            }
          : null
      }
    />
  );
};

const CatalogueFilterCheckboxTree: React.FC<CatalogueFilterInterface> = ({
  attributes,
  selectedAttributes,
  rubricSlug,
  catalogueCounterString,
  hideFilterHandler,
  isFilterVisible,
  companyId,
  route,
  isSearchResult,
  clearSlug,
}) => {
  const { currency } = useLocaleContext();

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

        {selectedAttributes.length > 0 ? (
          <div className='mb-12'>
            <div className='flex items-baseline justify-between mb-4'>
              <span className='text-lg font-bold'>Выбранные</span>
              <Link
                href={`${route}/${clearSlug}`}
                className='font-medium text-theme'
                onClick={hideFilterHandler}
              >
                Сбросить фильтр
              </Link>
            </div>

            <div>
              {selectedAttributes.map((attribute) => {
                const { metric, slug } = attribute;
                const isPrice = slug === CATALOGUE_PRICE_KEY;
                const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;
                return attribute.options.map((option) => {
                  const key = `${option.slug}`;
                  return (
                    <FilterCheckbox
                      postfix={postfix}
                      option={option}
                      key={key}
                      onClick={hideFilterHandler}
                      testId={key}
                      hidden={({ isSelected }) => !isSelected}
                    />
                  );
                });
              })}
            </div>
          </div>
        ) : null}

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
            />
          );
        })}
      </div>
    </div>
  );
};

export default CatalogueFilterCheckboxTree;
