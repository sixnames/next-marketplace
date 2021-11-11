import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import WpTooltip from 'components/WpTooltip';
import { ProductCategoryInterface, ProductInterface } from 'db/uiInterfaces';
import {
  useUpdateProductCategory,
  useUpdateProductCategoryVisibility,
} from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import * as React from 'react';

interface ConsoleRubricProductCategoriesInterface {
  product: ProductInterface;
  categoriesTree: ProductCategoryInterface[];
}

const ConsoleRubricProductCategories: React.FC<ConsoleRubricProductCategoriesInterface> = ({
  product,
  categoriesTree,
}) => {
  const { showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCategoryMutation] = useUpdateProductCategory();
  const [updateProductCategoryVisibilityMutation] = useUpdateProductCategoryVisibility();

  const renderCategories = React.useCallback(
    (category: ProductCategoryInterface) => {
      const { name, categories } = category;
      const hasSelectedChildren = categories.some(({ selected }) => selected);
      const isViewChecked = product.titleCategoriesSlugs.includes(category.slug);

      return (
        <div>
          <div className='cms-option flex gap-4 items-center'>
            <div>
              <Checkbox
                disabled={hasSelectedChildren}
                testId={`${category.name}`}
                checked={category.selected}
                value={category._id}
                name={`${category._id}`}
                onChange={() => {
                  showLoading();
                  updateProductCategoryMutation({
                    productId: `${product._id}`,
                    categoryId: `${category._id}`,
                  }).catch(console.log);
                }}
              />
            </div>
            <div className='font-medium' data-cy={`category-${name}`}>
              {name}
            </div>
            <WpTooltip
              title={isViewChecked ? 'Показывать в заголовке товара' : 'Категория не выбрана'}
            >
              <div>
                <Checkbox
                  disabled={!category.selected}
                  testId={`${category.name}-view`}
                  checked={isViewChecked}
                  value={`${category._id}-view`}
                  name={`${category._id}-view`}
                  onChange={() => {
                    showLoading();
                    updateProductCategoryVisibilityMutation({
                      productId: `${product._id}`,
                      categoryId: `${category._id}`,
                    }).catch(console.log);
                  }}
                />
              </div>
            </WpTooltip>
          </div>
          {categories && categories.length > 0 ? (
            <div className='ml-4'>
              {categories.map((category) => (
                <div className='mt-4' key={`${category._id}`}>
                  {renderCategories(category)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    },
    [
      product._id,
      product.titleCategoriesSlugs,
      showLoading,
      updateProductCategoryMutation,
      updateProductCategoryVisibilityMutation,
    ],
  );

  return (
    <Inner testId={'product-categories-list'}>
      {!categoriesTree || categoriesTree.length < 1 ? (
        <RequestError message={'Список пуст'} />
      ) : (
        <div className='border-t border-border-300'>
          {categoriesTree.map((category) => (
            <div
              className='border-b border-border-300 py-6 px-inner-block-horizontal-padding'
              key={`${category._id}`}
            >
              {renderCategories(category)}
            </div>
          ))}
        </div>
      )}
    </Inner>
  );
};

export default ConsoleRubricProductCategories;