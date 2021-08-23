import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_RUBRICS } from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateRubricInput, useUpdateRubricMutation } from 'generated/apolloComponents';
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
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric }) => {
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
    catalogueTitle,
    capitalise,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    capitalise: capitalise || false,
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
                <RubricMainFields />

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

const RubricPage: NextPage<RubricPageInterface> = ({ pageUrls, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricDetails rubric={rubric} />
    </CmsLayout>
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

  const { sessionLocale } = props;
  const rawRubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
    },
  };
};

export default RubricPage;
