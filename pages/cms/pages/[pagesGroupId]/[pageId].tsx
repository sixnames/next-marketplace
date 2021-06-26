import Button from 'components/Button';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import PageEditor from 'components/PageEditor';
import { PAGE_STATE_DRAFT, PAGE_STATE_PUBLISHED, ROUTE_CMS, SORT_DESC } from 'config/common';
import { COL_CITIES, COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CityInterface, PageInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { PageState, useUpdatePageMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner';
import Title from 'components/Title';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updatePageSchema } from 'validation/pagesSchema';

interface PageDetailsPageConsumerInterface {
  page: PageInterface;
  cities: CityInterface[];
}

const PAGE_STATE_OPTIONS = [
  {
    _id: PAGE_STATE_DRAFT,
    slug: PAGE_STATE_DRAFT,
    name: 'Не опубликована',
  },
  {
    _id: PAGE_STATE_PUBLISHED,
    slug: PAGE_STATE_PUBLISHED,
    name: 'Опубликована',
  },
];

const PageDetailsPageConsumer: React.FC<PageDetailsPageConsumerInterface> = ({ page, cities }) => {
  const validationSchema = useValidationSchema({
    schema: updatePageSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updatePageMutation] = useUpdatePageMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updatePage),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Страницы`,
    config: [
      {
        name: 'Группы страниц',
        href: `${ROUTE_CMS}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CMS}/pages/${page.pagesGroup?._id}`,
      },
    ],
  };

  return (
    <AppContentWrapper testId={'page-details'} breadcrumbs={breadcrumbs}>
      <Inner>
        <Title>{page.name}</Title>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            ...page,
            content: JSON.parse(page.content),
          }}
          onSubmit={(values) => {
            showLoading();
            updatePageMutation({
              variables: {
                input: {
                  _id: values._id,
                  content: JSON.stringify(values.content),
                  nameI18n: values.nameI18n,
                  descriptionI18n: values.descriptionI18n,
                  pagesGroupId: values.pagesGroupId,
                  state: values.state as unknown as PageState,
                  citySlug: `${values.citySlug}`,
                  index: noNaN(values.index),
                },
              },
            }).catch(console.log);
          }}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <div className='relative'>
                  <FormikTranslationsInput
                    label={'Название'}
                    name={'nameI18n'}
                    testId={'name'}
                    showInlineError
                    isRequired
                  />
                  <FormikTranslationsInput
                    label={'Описание'}
                    name={'descriptionI18n'}
                    testId={'description'}
                    showInlineError
                    isRequired
                  />
                  <FormikInput
                    label={'Порядковый номер'}
                    name={'index'}
                    testId={'index'}
                    showInlineError
                    isRequired
                  />
                  <FormikSelect
                    firstOption={'Не назначен'}
                    label={'Город'}
                    name={'citySlug'}
                    testId={'citySlug'}
                    options={cities}
                    isRequired
                    showInlineError
                  />
                  <FormikSelect
                    label={'Состояние'}
                    name={'state'}
                    testId={'state'}
                    options={PAGE_STATE_OPTIONS}
                    isRequired
                    showInlineError
                  />

                  <InputLine labelTag={'div'}>
                    <Button type={'submit'} testId={'submit-page'}>
                      Сохранить
                    </Button>
                  </InputLine>

                  <Title tag={'div'}>Контент страницы</Title>
                  <PageEditor
                    pageId={`${page._id}`}
                    value={values.content}
                    setValue={(value) => {
                      setFieldValue('content', value);
                    }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface PageDetailsPageInterface extends PagePropsInterface, PageDetailsPageConsumerInterface {}

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({ pageUrls, page, cities }) => {
  return (
    <CmsLayout title={'Page'} pageUrls={pageUrls}>
      <PageDetailsPageConsumer page={page} cities={cities} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getAppInitialData({ context });
  if (!props || !pageId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesCollection = db.collection<PageInterface>(COL_PAGES);
  const citiesCollection = db.collection<CityInterface>(COL_CITIES);

  const initialPageAggregation = await pagesCollection
    .aggregate([
      {
        $match: { _id: new ObjectId(`${pageId}`) },
      },
      {
        $lookup: {
          from: COL_PAGES_GROUP,
          as: 'pagesGroup',
          foreignField: '_id',
          localField: 'pagesGroupId',
        },
      },
      {
        $addFields: {
          pagesGroup: {
            $arrayElemAt: ['$pagesGroup', 0],
          },
        },
      },
    ])
    .toArray();

  const initialPage = initialPageAggregation[0];
  if (!initialPage) {
    return {
      notFound: true,
    };
  }

  const initialCities = await citiesCollection
    .find(
      {},
      {
        sort: {
          _id: SORT_DESC,
        },
      },
    )
    .toArray();

  const page: PageInterface = {
    ...initialPage,
    name: getFieldStringLocale(initialPage.nameI18n, props.sessionLocale),
    pagesGroup: initialPage.pagesGroup
      ? {
          ...initialPage.pagesGroup,
          name: getFieldStringLocale(initialPage.pagesGroup.nameI18n, props.sessionLocale),
        }
      : null,
  };

  const cities: CityInterface[] = initialCities.map((city) => {
    return {
      ...city,
      name: getFieldStringLocale(city.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      page: castDbData(page),
      cities: castDbData(cities),
    },
  };
};

export default PageDetailsPage;
