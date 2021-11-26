import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import { CategoryDescriptionConstructor } from 'components/company/CompanyRubricCategoryDetails';
import WpIconUpload from 'components/FormElements/Upload/WpIconUpload';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import Inner from 'components/Inner';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  GENDER_ENUMS,
  ROUTE_CMS,
} from 'config/common';
import { COL_CATEGORIES, COL_ICONS, COL_RUBRICS } from 'db/collectionNames';
import { OptionVariantsModel, SeoContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getCategorySeoText } from 'lib/seoTextUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDetailsInterface {
  category: CategoryInterface;
  seoDescriptionTop: SeoContentModel;
  seoDescriptionBottom: SeoContentModel;
  companySlug: string;
}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  companySlug,
  seoDescriptionBottom,
  seoDescriptionTop,
}) => {
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

  const {
    _id = '',
    nameI18n,
    rubricId,
    rubric,
    gender,
    image,
    variants,
    replaceParentNameInCatalogueTitle,
  } = category;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateCategoryInput = {
    categoryId: _id,
    rubricId,
    nameI18n,
    textBottom: seoDescriptionBottom.content,
    textTop: seoDescriptionTop.content,
    gender: gender ? (`${gender}` as Gender) : null,
    replaceParentNameInCatalogueTitle,
    companySlug,
    variants:
      variantKeys.length > 0
        ? variants
        : GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
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
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('categoryId', `${category._id}`);

            fetch('/api/category/update-category-image', {
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

              fetch('/api/category/update-category-image', {
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

            fetch('/api/category/update-category-icon', {
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

              fetch('/api/category/update-category-icon', {
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
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <CategoryMainFields />

                <CategoryDescriptionConstructor
                  label={'SEO текст вверху каталога'}
                  name={'textTop'}
                  categoryId={`${category._id}`}
                  descriptionId={`${seoDescriptionTop._id}`}
                  setFieldValue={setFieldValue}
                  values={values}
                />

                <CategoryDescriptionConstructor
                  label={'SEO текст внизу каталога'}
                  name={'textBottom'}
                  categoryId={`${category._id}`}
                  descriptionId={`${seoDescriptionBottom._id}`}
                  setFieldValue={setFieldValue}
                  values={values}
                />

                <FixedButtons>
                  <Button type={'submit'} testId={'category-submit'} size={'small'}>
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

interface CategoryPageInterface extends GetAppInitialDataPropsInterface, CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CategoryDetails {...props} />
    </ConsoleLayout>
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

  const companySlug = DEFAULT_COMPANY_SLUG;

  const categoryAggregation = await categoriesCollection
    .aggregate<CategoryInterface>([
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
  const category: CategoryInterface = {
    ...initialCategory,
    name: getFieldStringLocale(initialCategory.nameI18n, sessionLocale),
    rubric: initialCategory.rubric
      ? {
          ...initialCategory.rubric,
          name: getFieldStringLocale(initialCategory.rubric.nameI18n, sessionLocale),
        }
      : null,
  };

  const seoDescriptionTop = await getCategorySeoText({
    companySlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    citySlug: DEFAULT_CITY,
  });

  const seoDescriptionBottom = await getCategorySeoText({
    companySlug,
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    citySlug: DEFAULT_CITY,
  });

  if (!seoDescriptionBottom || !seoDescriptionTop) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(seoDescriptionBottom),
      seoDescriptionTop: castDbData(seoDescriptionTop),
      category: castDbData(category),
      companySlug,
    },
  };
};

export default CategoryPage;
