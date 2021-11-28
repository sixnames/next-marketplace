import Button from 'components/button/Button';
import Inner from 'components/Inner';
import { SingleSeoContentEditor } from 'components/SeoContentEditor';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { getConsoleRubricDetails } from 'db/dao/rubric/getConsoleRubricDetails';
import { SeoContentModel } from 'db/dbModels';
import { RubricInterface } from 'db/uiInterfaces';
import { useUpdateSeoContent } from 'hooks/mutations/useSeoContentMutations';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { alwaysString } from 'lib/arrayUtils';
import { getSeoContentBySlug } from 'lib/seoContentUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { Form, Formik } from 'formik';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoContent: SeoContentModel;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoContent }) => {
  const [updateSeoContentMutation] = useUpdateSeoContent();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `SEO тексты`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-seo-content-details'}>
        <Formik<SeoContentModel>
          initialValues={seoContent}
          onSubmit={(values) => {
            updateSeoContentMutation({
              seoContentId: `${seoContent._id}`,
              content: values.content,
            }).catch(console.log);
          }}
        >
          {() => {
            return (
              <Form>
                <SingleSeoContentEditor filedName={'content'} seoContentId={`${seoContent._id}`} />
                <Button type={'submit'} testId={'rubric-seo-content-submit'}>
                  Сохранить
                </Button>
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

  const url = alwaysString(query.url);
  const seoContentSlug = alwaysString(query.seoContentSlug);
  const companySlug = DEFAULT_COMPANY_SLUG;

  const payload = await getConsoleRubricDetails({
    locale: props.sessionLocale,
    rubricId: `${query.rubricId}`,
    companySlug,
  });
  if (!payload) {
    return {
      notFound: true,
    };
  }

  const seoContent = await getSeoContentBySlug({
    url,
    seoContentSlug,
    companySlug,
    rubricSlug: payload.rubric.slug,
  });
  if (!seoContent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoContent: castDbData(seoContent),
      companySlug,
    },
  };
};

export default RubricPage;
