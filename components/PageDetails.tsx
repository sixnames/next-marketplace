import Button from 'components/Button';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import { PAGE_STATE_DRAFT, PAGE_STATE_PUBLISHED } from 'config/common';
import { CityInterface, PageInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { PageState, useUpdatePageMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, {
  AppContentWrapperBreadCrumbs,
} from 'layout/AppLayout/AppContentWrapper';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updatePageSchema } from 'validation/pagesSchema';

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

const sectionClassName = 'border-t border-border-color pt-8 mt-12';

export interface PageDetailsInterface {
  page: PageInterface;
  cities: CityInterface[];
  breadcrumbs?: AppContentWrapperBreadCrumbs;
}

const PageDetails: React.FC<PageDetailsInterface> = ({ page, cities, breadcrumbs }) => {
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
                  mainBannerTextColor: values.mainBannerTextColor,
                  mainBannerTextPadding: noNaN(values.mainBannerTextPadding),
                  showAsSecondaryBanner: values.showAsSecondaryBanner,
                  secondaryBannerTextColor: values.secondaryBannerTextColor,
                  secondaryBannerTextPadding: noNaN(values.secondaryBannerTextPadding),
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

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Слайдер на главной странице
                    </Title>

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

                    <FormikInput
                      label={'Цвет текскта слайда.'}
                      name={'mainBannerTextColor'}
                      type={'color'}
                    />

                    <FormikInput
                      label={'Отступ текста от верхнего края слайда (%)'}
                      name={'mainBannerTextPadding'}
                      type={'number'}
                    />
                  </div>

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Акции на главной странице
                    </Title>

                    <FormikCheckboxLine
                      label={'Показывать в блоке Акции на главной странице'}
                      name={'showAsSecondaryBanner'}
                    />

                    <FormikImageUpload
                      label={'Изображение акции (315 x 220)'}
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

                    <FormikInput
                      label={'Цвет текскта акции'}
                      name={'secondaryBannerTextColor'}
                      type={'color'}
                    />

                    <FormikInput
                      label={'Отступ текста от верхнего края акции (%)'}
                      name={'secondaryBannerTextPadding'}
                      type={'number'}
                    />
                  </div>

                  <div className={sectionClassName}>
                    <Button type={'submit'} testId={'submit-page'}>
                      Сохранить
                    </Button>
                  </div>

                  <div className={sectionClassName}>
                    <Title tag={'div'} size={'small'}>
                      Контент страницы
                    </Title>
                    <PageEditor
                      value={values.content}
                      setValue={(value) => {
                        setFieldValue('content', value);
                      }}
                      imageUpload={async (file) => {
                        try {
                          const formData = new FormData();
                          formData.append('pageId', `${page._id}`);
                          formData.append('assets', file);

                          const responseFetch = await fetch('/api/add-page-asset', {
                            method: 'POST',
                            body: formData,
                          });
                          const responseJson = await responseFetch.json();

                          return {
                            url: responseJson.url,
                          };
                        } catch (e) {
                          console.log(e);
                          return {
                            url: '',
                          };
                        }
                      }}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

export default PageDetails;
