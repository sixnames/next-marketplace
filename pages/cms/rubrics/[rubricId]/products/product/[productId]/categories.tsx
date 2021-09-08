import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Tooltip from 'components/Tooltip';
import { ROUTE_CMS } from 'config/common';
import { COL_CATEGORIES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import { ProductModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CategoryInterface,
  ProductCategoryInterface,
  ProductInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import {
  useUpdateProductCategoryMutation,
  useUpdateProductCategoryVisibilityMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/CmsLayout/CmsProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductCategoriesInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  categoriesTree: ProductCategoryInterface[];
}

const ProductCategories: React.FC<ProductCategoriesInterface> = ({
  product,
  categoriesTree,
  rubric,
}) => {
  const { showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    reload: true,
  });

  const [updateProductCategoryMutation] = useUpdateProductCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCategory),
    onError: onErrorCallback,
  });

  const [updateProductCategoryVisibilityMutation] = useUpdateProductCategoryVisibilityMutation({
    onCompleted: (data) => onCompleteCallback(data.updateProductCategoryVisibility),
    onError: onErrorCallback,
  });

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
                    variables: {
                      input: {
                        productId: product._id,
                        categoryId: category._id,
                      },
                    },
                  }).catch(console.log);
                }}
              />
            </div>
            <div className='font-medium' data-cy={`category-${name}`}>
              {name}
            </div>
            <Tooltip
              title={isViewChecked ? 'Показывать в заголовке товара' : 'Категория не выбрана'}
            >
              <div>
                <Checkbox
                  disabled={!category.selected}
                  testId={`${category.name}`}
                  checked={isViewChecked}
                  value={`${category._id}-view`}
                  name={`${category._id}-view`}
                  onChange={() => {
                    showLoading();
                    updateProductCategoryVisibilityMutation({
                      variables: {
                        input: {
                          productId: product._id,
                          categoryId: category._id,
                        },
                      },
                    }).catch(console.log);
                  }}
                />
              </div>
            </Tooltip>
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
    [product._id, product.titleCategoriesSlugs, showLoading, updateProductCategoryMutation],
  );

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Категории',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
      {
        name: product.originalName,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}/products/product/${product._id}`,
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

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, categoriesTree, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductCategories product={product} rubric={rubric} categoriesTree={categoriesTree} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const { props } = await getAppInitialData({ context });
  if (!props || !productId || !rubricId) {
    return {
      notFound: true,
    };
  }

  const productAggregation = await productsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          _id: new ObjectId(`${productId}`),
        },
      },
    ])
    .toArray();
  const product = productAggregation[0];

  // Get rubric
  const initialRubric = await rubricsCollection.findOne({
    _id: new ObjectId(`${rubricId}`),
  });

  if (!product || !initialRubric) {
    return {
      notFound: true,
    };
  }

  // Get rubric categories
  const initialCategories = await categoriesCollection
    .find({
      rubricId: initialRubric._id,
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

  const rubric: RubricInterface = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      product: castDbData(product),
      rubric: castDbData(rubric),
      categoriesTree: castDbData(categoriesTree),
    },
  };
};

export default Product;
