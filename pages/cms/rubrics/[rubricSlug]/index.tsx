import { Form, Formik } from 'formik';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import FixedButtons from '../../../../components/button/FixedButtons';
import WpButton from '../../../../components/button/WpButton';
import RubricMainFields from '../../../../components/FormTemplates/RubricMainFields';
import Inner from '../../../../components/Inner';
import SeoContentEditor from '../../../../components/SeoContentEditor';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from '../../../../config/common';
import { COL_RUBRIC_VARIANTS } from '../../../../db/collectionNames';
import { getConsoleRubricDetails } from '../../../../db/dao/rubrics/getConsoleRubricDetails';
import { getDatabase } from '../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  RubricInterface,
  RubricVariantInterface,
  SeoContentCitiesInterface,
} from '../../../../db/uiInterfaces';
import { UpdateRubricInput, useUpdateRubricMutation } from '../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../../hooks/useValidationSchema';
import CmsRubricLayout from '../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../lib/i18n';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';
import { updateRubricSchema } from '../../../../validation/rubricSchema';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
  companySlug: string;
  rubricVariants: RubricVariantInterface[];
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({
  rubric,
  companySlug,
  seoDescriptionTop,
  seoDescriptionBottom,
  rubricVariants,
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
                <RubricMainFields rubricVariants={rubricVariants} />
                <SeoContentEditor
                  label={'SEO текст вверху каталога'}
                  filedName={'textTop'}
                  hideIndexCheckbox
                />
                <SeoContentEditor
                  label={'SEO текст внизу каталога'}
                  filedName={'textBottom'}
                  hideIndexCheckbox
                />

                <FixedButtons>
                  <WpButton type={'submit'} testId={'rubric-submit'}>
                    Сохранить
                  </WpButton>
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
  if (!props) {
    return {
      notFound: true,
    };
  }

  const payload = await getConsoleRubricDetails({
    locale: props.sessionLocale,
    rubricSlug: `${query.rubricSlug}`,
    companySlug: DEFAULT_COMPANY_SLUG,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rubricVariantsCollection = db.collection<RubricVariantInterface>(COL_RUBRIC_VARIANTS);
  const initialRubricVariants = await rubricVariantsCollection.find({}).toArray();
  const castedRubricVariants = initialRubricVariants.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, props.sessionLocale),
    };
  });
  const sortedRubricVariants = sortObjectsByField(castedRubricVariants);

  return {
    props: {
      ...props,
      rubricVariants: castDbData(sortedRubricVariants),
      seoDescriptionBottom: castDbData(payload.seoDescriptionBottom),
      seoDescriptionTop: castDbData(payload.seoDescriptionTop),
      rubric: castDbData(payload.rubric),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default RubricPage;
