import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import { RubricDescriptionConstructor } from 'components/company/CompanyRubricDetails';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import {
  CATALOGUE_SEO_TEXT_POSITION_BOTTOM,
  CATALOGUE_SEO_TEXT_POSITION_TOP,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  ROUTE_CMS,
} from 'config/common';
import { COL_RUBRICS } from 'db/collectionNames';
import { RubricModel, SeoContentModel } from 'db/dbModels';
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
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getRubricSeoText } from 'lib/seoTextUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  seoDescriptionTop: SeoContentModel;
  seoDescriptionBottom: SeoContentModel;
  companySlug: string;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  companySlug,
  seoDescriptionTop,
  seoDescriptionBottom,
}) => {
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
    capitalise,
    showRubricNameInProductTitle,
    showCategoryInProductTitle,
    showBrandInNav,
    showBrandInFilter,
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
    textBottom: seoDescriptionBottom.content,
    textTop: seoDescriptionTop.content,
    companySlug,
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
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <RubricMainFields
                  rubricVariants={data.getAllRubricVariants}
                  genderOptions={data.getGenderOptions}
                />

                <RubricDescriptionConstructor
                  name={'textTop'}
                  values={values}
                  setFieldValue={setFieldValue}
                  label={'SEO текст вверху каталога'}
                  rubricId={`${rubric._id}`}
                  descriptionId={`${seoDescriptionTop._id}`}
                />

                <RubricDescriptionConstructor
                  name={'textBottom'}
                  values={values}
                  setFieldValue={setFieldValue}
                  label={'SEO текст внизу каталога'}
                  rubricId={`${rubric._id}`}
                  descriptionId={`${seoDescriptionBottom._id}`}
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

interface RubricPageInterface extends GetAppInitialDataPropsInterface, RubricDetailsInterface {}

const RubricPage: NextPage<RubricPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const companySlug = DEFAULT_COMPANY_SLUG;

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
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

  const { sessionLocale } = props;
  const rubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  const seoDescriptionTop = await getRubricSeoText({
    rubricSlug: rubric.slug,
    companySlug,
    position: CATALOGUE_SEO_TEXT_POSITION_TOP,
    citySlug: DEFAULT_CITY,
  });

  const seoDescriptionBottom = await getRubricSeoText({
    rubricSlug: rubric.slug,
    companySlug,
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
      rubric: castDbData(rubric),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default RubricPage;
