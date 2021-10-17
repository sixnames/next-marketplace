import Button from 'components/Button';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import {
  REQUEST_METHOD_POST,
  PAGE_STATE_OPTIONS,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
} from 'config/common';
import { CityInterface, PageInterface, PagesTemplateInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdatePage } from 'hooks/mutations/usePageMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updatePageSchema } from 'validation/pagesSchema';

const sectionClassName = 'border-t border-border-300 pt-8 mt-12';

export interface PageDetailsInterface {
  page: PageInterface | PagesTemplateInterface;
  cities: CityInterface[];
  isTemplate?: boolean;
}

const PageDetails: React.FC<PageDetailsInterface> = ({ page, cities, isTemplate }) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updatePageSchema,
  });
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });
  const [updatePageMutation] = useUpdatePage();

  return (
    <div data-cy={'page-details'}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          ...page,
          mainBanner: [page.mainBanner?.url],
          pageScreenshot: [page.pageScreenshot?.url],
          mainBannerMobile: [page.mainBannerMobile?.url],
          secondaryBanner: [page.secondaryBanner?.url],
          content: JSON.parse(page.content),
          mainBannerTextColor: page.mainBannerTextColor || '#000000',
          mainBannerTextAlign: page.mainBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
          mainBannerVerticalTextAlign:
            page.mainBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
          mainBannerHorizontalTextAlign:
            page.mainBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
          secondaryBannerTextColor: page.secondaryBannerTextColor || '#000000',
          secondaryBannerTextAlign:
            page.secondaryBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
          secondaryBannerVerticalTextAlign:
            page.secondaryBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
          secondaryBannerHorizontalTextAlign:
            page.secondaryBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
        }}
        onSubmit={(values) => {
          showLoading();
          updatePageMutation({
            _id: `${values._id}`,
            content: JSON.stringify(values.content),
            nameI18n: values.nameI18n,
            descriptionI18n: values.descriptionI18n,
            pagesGroupId: `${values.pagesGroupId}`,
            state: values.state,
            citySlug: `${values.citySlug}`,
            index: noNaN(values.index),
            showAsMainBanner: values.showAsMainBanner,
            mainBannerTextColor: values.mainBannerTextColor,
            mainBannerTextAlign: values.mainBannerTextAlign,
            mainBannerVerticalTextAlign: values.mainBannerVerticalTextAlign,
            mainBannerHorizontalTextAlign: values.mainBannerHorizontalTextAlign,
            mainBannerTextPadding: noNaN(values.mainBannerTextPadding),
            mainBannerTextMaxWidth: noNaN(values.mainBannerTextMaxWidth),
            showAsSecondaryBanner: values.showAsSecondaryBanner,
            secondaryBannerTextColor: values.secondaryBannerTextColor,
            secondaryBannerTextAlign: values.secondaryBannerTextAlign,
            secondaryBannerVerticalTextAlign: values.secondaryBannerVerticalTextAlign,
            secondaryBannerHorizontalTextAlign: values.secondaryBannerHorizontalTextAlign,
            secondaryBannerTextPadding: noNaN(values.secondaryBannerTextPadding),
            secondaryBannerTextMaxWidth: noNaN(values.secondaryBannerTextMaxWidth),
            isTemplate,
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
                  firstOption
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
                        if (isTemplate) {
                          formData.append('isTemplate', `${isTemplate}`);
                        }

                        fetch('/api/page/update-page-main-banner', {
                          method: REQUEST_METHOD_POST,
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

                  <FormikImageUpload
                    label={'Изображение слайда в мобильной версии (380 x 400)'}
                    name={'mainBannerMobile'}
                    testId={'mainBannerMobile'}
                    width={'10rem'}
                    height={'10rem'}
                    setImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('pageId', `${page._id}`);
                        formData.append('isMobile', `true`);
                        if (isTemplate) {
                          formData.append('isTemplate', `${isTemplate}`);
                        }

                        fetch('/api/page/update-page-main-banner', {
                          method: REQUEST_METHOD_POST,
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
                    label={'Цвет текскта.'}
                    name={'mainBannerTextColor'}
                    type={'color'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_ALIGN_OPTIONS}
                    label={'Выравнивание текскта.'}
                    name={'mainBannerTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_FLEX_OPTIONS}
                    label={'Позиционирование текскта по горизонтали.'}
                    name={'mainBannerVerticalTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_VERTICAL_FLEX_OPTIONS}
                    label={'Позиционирование текскта по вертикали.'}
                    name={'mainBannerHorizontalTextAlign'}
                  />

                  <FormikInput
                    label={'Максимальная ширина текста (px)'}
                    name={'mainBannerTextMaxWidth'}
                    type={'number'}
                  />

                  <FormikInput
                    label={'Отступ текста от верхнего края (%)'}
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
                        if (isTemplate) {
                          formData.append('isTemplate', `${isTemplate}`);
                        }

                        fetch('/api/page/update-page-secondary-banner', {
                          method: REQUEST_METHOD_POST,
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
                    label={'Цвет текскта'}
                    name={'secondaryBannerTextColor'}
                    type={'color'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_ALIGN_OPTIONS}
                    label={'Выравнивание текскта.'}
                    name={'secondaryBannerTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_FLEX_OPTIONS}
                    label={'Позиционирование текскта по горизонтали.'}
                    name={'secondaryBannerVerticalTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_VERTICAL_FLEX_OPTIONS}
                    label={'Позиционирование текскта по вертикали.'}
                    name={'secondaryBannerHorizontalTextAlign'}
                  />

                  <FormikInput
                    label={'Максимальная ширина текста (px)'}
                    name={'secondaryBannerTextMaxWidth'}
                    type={'number'}
                  />

                  <FormikInput
                    label={'Отступ текста от верхнего края (%)'}
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
                  <FormikImageUpload
                    label={'Скриншот страницы'}
                    name={'pageScreenshot'}
                    testId={'pageScreenshot'}
                    width={'10rem'}
                    height={'10rem'}
                    setImageHandler={(files) => {
                      if (files) {
                        showLoading();
                        const formData = new FormData();
                        formData.append('assets', files[0]);
                        formData.append('pageId', `${page._id}`);
                        if (isTemplate) {
                          formData.append('isTemplate', `${isTemplate}`);
                        }

                        fetch('/api/page/update-page-screenshot', {
                          method: REQUEST_METHOD_POST,
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
                        if (isTemplate) {
                          formData.append('isTemplate', `${isTemplate}`);
                        }

                        const responseFetch = await fetch('/api/page/add-page-asset', {
                          method: REQUEST_METHOD_POST,
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
    </div>
  );
};

export default PageDetails;
