import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  ROUTE_CMS,
} from 'config/common';
import { COL_RUBRIC_SEO, COL_RUBRICS } from 'db/collectionNames';
import { ProductSeoModel, RubricModel, RubricSeoModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateRubricInput,
  useGetAllRubricVariantsQuery,
  useUpdateRubricMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  seoTop?: ProductSeoModel | null;
  seoBottom?: ProductSeoModel | null;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoTop, seoBottom }) => {
  const validationSchema = useValidationSchema({
    schema: updateRubricSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const { data, loading, error } = useGetAllRubricVariantsQuery();

  const [updateRubricMutation] = useUpdateRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateRubric),
    onError: onErrorCallback,
  });

  if (loading) {
    return <Spinner isNested isTransparent />;
  }
  if (error) {
    return <RequestError />;
  }
  if (!data) {
    return <RequestError />;
  }

  const {
    _id = '',
    active,
    variantId,
    descriptionI18n,
    shortDescriptionI18n,
    nameI18n,
    catalogueTitle,
    capitalise,
    showRubricNameInProductTitle,
    showCategoryInProductTitle,
    showBrandInNav,
    showBrandInFilter,
    textBottomI18n,
    textTopI18n,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    textBottomI18n,
    textTopI18n,
    capitalise: capitalise || false,
    showRubricNameInProductTitle: showRubricNameInProductTitle || false,
    showCategoryInProductTitle: showCategoryInProductTitle || false,
    showBrandInNav: showBrandInNav || false,
    showBrandInFilter: showBrandInFilter || false,
    catalogueTitle: {
      defaultTitleI18n: catalogueTitle?.defaultTitleI18n,
      prefixI18n: catalogueTitle?.prefixI18n,
      keywordI18n: catalogueTitle?.keywordI18n,
      gender: catalogueTitle?.gender as any,
    },
    variantId,
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
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
                <RubricMainFields
                  seoTop={seoTop}
                  seoBottom={seoBottom}
                  rubricVariants={data.getAllRubricVariants}
                  genderOptions={data.getGenderOptions}
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

const RubricPage: NextPage<RubricPageInterface> = ({ pageUrls, rubric, seoBottom, seoTop }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricDetails rubric={rubric} seoBottom={seoBottom} seoTop={seoTop} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
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
  });

  const seoBottom = await rubricSeoCollection.findOne({
    rubricId: initialRubric._id,
    position: CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
    categoryId: null,
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
    },
  };
};

export default RubricPage;
