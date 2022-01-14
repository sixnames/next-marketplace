import { useRouter } from 'next/router';
import * as React from 'react';
import {
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
} from '../config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from '../config/modalVariants';
import { useAppContext } from '../context/appContext';
import { useConfigContext } from '../context/configContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from '../db/uiInterfaces';
import { FilterBaseInterface } from '../layout/catalogue/CatalogueFilter';
import FilterSelectedAttributes from './FilterSelectedAttributes';
import WpLink from './Link/WpLink';
import { CatalogueAdditionalOptionsModalInterface } from './Modal/CatalogueAdditionalOptionsModal';
import WpAccordion from './WpAccordion';
import WpIcon from './WpIcon';

export function getFilterOptions(
  maxVisibleOptions: number,
  options?: CatalogueFilterAttributeOptionInterface[] | null,
) {
  if (!options) {
    return {
      maxVisibleOptions,
      visibleOptions: [],
      hiddenOptions: [],
      hasMoreOptions: false,
    };
  }
  const hiddenOptions = options.slice(maxVisibleOptions);

  return {
    maxVisibleOptions,
    visibleOptions: options.slice(0, maxVisibleOptions),
    hiddenOptions,
    hasMoreOptions: hiddenOptions.length > 0,
  };
}

interface CheckBoxFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  onClick?: () => void | null;
  attributeIndex: number;
  basePath: string;
  excludedParams?: string[] | null;
}

const CheckBoxFilterAttributeOptions: React.FC<CheckBoxFilterAttributeInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
  excludedParams,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const isBrand = attribute.slug === FILTER_BRAND_KEY;
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;

  const { visibleOptions, hasMoreOptions } = getFilterOptions(maxVisibleOptions, attribute.options);

  function renderOption(option: CatalogueFilterAttributeOptionInterface, testId: string) {
    const { visibleOptions, hasMoreOptions } = getFilterOptions(maxVisibleOptions, option.options);
    const { nextSlug, isSelected, name } = option;

    return (
      <div key={`${option._id}`}>
        {attribute.showAsLinkInFilter ? (
          <WpLink
            href={`${nextSlug}`}
            onClick={onClick}
            testId={testId}
            className='flex items-start gap-2 w-full min-h-[1.5rem] mb-4 cursor-pointer text-primary-text hover:text-theme hover:no-underline'
          >
            <span className='relative text-theme w-[18px] h-[18px] border border-border-300 rounded border-1 bg-secondary overflow-hidden text-theme flex-shrink-0'>
              {isSelected ? (
                <WpIcon
                  className='absolute w-[14px] h-[14px] top-[1px] left-[1px] z-10'
                  name={'check'}
                />
              ) : null}
            </span>

            <span className=''>
              <span>{name}</span>
            </span>
          </WpLink>
        ) : (
          <div
            data-cy={testId}
            className='flex items-start gap-2 w-full min-h-[1.5rem] mb-4 cursor-pointer text-primary-text hover:text-theme hover:no-underline transition-all'
            onClick={() => {
              router
                .push(`${nextSlug}`)
                .then(() => {
                  if (onClick) {
                    onClick();
                  }
                })
                .catch(console.log);
            }}
          >
            <span className='relative text-theme w-[18px] h-[18px] border border-border-300 rounded border-1 bg-secondary overflow-hidden text-theme flex-shrink-0'>
              {isSelected ? (
                <WpIcon
                  className='absolute w-[14px] h-[14px] top-[1px] left-[1px] z-10'
                  name={'check'}
                />
              ) : null}
            </span>

            <span className=''>
              <span>{name}</span>
            </span>
          </div>
        )}

        {isSelected && visibleOptions.length > 0 ? (
          <div className='pl-5'>
            <div>
              {visibleOptions.map((option, optionIndex) => {
                return renderOption(option, `${testId}-${optionIndex}`);
              })}
            </div>

            {hasMoreOptions ? (
              <div
                className='uppercase cursor-pointer text-theme mt-2 mb-4'
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

  return (
    <div>
      <div>
        {visibleOptions.map((option, optionIndex) => {
          return renderOption(option, `${attributeIndex}-${optionIndex}`);
        })}
      </div>

      {hasMoreOptions ? (
        <div
          className='uppercase cursor-pointer text-theme mt-4'
          onClick={() => {
            showModal<CatalogueAdditionalOptionsModalInterface>({
              variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
              props: {
                attributeSlug: attribute.slug,
                notShowAsAlphabet: attribute.notShowAsAlphabet,
                optionVariant: 'radio',
                title: attribute.name,
                basePath: `${basePath}`,
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

const CheckBoxFilterAttribute: React.FC<CheckBoxFilterAttributeInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
  excludedParams,
}) => {
  const router = useRouter();

  if (!attribute.options || attribute.options.length < 1) {
    return null;
  }

  if (attribute.showAsAccordionInFilter) {
    return (
      <div className='mb-8'>
        <WpAccordion
          noTitleStyle
          titleClassName='font-medium text-lg mb-2'
          isOpen={attribute.isSelected}
          title={attribute.name}
          titleRight={
            attribute.isSelected && attribute.clearSlug ? (
              <div
                className='ml-4 text-theme font-normal cursor-pointer hover:underline'
                onClick={() => {
                  router
                    .push(`${attribute.clearSlug}`)
                    .then(() => {
                      if (onClick) {
                        onClick();
                      }
                    })
                    .catch(console.log);
                }}
              >
                Сбросить
              </div>
            ) : null
          }
        >
          {/*options*/}
          <CheckBoxFilterAttributeOptions
            basePath={basePath}
            attribute={attribute}
            attributeIndex={attributeIndex}
            excludedParams={excludedParams}
            onClick={onClick}
          />
        </WpAccordion>
      </div>
    );
  }

  return (
    <div className={`mb-8`}>
      {/*attribute name*/}
      {attribute.name ? (
        <div className='flex items-baseline mb-2 justify-between'>
          <span className={`font-medium text-lg`}>{attribute.name}</span>
          {attribute.isSelected && attribute.clearSlug ? (
            <div
              className='ml-4 text-theme cursor-pointer hover:underline'
              onClick={() => {
                router
                  .push(`${attribute.clearSlug}`)
                  .then(() => {
                    if (onClick) {
                      onClick();
                    }
                  })
                  .catch(console.log);
              }}
            >
              Сбросить
            </div>
          ) : null}
        </div>
      ) : null}

      {/*options*/}
      <CheckBoxFilterAttributeOptions
        basePath={basePath}
        attribute={attribute}
        attributeIndex={attributeIndex}
        excludedParams={excludedParams}
        onClick={onClick}
      />
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
