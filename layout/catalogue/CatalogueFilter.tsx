import dynamic from 'next/dynamic';
import * as React from 'react';
import WpIcon from '../../components/WpIcon';
import {
  CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE,
  DEFAULT_LAYOUT,
} from '../../config/constantSelects';
import { CatalogueFilterAttributeInterface } from '../../db/uiInterfaces';

export interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
  companyId?: string;
  rubricSlug: string;
  onClick: () => void;
  isSearchResult?: boolean;
  attributeIndex: number;
  basePath: string;
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
}

interface CatalogueFilterProviderInterface extends CatalogueFilterInterface {
  filterLayoutVariant: string;
}

const CatalogueFilterDefault = dynamic(() => import('./CatalogueFilterDefault'));
const CatalogueFilterCheckboxTree = dynamic(() => import('./CatalogueFilterCheckboxTree'));

const CatalogueFilter: React.FC<CatalogueFilterProviderInterface> = (props) => {
  const { filterLayoutVariant, isFilterVisible, catalogueCounterString, hideFilterHandler } = props;
  const layoutVariant = filterLayoutVariant || DEFAULT_LAYOUT;

  return (
    <div
      className={`fixed inset-0 z-[140] h-[var(--fullHeight,100vh)] bg-primary lg:relative lg:z-10 lg:col-span-2 lg:h-auto ${
        isFilterVisible ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className='absolute relative inset-0 h-full w-full overflow-y-auto overflow-x-hidden px-inner-block-horizontal-padding py-inner-block-vertical-padding lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:p-0'>
        <div className='lg:pr-[15px]'>
          <div className='mb-8 flex hidden h-[var(--catalogueVieButtonSize)] items-center text-secondary-text lg:block'>
            {catalogueCounterString}
          </div>

          {/* Mobile title */}
          <div className='mb-4 flex min-h-[2rem] items-center justify-end text-lg font-medium lg:hidden'>
            <div className='w-[calc(100%-(var(--formInputHeightSmall)*2))] truncate text-center'>
              Фильтр
            </div>
            <div
              className='flex h-[var(--formInputHeightSmall)] w-[var(--formInputHeightSmall)] items-center justify-center text-secondary-text'
              onClick={hideFilterHandler}
            >
              <WpIcon className='h-4 w-4' name={'cross'} />
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
    </div>
  );
};

export default CatalogueFilter;
