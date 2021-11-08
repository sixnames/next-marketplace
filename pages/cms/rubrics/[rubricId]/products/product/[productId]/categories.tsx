import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import WpTooltip from 'components/WpTooltip';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { COL_CATEGORIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, ProductCategoryInterface, ProductInterface } from 'db/uiInterfaces';
import {
  useUpdateProductCategory,
  useUpdateProductCategoryVisibility,
} from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getTreeFromList } from 'lib/optionsUtils';
import { getCmsProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductCategoriesInterface {
  product: ProductInterface;
  categoriesTree: ProductCategoryInterface[];
}

const ProductCategories: React.FC<ProductCategoriesInterface> = ({ product, categoriesTree }) => {
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${product.rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/${product.rubric?._id}`,
      },
      {
        name: `${product.cardTitle}`,
        href: `${ROUTE_CMS}/rubrics/${product.rubric?._id}/products/product/${product._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout product={product} breadcrumbs={breadcrumbs}>
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
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductCategoriesInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, categoriesTree }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductCategories product={product} categoriesTree={categoriesTree} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { rubric, product } = payload;

  // Get rubric categories
  const initialCategories = await categoriesCollection
    .find({
      rubricId: rubric._id,
    })
    .toArray();
  const categories: ProductCategoryInterface[] = initialCategories.map((category) => {
    return {
      ...category,
      categories: [],
      selected: product.selectedOptionsSlugs.some((slug) => slug === category.slug),
    };
  });

  const categoriesTree = getTreeFromList<ProductCategoryInterface>({
    list: categories,
    childrenFieldName: 'categories',
  });

  return {
    props: {
      ...props,
      product: castDbData(product),
      categoriesTree: castDbData(categoriesTree),
    },
  };
};

export default Product;
