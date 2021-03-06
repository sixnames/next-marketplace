import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import {
  CATALOGUE_FILTER_VISIBLE_OPTIONS,
  FILTER_BRAND_COLLECTION_KEY,
  FILTER_BRAND_KEY,
} from 'lib/config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from 'lib/config/modalVariants';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useAppContext } from './context/appContext';
import { useConfigContext } from './context/configContext';
import FilterSelectedAttributes from './FilterSelectedAttributes';
import { FilterBaseInterface } from './layout/catalogue/CatalogueFilter';
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
            className='mb-4 flex min-h-[1.5rem] w-full cursor-pointer items-start gap-2 text-primary-text hover:text-theme hover:no-underline'
          >
            <span className='border-1 relative h-[18px] w-[18px] flex-shrink-0 overflow-hidden rounded border border-border-300 bg-secondary text-theme text-theme'>
              {isSelected ? (
                <WpIcon
                  className='absolute top-[1px] left-[1px] z-10 h-[14px] w-[14px]'
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
            className='mb-4 flex min-h-[1.5rem] w-full cursor-pointer items-start gap-2 text-primary-text transition-all hover:text-theme hover:no-underline'
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
            <span className='border-1 relative h-[18px] w-[18px] flex-shrink-0 overflow-hidden rounded border border-border-300 bg-secondary text-theme text-theme'>
              {isSelected ? (
                <WpIcon
                  className='absolute top-[1px] left-[1px] z-10 h-[14px] w-[14px]'
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
                className='mt-2 mb-4 cursor-pointer uppercase text-theme'
                onClick={() => {
                  showModal<CatalogueAdditionalOptionsModalInterface>({
                    variant: CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
                    props: {
                      attributeSlug: isBrand ? FILTER_BRAND_COLLECTION_KEY : attribute.slug,
                      notShowAsAlphabet: attribute.notShowAsAlphabet,
                      title: isBrand ? '?????????????? ????????????' : attribute.name,
                      basePath,
                      options: option.options,
                      excludedParams,
                    },
                  });
                }}
              >
                ???????????????? ??????
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
          className='mt-4 cursor-pointer uppercase text-theme'
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
          ???????????????? ??????
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
                className='ml-4 cursor-pointer font-normal text-theme hover:underline'
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
                ????????????????
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
        <div className='mb-2 flex items-baseline justify-between'>
          <span className={`text-lg font-medium`}>{attribute.name}</span>
          {attribute.isSelected && attribute.clearSlug ? (
            <div
              className='ml-4 cursor-pointer text-theme hover:underline'
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
              ????????????????
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
