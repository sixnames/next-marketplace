import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import WpIconUpload from 'components/FormElements/Upload/WpIconUpload';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/CmsLayout/CmsCategoryLayout';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDetailsInterface {
  category: CategoryInterface;
}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({ category }) => {
  const validationSchema = useValidationSchema({
    schema: updateCategorySchema,
  });
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    router,
    showErrorNotification,
    hideLoading,
  } = useMutationCallbacks({
    reload: true,
  });
  const [updateCategoryMutation] = useUpdateCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.updateCategory),
    onError: onErrorCallback,
  });

  const { _id = '', nameI18n, rubricId, rubric, gender, variants, image } = category;

  const initialValues: UpdateCategoryInput = {
    rubricId,
    categoryId: _id,
    nameI18n,
    gender: gender ? (`${gender}` as Gender) : null,
    variants,
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${category.name}`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubricId}`,
      },
      {
        name: `Категории`,
        href: `${ROUTE_CMS}/rubrics/${rubricId}/categories`,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs}>
      <Inner testId={'category-details'}>
        <WpImageUpload
          previewUrl={image}
          testId={'image'}
          label={'Изображение'}
          uploadImageHandler={(files) => {
            if (files) {
              showLoading();
              const formData = new FormData();
              formData.append('assets', files[0]);
              formData.append('categoryId', `${category._id}`);

              fetch('/api/add-category-image', {
                method: 'POST',
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.success) {
                    hideLoading();
                    router.reload();
                    return;
                  }
                  hideLoading();
                  showErrorNotification({ title: json.message });
                })
                .catch(() => {
                  hideLoading();
                  showErrorNotification({ title: 'error' });
                });
            }
          }}
        />

        <WpIconUpload
          previewIcon={category.icon?.icon}
          testId={'icon'}
          label={'Иконка'}
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('categoryId', `${category._id}`);

            fetch('/api/update-category-icon', {
              method: 'DELETE',
              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                if (json.success) {
                  hideLoading();
                  router.reload();
                  return;
                }
                hideLoading();
                showErrorNotification({ title: json.message });
              })
              .catch(() => {
                hideLoading();
                showErrorNotification({ title: 'error' });
              });
          }}
          uploadImageHandler={(files) => {
            if (files) {
              showLoading();
              const formData = new FormData();
              formData.append('assets', files[0]);
              formData.append('categoryId', `${category._id}`);

              fetch('/api/update-category-icon', {
                method: 'POST',
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.success) {
                    hideLoading();
                    router.reload();
                    return;
                  }
                  hideLoading();
                  showErrorNotification({ title: json.message });
                })
                .catch(() => {
                  hideLoading();
                  showErrorNotification({ title: 'error' });
                });
            }
          }}
        />

        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => {
            showLoading();
            return updateCategoryMutation({
              variables: {
                input: values,
              },
            });
          }}
        >
          {() => {
            return (
              <Form>
                <CategoryMainFields />

                <FixedButtons>
                  <Button type={'submit'} testId={'category-submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsCategoryLayout>
  );
};

interface CategoryPageInterface extends PagePropsInterface, CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ pageUrls, category }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CategoryDetails category={category} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const categoryAggregation = await categoriesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$rubricId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_ICONS,
          as: 'icon',
          let: {
            documentId: '$_id',
          },
          pipeline: [
            {
              $match: {
                collectionName: COL_CATEGORIES,
                $expr: {
                  $eq: ['$documentId', '$$documentId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          icon: {
            $arrayElemAt: ['$icon', 0],
          },
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },
    ])
    .toArray();
  const initialCategory = categoryAggregation[0];
  if (!initialCategory) {
    return {
      notFound: true,
    };
  }

  const { sessionLocale } = props;
  const category = {
    ...initialCategory,
    name: getFieldStringLocale(initialCategory.nameI18n, sessionLocale),
    rubric: initialCategory.rubric
      ? {
          ...initialCategory.rubric,
          name: getFieldStringLocale(initialCategory.rubric.nameI18n, sessionLocale),
        }
      : null,
  };

  return {
    props: {
      ...props,
      category: castDbData(category),
    },
  };
};

export default CategoryPage;
