import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import { CATALOGUE_FILTER_VISIBLE_OPTIONS, PRICE_ATTRIBUTE_SLUG } from 'config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import FilterLink from 'components/Link/FilterLink';
import Link from 'components/Link/Link';
import { useConfigContext } from 'context/configContext';
import Icon from 'components/Icon';
import { useAppContext } from 'context/appContext';
import 'rc-slider/assets/index.css';

interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
  companyId?: string;
  rubricSlug: string;
  onClick: () => void;
  isSearchResult?: boolean;
  attributeIndex: number;
}

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
  const { getSiteConfigSingleValue } = useConfigContext();
  const maxVisibleOptionsString = getSiteConfigSingleValue('catalogueFilterVisibleOptionsCount');
  const maxVisibleOptions = maxVisibleOptionsString
    ? noNaN(maxVisibleOptionsString)
    : noNaN(CATALOGUE_FILTER_VISIBLE_OPTIONS);

  const { name, clearSlug, options, isSelected, metric, slug } = attribute;
  const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
  const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;

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
        {options.map((option, optionIndex) => {
          const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
          return (
            <FilterLink
              onClick={onClick}
              option={option}
              key={option.slug}
              testId={testId}
              postfix={postfix}
            />
          );
        })}
      </div>

      {options.length === maxVisibleOptions && !isPrice ? (
        <div
          className='uppercase cursor-pointer hover:text-theme mt-6'
          onClick={() => {
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
          }}
        >
          Показать еще
        </div>
      ) : null}
    </div>
  );
};

interface CatalogueFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  catalogueCounterString: string;
  rubricSlug: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
  companyId?: string;
  route: string;
  isSearchResult?: boolean;
}

const CatalogueFilter: React.FC<CatalogueFilterInterface> = ({
  attributes,
  selectedAttributes,
  rubricSlug,
  catalogueCounterString,
  hideFilterHandler,
  isFilterVisible,
  companyId,
  route,
  isSearchResult,
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
                href={`${route}/${rubricSlug}`}
                className='font-medium text-theme'
                onClick={hideFilterHandler}
              >
                Очистить все
              </Link>
            </div>

            <div className='flex flex-wrap gap-2'>
              {selectedAttributes.map((attribute) => {
                const { metric, slug } = attribute;
                const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
                const postfix = isPrice ? ` ${currency}` : metric ? ` ${metric}` : null;
                return attribute.options.map((option) => {
                  const key = `${option.slug}`;
                  return (
                    <FilterLink
                      withCross
                      onClick={hideFilterHandler}
                      option={option}
                      key={key}
                      testId={key}
                      postfix={postfix}
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

export default CatalogueFilter;
