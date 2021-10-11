import CheckBoxFilter from 'components/CheckBoxFilter';
import { CatalogueFilterInterface } from 'layout/catalogue/CatalogueFilter';
import * as React from 'react';
import Icon from 'components/Icon';

const CatalogueFilterCheckboxTree: React.FC<CatalogueFilterInterface> = (props) => {
  const { isFilterVisible, catalogueCounterString, hideFilterHandler } = props;

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

        <CheckBoxFilter {...props} onClick={hideFilterHandler} />
      </div>
    </div>
  );
};

export default CatalogueFilterCheckboxTree;
