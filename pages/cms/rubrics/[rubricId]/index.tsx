import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import SeoContentEditor from 'components/SeoContentEditor';
import Spinner from 'components/Spinner';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { getConsoleRubricDetails } from 'db/dao/rubric/getConsoleRubricDetails';
import {
  AppContentWrapperBreadCrumbs,
  RubricInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateRubricInput,
  useGetAllRubricVariantsQuery,
  useUpdateRubricMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateRubricSchema } from 'validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
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
    showBrandAsAlphabet,
    gender,
  } = rubric;

  const initialValues: UpdateRubricInput = {
    rubricId: _id,
    active,
    nameI18n,
    descriptionI18n,
    shortDescriptionI18n,
    textBottom: seoDescriptionBottom,
    textTop: seoDescriptionTop,
    companySlug,
    capitalise: capitalise || false,
    showRubricNameInProductTitle: showRubricNameInProductTitle || false,
    showCategoryInProductTitle: showCategoryInProductTitle || false,
    showBrandInNav: showBrandInNav || false,
    showBrandInFilter: showBrandInFilter || false,
    showBrandAsAlphabet: showBrandAsAlphabet || false,
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
          {() => {
            return (
              <Form>
                <RubricMainFields
                  rubricVariants={data.getAllRubricVariants}
                  genderOptions={data.getGenderOptions}
                />
                <SeoContentEditor label={'SEO текст вверху каталога'} filedName={'textTop'} />
                <SeoContentEditor label={'SEO текст внизу каталога'} filedName={'textBottom'} />

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
  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const payload = await getConsoleRubricDetails({
    locale: props.sessionLocale,
    rubricId: `${query.rubricId}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(payload.seoDescriptionBottom),
      seoDescriptionTop: castDbData(payload.seoDescriptionTop),
      rubric: castDbData(payload.rubric),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default RubricPage;
