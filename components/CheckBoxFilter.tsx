import FilterSelectedAttributes from 'components/FilterSelectedAttributes';
import Icon from 'components/Icon';
import Link from 'components/Link/Link';
import { CatalogueAdditionalOptionsModalInterface } from 'components/Modal/CatalogueAdditionalOptionsModal';
import {
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
  FILTER_PRICE_KEY,
} from 'config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import { FilterBaseInterface } from 'layout/catalogue/CatalogueFilter';
import * as React from 'react';

interface CheckBoxFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  onClick?: () => void | null;
  attributeIndex: number;
  basePath: string;
  excludedParams?: string[] | null;
}

const CheckBoxFilterAttribute: React.FC<CheckBoxFilterAttributeInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
  excludedParams,
}) => {
  const { showModal } = useAppContext();
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;
  const isPrice = attribute.slug === FILTER_PRICE_KEY;
  const isBrand = attribute.slug === FILTER_BRAND_KEY;

  if (!attribute.options || attribute.options.length < 1) {
    return null;
  }

  function getFilterOptions(options?: CatalogueFilterAttributeOptionInterface[] | null) {
    if (!options) {
      return {
        maxVisibleOptions,
        visibleOptions: [],
        hiddenOptions: [],
        hasMoreOptions: false,
      };
    }
    const hiddenOptions = options.slice(maxVisibleOptions);

    if (isPrice) {
      return {
        maxVisibleOptions,
        visibleOptions: options,
        hiddenOptions: [],
        hasMoreOptions: false,
      };
    }

    return {
      maxVisibleOptions,
      visibleOptions: options.slice(0, maxVisibleOptions),
      hiddenOptions,
      hasMoreOptions: hiddenOptions.length > 0,
    };
  }

  function renderOption(option: CatalogueFilterAttributeOptionInterface, testId: string) {
    const { visibleOptions, hasMoreOptions } = getFilterOptions(option.options);
    const { nextSlug, isSelected, name } = option;

    return (
      <div key={`${option._id}`}>
        <Link
          href={nextSlug}
          onClick={onClick}
          testId={testId}
          className='flex items-center gap-2 w-full min-h-[2.5rem] cursor-pointer text-primary-text hover:text-theme hover:no-underline'
        >
          <span className='relative text-theme w-[18px] h-[18px] border border-border-300 rounded border-1 bg-secondary overflow-hidden text-theme flex-shrink-0'>
            {isSelected ? (
              <Icon
                className='absolute w-[14px] h-[14px] top-[1px] left-[1px] z-10'
                name={'check'}
              />
            ) : null}
          </span>

          <span className=''>
            <span>{name}</span>
          </span>
        </Link>

        {isSelected && visibleOptions.length > 0 ? (
          <div className='pl-5'>
            <div>
              {visibleOptions.map((option, optionIndex) => {
                return renderOption(option, `${testId}-${optionIndex}`);
              })}
            </div>

            {hasMoreOptions ? (
              <div
                className='uppercase cursor-pointer hover:text-theme mt-2 mb-4'
                onClick={() => {
                  showModal<CatalogueAdditionalOptionsModalInterface>({
                    variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
                    props: {
                      attributeSlug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attribute.slug,
                      notShowAsAlphabet: attribute.notShowAsAlphabet,
                      title: isBrand ? 'Линейка бренда' : attribute.name,
                      basePath,
                      options: option.options,
                      excludedParams,
                    },
                  });
                }}
              >
                Показать еще
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  // render attribute
  const { visibleOptions, hasMoreOptions } = getFilterOptions(attribute.options);
  return (
    <div className={`mb-8`}>
      {/*attribute name*/}
      {attribute.name ? (
        <div className='flex items-baseline mb-2 justify-between'>
          <span className={`font-medium text-lg`}>{attribute.name}</span>
          {attribute.isSelected && attribute.clearSlug ? (
            <Link onClick={onClick} href={attribute.clearSlug} className={`ml-4`}>
              Очистить
            </Link>
          ) : null}
        </div>
      ) : null}

      {/*options*/}
      <div>
        {visibleOptions.map((option, optionIndex) => {
          return renderOption(option, `${attributeIndex}-${optionIndex}`);
        })}
      </div>

      {hasMoreOptions ? (
        <div
          className='uppercase cursor-pointer hover:text-theme mt-4'
          onClick={() => {
            showModal<CatalogueAdditionalOptionsModalInterface>({
              variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
              props: {
                attributeSlug: attribute.slug,
                notShowAsAlphabet: attribute.notShowAsAlphabet,
                title: attribute.name,
                basePath,
                options: attribute.options,
                excludedParams,
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

export interface CheckBoxFilterInterface extends FilterBaseInterface {
  filterListClassName?: string;
  onClick?: () => void | null;
}

const CheckBoxFilter: React.FC<CheckBoxFilterInterface> = ({
  attributes,
  selectedAttributes,
  filterListClassName,
  onClick,
  basePath,
  clearSlug,
  excludedParams,
}) => {
  return (
    <div>
      {/*selected attributes*/}
      <FilterSelectedAttributes
        onClick={onClick}
        clearSlug={clearSlug}
        selectedAttributes={selectedAttributes}
      />

      {/*filter*/}
      <div className={filterListClassName}>
        {attributes.map((attribute, attributeIndex) => {
          return (
            <CheckBoxFilterAttribute
              basePath={basePath}
              attribute={attribute}
              onClick={onClick}
              attributeIndex={attributeIndex}
              key={`${attribute._id}`}
              excludedParams={excludedParams}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CheckBoxFilter;
