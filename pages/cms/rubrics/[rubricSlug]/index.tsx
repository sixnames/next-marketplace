import { UpdateRubricInputInterface } from 'db/dao/rubrics/updateRubric';
import { Form, Formik } from 'formik';
import { useUpdateRubric } from 'hooks/mutations/useRubricMutations';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import SeoContentEditor from 'components/SeoContentEditor';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { getConsoleRubricDetails } from 'db/ssr/rubrics/getConsoleRubricDetails';
import { getDatabase } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  RubricInterface,
  RubricVariantInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateRubricSchema } from 'validation/rubricSchema';

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
  const [updateRubricMutation] = useUpdateRubric();

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

  const initialValues: UpdateRubricInputInterface = {
    _id: `${_id}`,
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
    variantId: `${variantId}`,
  };

  const { parentLink } = getConsoleRubricLinks({
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubric.name}`,
    config: [
      {
        name: 'Рубрикатор',
        href: parentLink,
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
            updateRubricMutation(values).catch(console.log);
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
