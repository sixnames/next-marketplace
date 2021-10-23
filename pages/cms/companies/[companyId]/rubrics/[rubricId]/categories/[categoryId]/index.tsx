import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  GENDER_ENUMS,
  ROUTE_CMS,
} from 'config/common';
import {
  COL_CATEGORIES,
  COL_CATEGORY_DESCRIPTIONS,
  COL_COMPANIES,
  COL_ICONS,
  COL_RUBRIC_SEO,
  COL_RUBRICS,
} from 'db/collectionNames';
import { OptionVariantsModel, RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CategoryInterface, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCategoryLayout from 'layout/cms/CmsCategoryLayout';
import CmsLayout from 'layout/cms/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDetailsInterface {
  category: CategoryInterface;
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
  currentCompany?: CompanyInterface | null;
}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  currentCompany,
  seoTop,
  seoBottom,
}) => {
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
  const routeBasePath = React.useMemo(() => {
    return `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  }, [currentCompany]);

  const {
    _id = '',
    nameI18n,
    rubricId,
    rubric,
    gender,
    variants,
    seoDescriptionTop,
    seoDescriptionBottom,
    replaceParentNameInCatalogueTitle,
  } = category;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateCategoryInput = {
    categoryId: _id,
    rubricId,
    nameI18n,
    textBottomI18n: seoDescriptionBottom?.textI18n,
    textTopI18n: seoDescriptionTop?.textI18n,
    gender: gender ? (`${gender}` as Gender) : null,
    replaceParentNameInCatalogueTitle,
    companySlug: `${currentCompany?.slug}`,
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
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${routeBasePath}/rubrics/${rubric?._id}`,
      },
      {
        name: `Категории`,
        href: `${routeBasePath}/rubrics/${rubricId}/categories`,
      },
    ],
  };

  return (
    <CmsCategoryLayout
      category={category}
      breadcrumbs={breadcrumbs}
      basePath={routeBasePath}
      hideAttributesPath
    >
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
                <FormikTranslationsInput
                  variant={'textarea'}
                  className='h-[30rem]'
                  label={'SEO текст вверху каталога'}
                  name={'textTopI18n'}
                  testId={'textTopI18n'}
                  additionalUi={(currentLocale) => {
                    if (!seoTop) {
                      return null;
                    }
                    const seoLocale = seoTop.locales.find(({ locale }) => {
                      return locale === currentLocale;
                    });

                    if (!seoLocale) {
                      return <div className='mb-4 font-medium'>Текст проверяется</div>;
                    }

                    return (
                      <TextSeoInfo
                        seoLocale={seoLocale}
                        className='mb-4 mt-4'
                        listClassName='flex gap-3 flex-wrap'
                      />
                    );
                  }}
                />

                <FormikTranslationsInput
                  variant={'textarea'}
                  className='h-[30rem]'
                  label={'SEO текст внизу каталога'}
                  name={'textBottomI18n'}
                  testId={'textBottomI18n'}
                  additionalUi={(currentLocale) => {
                    if (!seoBottom) {
                      return null;
                    }
                    const seoLocale = seoBottom.locales.find(({ locale }) => {
                      return locale === currentLocale;
                    });

                    if (!seoLocale) {
                      return <div className='mb-4 font-medium'>Текст проверяется</div>;
                    }

                    return (
                      <TextSeoInfo
                        seoLocale={seoLocale}
                        className='mb-4 mt-4'
                        listClassName='flex gap-3 flex-wrap'
                      />
                    );
                  }}
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

interface CategoryPageInterface extends PagePropsInterface, CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <CategoryDetails {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

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

      // get top seo text
      {
        $lookup: {
          from: COL_CATEGORY_DESCRIPTIONS,
          as: 'seoDescriptionTop',
          let: {
            categoryId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_TOP,
                companySlug,
                $expr: {
                  $eq: ['$$categoryId', '$categoryId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seoDescriptionTop: {
            $arrayElemAt: ['$seoDescriptionTop', 0],
          },
        },
      },

      // get bottom seo text
      {
        $lookup: {
          from: COL_CATEGORY_DESCRIPTIONS,
          as: 'seoDescriptionBottom',
          let: {
            categoryId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
                companySlug,
                $expr: {
                  $eq: ['$$categoryId', '$categoryId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seoDescriptionBottom: {
            $arrayElemAt: ['$seoDescriptionBottom', 0],
          },
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

  const seoTop = await rubricSeoCollection.findOne({
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    companySlug,
  });

  const seoBottom = await rubricSeoCollection.findOne({
    categoryId: category._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    companySlug,
  });

  return {
    props: {
      ...props,
      category: castDbData(category),
      seoTop: castDbData(seoTop),
      seoBottom: castDbData(seoBottom),
      currentCompany: castDbData(companyResult),
    },
  };
};

export default CategoryPage;
