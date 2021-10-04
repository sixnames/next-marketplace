import FilterCheckbox from 'components/FilterCheckbox';
import FilterCheckboxGroup from 'components/FilterCheckboxGroup';
import { BrandOptionsModalInterface } from 'components/Modal/BrandOptionsModal';
import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import { OptionsModalOptionInterface } from 'components/Modal/OptionsModal';
import {
  CATALOGUE_BRAND_KEY,
  CATALOGUE_CATEGORY_KEY,
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  CATALOGUE_PRICE_KEY,
  FILTER_SEPARATOR,
} from 'config/common';
import { BRAND_OPTIONS_MODAL, CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import {
  CatalogueFilterAttributePropsInterface,
  CatalogueFilterInterface,
} from 'layout/catalogue/CatalogueFilter';
import { alwaysArray } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
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
  basePath,
}) => {
  const router = useRouter();
  const { query } = router;
  const { showModal, hideModal } = useAppContext();
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;

  const { name, clearSlug, options, isSelected, metric, slug, totalOptionsCount } = attribute;
  const isCategory = slug === CATALOGUE_CATEGORY_KEY;
  const isBrand = slug === CATALOGUE_BRAND_KEY;
  const isPrice = slug === CATALOGUE_PRICE_KEY;
  const hasMoreOptions =
    (totalOptionsCount > maxVisibleOptions || isBrand || isCategory) && !isPrice;

  const navigateFromModal = React.useCallback(
    (selectedOptions: OptionsModalOptionInterface[]) => {
      hideModal();
      const selectedOptionsSlugs = selectedOptions.map(({ slug }) => {
        return `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
      });
      const nextParamsList = [...alwaysArray(query.filters), ...selectedOptionsSlugs];
      const nextParams = nextParamsList.join('/');
      router.push(`${basePath}/${nextParams}`).catch((e) => {
        console.log(e);
      });
    },
    [attribute.slug, basePath, hideModal, query.filters, router],
  );

  const showMoreHandler = () => {
    // simple attribute options modal
    if (hasMoreOptions) {
      showModal<CatalogueAdditionalOptionsModalInterface>({
        variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
        props: {
          basePath,
          rubricSlug,
          attributeSlug: attribute.slug,
          notShowAsAlphabet: attribute.notShowAsAlphabet,
          title: attribute.name,
          companyId,
          isSearchResult,
        },
      });
    }

    // brand attribute options modal
    if (isBrand) {
      showModal<BrandOptionsModalInterface>({
        variant: BRAND_OPTIONS_MODAL,
        props: {
          onSubmit: navigateFromModal,
        },
      });
    }
  };

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
      showMoreHandler={hasMoreOptions ? showMoreHandler : null}
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
  isSearchResult,
  clearSlug,
  basePath,
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
              <Link href={clearSlug} className='font-medium text-theme' onClick={hideFilterHandler}>
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
              basePath={basePath}
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
