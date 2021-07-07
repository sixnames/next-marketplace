import Button from 'components/Button';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import PageEditor from 'components/PageEditor';
import { PAGE_STATE_DRAFT, PAGE_STATE_PUBLISHED, ROUTE_CONSOLE, SORT_DESC } from 'config/common';
import { COL_CITIES, COL_PAGES, COL_PAGES_GROUP } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CityInterface, CompanyInterface, PageInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { PageState, useUpdatePageMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';
import { updatePageSchema } from 'validation/pagesSchema';

interface PageDetailsPageConsumerInterface {
  page: PageInterface;
  cities: CityInterface[];
  currentCompany: CompanyInterface;
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

const PageDetailsPageConsumer: React.FC<PageDetailsPageConsumerInterface> = ({
  page,
  currentCompany,
  cities,
}) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updatePageSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading, hideLoading, showErrorNotification } =
    useMutationCallbacks({
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
        href: `${ROUTE_CONSOLE}/${currentCompany._id}/pages`,
      },
      {
        name: `${page.pagesGroup?.name}`,
        href: `${ROUTE_CONSOLE}/${currentCompany._id}/pages/${page.pagesGroup?._id}`,
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
            mainBanner: [page.mainBanner?.url],
            secondaryBanner: [page.secondaryBanner?.url],
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
                  showAsMainBanner: values.showAsMainBanner,
                  showAsSecondaryBanner: values.showAsSecondaryBanner,
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

                  <FormikCheckboxLine
                    label={'Показывать в слайдере на главной странице'}
                    name={'showAsMainBanner'}
                  />

                  <FormikImageUpload
                    label={'Изображение слайда (1250 x 432)'}
                    name={'mainBanner'}
                    testId={'mainBanner'}
                    width={'10rem'}
                    height={'10rem'}
                    setImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('pageId', `${page._id}`);

                        fetch('/api/update-page-main-banner', {
                          method: 'POST',
                          body: formData,
                        })
                          .then((res) => {
                            return res.json();
                          })
                          .then((json) => {
                            if (json.success) {
                              router.reload();
                              return;
                            }
                            hideLoading();
                            showErrorNotification({ title: json.message });
                          })
                          .catch(() => {
                            hideLoading();
                            showErrorNotification({ title: 'error' });
                          });
                      }
                    }}
                  />

                  <FormikCheckboxLine
                    label={'Показывать в блоке Акции на главной странице'}
                    name={'showAsSecondaryBanner'}
                  />

                  <FormikImageUpload
                    label={'Изображение акции (512 x 360)'}
                    name={'secondaryBanner'}
                    testId={'secondaryBanner'}
                    width={'10rem'}
                    height={'10rem'}
                    setImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('pageId', `${page._id}`);

                        fetch('/api/update-page-secondary-banner', {
                          method: 'POST',
                          body: formData,
                        })
                          .then((res) => {
                            return res.json();
                          })
                          .then((json) => {
                            if (json.success) {
                              router.reload();
                              return;
                            }
                            hideLoading();
                            showErrorNotification({ title: json.message });
                          })
                          .catch(() => {
                            hideLoading();
                            showErrorNotification({ title: 'error' });
                          });
                      }
                    }}
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

const PageDetailsPage: NextPage<PageDetailsPageInterface> = ({
  pageUrls,
  page,
  currentCompany,
  cities,
}) => {
  return (
    <AppLayout title={`${page.name}`} pageUrls={pageUrls}>
      <PageDetailsPageConsumer page={page} cities={cities} currentCompany={currentCompany} />
    </AppLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageDetailsPageInterface>> => {
  const { query } = context;
  const { pageId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !pageId || !props.currentCompany) {
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
      currentCompany: props.currentCompany,
    },
  };
};

export default PageDetailsPage;
