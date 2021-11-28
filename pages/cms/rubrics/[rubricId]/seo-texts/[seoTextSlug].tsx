import Button from 'components/button/Button';
import Inner from 'components/Inner';
import { SingleSeoTextEditor } from 'components/SeoTextEditor';
import { DEFAULT_COMPANY_SLUG, ROUTE_CMS } from 'config/common';
import { getConsoleRubricDetails } from 'db/dao/rubric/getConsoleRubricDetails';
import { SeoContentModel } from 'db/dbModels';
import { RubricInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { alwaysString } from 'lib/arrayUtils';
import { getSeoTextBySlug } from 'lib/seoTextUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { Form, Formik } from 'formik';

interface RubricDetailsInterface {
  rubric: RubricInterface;
  companySlug: string;
  seoText: SeoContentModel;
}

const RubricDetails: React.FC<RubricDetailsInterface> = ({ rubric, seoText }) => {
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
      <Inner testId={'rubric-seo-text-details'}>
        <Formik
          initialValues={seoText}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {() => {
            return (
              <Form>
                <SingleSeoTextEditor filedName={'content'} seoTextId={`${seoText._id}`} />
                <Button type={'submit'} testId={'rubric-seo-text-submit'}>
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
  const seoTextSlug = alwaysString(query.seoTextSlug);
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

  const seoText = await getSeoTextBySlug({
    url,
    seoTextSlug,
    companySlug,
    rubricSlug: payload.rubric.slug,
  });
  if (!seoText) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      rubric: castDbData(payload.rubric),
      seoText: castDbData(seoText),
      companySlug,
    },
  };
};

export default RubricPage;
