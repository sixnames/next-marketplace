import Icon from 'components/Icon';
import Link from 'components/Link/Link';
import { CATALOGUE_FILTER_VISIBLE_OPTIONS, FILTER_PRICE_KEY } from 'config/common';
import { useConfigContext } from 'context/configContext';
import {
  CatalogueFilterAttributeInterface,
  CatalogueFilterAttributeOptionInterface,
} from 'db/uiInterfaces';
import { CatalogueFilterInterface } from 'layout/catalogue/CatalogueFilter';
import * as React from 'react';

interface CheckBoxFilterAttributeInterface {
  attribute: CatalogueFilterAttributeInterface;
  onClick?: () => void | null;
  attributeIndex: number;
}

const CheckBoxFilterAttribute: React.FC<CheckBoxFilterAttributeInterface> = ({
  attribute,
  onClick,
  attributeIndex,
}) => {
  const { configs } = useConfigContext();
  const maxVisibleOptions =
    configs.catalogueFilterVisibleOptionsCount || CATALOGUE_FILTER_VISIBLE_OPTIONS;
  const isPrice = attribute.slug === FILTER_PRICE_KEY;

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
    const { visibleOptions } = getFilterOptions(option.options);
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

        {visibleOptions.length > 0 ? (
          <div className='pl-5'>
            {visibleOptions.map((option, optionIndex) => {
              return renderOption(option, `${testId}-${optionIndex}`);
            })}
          </div>
        ) : null}
      </div>
    );
  }

  // render attribute
  const { visibleOptions } = getFilterOptions(attribute.options);
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
    </div>
  );
};

interface CheckBoxFilterInterface extends CatalogueFilterInterface {
  filterListClassName?: string;
  onClick?: () => void | null;
}

const CheckBoxFilter: React.FC<CheckBoxFilterInterface> = ({
  attributes,
  selectedAttributes,
  filterListClassName,
  onClick,
}) => {
  return (
    <div>
      {/*selected attributes*/}
      {selectedAttributes.length > 0 ? <div>{selectedAttributes.length}</div> : null}

      {/*filter*/}
      <div className={filterListClassName}>
        {attributes.map((attribute, attributeIndex) => {
          return (
            <CheckBoxFilterAttribute
              attribute={attribute}
              onClick={onClick}
              attributeIndex={attributeIndex}
              key={`${attribute._id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CheckBoxFilter;
