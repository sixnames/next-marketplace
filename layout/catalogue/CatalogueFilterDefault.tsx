import { useRouter } from 'next/router';
import * as React from 'react';
import { getFilterOptions } from '../../components/CheckBoxFilter';
import FilterSelectedAttributes from '../../components/FilterSelectedAttributes';
import FilterLink from '../../components/Link/FilterLink';
import { CatalogueAdditionalOptionsModalInterface } from '../../components/Modal/CatalogueAdditionalOptionsModal';
import WpAccordion from '../../components/WpAccordion';
import { CATALOGUE_FILTER_VISIBLE_OPTIONS } from '../../config/common';
import { CATALOGUE_ADDITIONAL_OPTIONS_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useConfigContext } from '../../context/configContext';
import {
  CatalogueFilterAttributePropsInterface,
  CatalogueFilterInterface,
} from './CatalogueFilter';

const CatalogueFilterAttributeOptions: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
}) => {
  const { configs } = useConfigContext();
  const { showModal } = useAppContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;
  const { visibleOptions, hasMoreOptions } = getFilterOptions(maxVisibleOptions, attribute.options);

  return (
    <div>
      <div className='flex flex-wrap gap-2'>
        {visibleOptions.map((option, optionIndex) => {
          const testId = `catalogue-option-${attributeIndex}-${optionIndex}`;
          return (
            <FilterLink
              showAsLink={attribute.showAsLinkInFilter}
              onClick={onClick}
              option={option}
              key={option.slug}
              testId={testId}
            />
          );
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
                basePath: basePath,
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

const CatalogueFilterAttribute: React.FC<CatalogueFilterAttributePropsInterface> = ({
  attribute,
  onClick,
  attributeIndex,
  basePath,
  rubricSlug,
}) => {
  const router = useRouter();
  const { clearSlug, isSelected } = attribute;

  if (attribute.showAsAccordionInFilter) {
    return (
      <div className='mb-12'>
        <WpAccordion
          noTitleStyle
          titleClassName='font-medium text-lg mb-2'
          isOpen={attribute.isSelected}
          title={attribute.name}
          titleRight={
            attribute.isSelected && attribute.clearSlug ? (
              <div
                className='ml-4 font-normal text-theme cursor-pointer hover:underline'
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
          <CatalogueFilterAttributeOptions
            onClick={onClick}
            attributeIndex={attributeIndex}
            attribute={attribute}
            basePath={basePath}
            rubricSlug={rubricSlug}
          />
        </WpAccordion>
      </div>
    );
  }

  return (
    <div className='mb-12'>
      <div className='flex items-baseline justify-between mb-4'>
        <span className='text-lg font-bold'>{attribute.name}</span>
        {isSelected ? (
          <div
            className='ml-4 font-medium text-theme cursor-pointer hover:underline'
            onClick={() => {
              router
                .push(`${clearSlug}`)
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

      <CatalogueFilterAttributeOptions
        onClick={onClick}
        attributeIndex={attributeIndex}
        attribute={attribute}
        basePath={basePath}
        rubricSlug={rubricSlug}
      />
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
