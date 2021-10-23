import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CMS,
} from 'config/common';
import {
  COL_COMPANIES,
  COL_RUBRIC_DESCRIPTIONS,
  COL_RUBRIC_SEO,
  COL_RUBRICS,
} from 'db/collectionNames';
import { RubricModel, RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateRubricInput, useUpdateRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
  currentCompany?: CompanyInterface | null;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  seoTop,
  seoBottom,
  currentCompany,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateRubricSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });

  const [updateRubricMutation] = useUpdateRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRubric),
    onError: onErrorCallback,
  });

  const {
    _id = '',
    active,
    variantId,
    descriptionI18n,
    shortDescriptionI18n,
    nameI18n,
    capitalise,
    showRubricNameInProductTitle,
    showCategoryInProductTitle,
    showBrandInNav,
    showBrandInFilter,
    seoDescriptionTop,
    seoDescriptionBottom,
    defaultTitleI18n,
    prefixI18n,
    keywordI18n,
    gender,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    textBottomI18n: seoDescriptionBottom?.textI18n || {},
    textTopI18n: seoDescriptionTop?.textI18n || {},
    companySlug: `${currentCompany?.slug}`,
    capitalise: capitalise || false,
    showRubricNameInProductTitle: showRubricNameInProductTitle || false,
    showCategoryInProductTitle: showCategoryInProductTitle || false,
    showBrandInNav: showBrandInNav || false,
    showBrandInFilter: showBrandInFilter || false,
    defaultTitleI18n,
    prefixI18n,
    keywordI18n,
    gender: gender as any,
    variantId,
  };

  const basePath = `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: basePath,
      },
      {
        name: `Рубрикатор`,
        href: `${basePath}/rubrics`,
      },
    ],
  };

  return (
    <CmsRubricLayout
      hideAttributesPath
      rubric={rubric}
      breadcrumbs={breadcrumbs}
      basePath={basePath}
    >
      <Inner testId={'rubric-details'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => {
            showLoading();
            return updateRubricMutation({
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
                  <Button type={'submit'} testId={'rubric-submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricPageInterface extends PagePropsInterface, RubricDetailsInterface {}

const RubricPage: NextPage<RubricPageInterface> = ({
  pageUrls,
  rubric,
  seoBottom,
  seoTop,
  currentCompany,
}) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricDetails
        rubric={rubric}
        seoBottom={seoBottom}
        seoTop={seoTop}
        currentCompany={currentCompany}
      />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
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

  const initialRubrics = await rubricsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
        },
      },

      // get top seo text
      {
        $lookup: {
          from: COL_RUBRIC_DESCRIPTIONS,
          as: 'seoDescriptionTop',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_TOP,
                companySlug,
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
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
          from: COL_RUBRIC_DESCRIPTIONS,
          as: 'seoDescriptionBottom',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
                companySlug,
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
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
        $project: {
          attributes: false,
          priorities: false,
          views: false,
        },
      },
    ])
    .toArray();
  const initialRubric = initialRubrics[0];
  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const seoTop = await rubricSeoCollection.findOne({
    rubricId: initialRubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    categoryId: null,
    companySlug,
  });

  const seoBottom = await rubricSeoCollection.findOne({
    rubricId: initialRubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    categoryId: null,
    companySlug,
  });

  const { sessionLocale } = props;
  const rawRubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
      seoTop: castDbData(seoTop),
      seoBottom: castDbData(seoBottom),
      currentCompany: castDbData(companyResult),
    },
  };
};

export default RubricPage;
