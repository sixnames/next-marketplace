import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_CATEGORIES, COL_RUBRICS } from 'db/collectionNames';
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
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateCategoryMutation] = useUpdateCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.updateCategory),
    onError: onErrorCallback,
  });

  const { _id = '', nameI18n, rubricId, rubric, gender, icon, variants } = category;

  const initialValues: UpdateCategoryInput = {
    rubricId,
    categoryId: _id,
    nameI18n,
    gender: gender ? (`${gender}` as Gender) : null,
    icon,
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
                  <Button type={'submit'} testId={'rubric-submit'}>
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
        $addFields: {
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
