import Icon from 'components/Icon';
import { CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE, DEFAULT_LAYOUT } from 'config/constantSelects';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';

export interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
  companyId?: string;
  rubricSlug: string;
  onClick: () => void;
  isSearchResult?: boolean;
  attributeIndex: number;
  basePath: string;
  urlPrefix?: string;
}

export interface FilterBaseInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  rubricSlug: string;
  clearSlug: string;
  companyId?: string;
  isSearchResult?: boolean;
  basePath: string;
  excludedParams?: string[] | null;
}

export interface CatalogueFilterInterface extends FilterBaseInterface {
  catalogueCounterString: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
  urlPrefix?: string;
}

interface CatalogueFilterProviderInterface extends CatalogueFilterInterface {
  filterLayoutVariant: string;
}

const CatalogueFilterDefault = dynamic(() => import('layout/catalogue/CatalogueFilterDefault'));
const CatalogueFilterCheckboxTree = dynamic(
  () => import('layout/catalogue/CatalogueFilterCheckboxTree'),
);

const CatalogueFilter: React.FC<CatalogueFilterProviderInterface> = (props) => {
  const { filterLayoutVariant, isFilterVisible, catalogueCounterString, hideFilterHandler } = props;
  const layoutVariant = filterLayoutVariant || DEFAULT_LAYOUT;

  return (
    <div
      className={`lg:col-span-2 inset-0 fixed z-[140] lg:z-10 bg-primary lg:relative h-[var(--fullHeight,100vh)] lg:h-auto ${
        isFilterVisible ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className='catalogue__filter-scroll absolute inset-0 h-full lg:sticky overflow-x-hidden overflow-y-auto lg:h-[calc(100vh-80px)] lg:top-20 relative w-full px-inner-block-horizontal-padding py-inner-block-vertical-padding lg:p-0'>
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

        <div className='pb-16'>
          {layoutVariant === CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE ? (
            <CatalogueFilterCheckboxTree {...props} />
          ) : (
            <CatalogueFilterDefault {...props} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogueFilter;
