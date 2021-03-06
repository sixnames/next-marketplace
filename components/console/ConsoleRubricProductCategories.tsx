import { ProductCategoryInterface, ProductSummaryInterface } from 'db/uiInterfaces';
import {
  useUpdateProductCategory,
  useUpdateProductCategoryVisibility,
} from 'hooks/mutations/useProductMutations';
import { alwaysString } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpCheckbox from '../FormElements/Checkbox/WpCheckbox';
import Inner from '../Inner';
import RequestError from '../RequestError';
import WpTooltip from '../WpTooltip';

interface ConsoleRubricProductCategoriesInterface {
  product: ProductSummaryInterface;
  categoriesTree: ProductCategoryInterface[];
}

const ConsoleRubricProductCategories: React.FC<ConsoleRubricProductCategoriesInterface> = ({
  product,
  categoriesTree,
}) => {
  const router = useRouter();
  const { showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductCategoryMutation] = useUpdateProductCategory();
  const [updateProductCategoryVisibilityMutation] = useUpdateProductCategoryVisibility();

  const renderCategories = React.useCallback(
    (category: ProductCategoryInterface) => {
      const { name, categories } = category;
      const hasSelectedChildren = categories.some(({ selected }) => selected);
      const isViewChecked = product.titleCategorySlugs.includes(category.slug);

      return (
        <div>
          <div className='cms-option flex items-center gap-4'>
            <div>
              <WpCheckbox
                disabled={hasSelectedChildren}
                testId={`${category.name}`}
                checked={category.selected}
                value={category._id}
                name={`${category._id}`}
                onChange={() => {
                  showLoading();
                  updateProductCategoryMutation({
                    taskId: alwaysString(router.query.taskId),
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
              title={isViewChecked ? '???????????????????? ?? ?????????????????? ????????????' : '?????????????????? ???? ??????????????'}
            >
              <div>
                <WpCheckbox
                  disabled={!category.selected}
                  testId={`${category.name}-view`}
                  checked={isViewChecked}
                  value={`${category._id}-view`}
                  name={`${category._id}-view`}
                  onChange={() => {
                    showLoading();
                    updateProductCategoryVisibilityMutation({
                      taskId: alwaysString(router.query.taskId),
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
      product.titleCategorySlugs,
      router.query.taskId,
      showLoading,
      updateProductCategoryMutation,
      updateProductCategoryVisibilityMutation,
    ],
  );

  return (
    <Inner testId={'product-categories-list'}>
      {!categoriesTree || categoriesTree.length < 1 ? (
        <RequestError message={'???????????? ????????'} />
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
