import Button from 'components/Button';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikDatePicker from 'components/FormElements/Input/FormikDatePicker';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikImageUpload from 'components/FormElements/Upload/FormikImageUpload';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import Title from 'components/Title';
import {
  REQUEST_METHOD_POST,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
} from 'config/common';
import { CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdatePromo } from 'hooks/mutations/usePromoMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import ConsolePromoLayout from 'layout/console/ConsolePromoLayout';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { updatePromoSchema } from 'validation/promoSchema';

export interface PromoDetailsInterface {
  promo: PromoInterface;
  basePath: string;
  currentCompany: CompanyInterface;
}

const sectionClassName = 'border-t border-border-300 pt-8 mt-12';

const PromoDetails: React.FC<PromoDetailsInterface> = ({ promo, basePath }) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updatePromoSchema,
  });
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });
  const [updatePromoMutation] = useUpdatePromo();

  return (
    <ConsolePromoLayout promo={promo} basePath={basePath}>
      <Inner testId={'promo-details'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            ...promo,
            startAt: new Date(promo.startAt),
            endAt: new Date(promo.endAt),
            mainBanner: [promo.mainBanner?.url],
            mainBannerMobile: [promo.mainBannerMobile?.url],
            secondaryBanner: [promo.secondaryBanner?.url],
            content: JSON.parse(promo.content),
            mainBannerTextColor: promo.mainBannerTextColor || '#000000',
            mainBannerTextAlign: promo.mainBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
            mainBannerVerticalTextAlign:
              promo.mainBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
            mainBannerHorizontalTextAlign:
              promo.mainBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
            secondaryBannerTextColor: promo.secondaryBannerTextColor || '#000000',
            secondaryBannerTextAlign:
              promo.secondaryBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
            secondaryBannerVerticalTextAlign:
              promo.secondaryBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
            secondaryBannerHorizontalTextAlign:
              promo.secondaryBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
          }}
          onSubmit={(values) => {
            showLoading();
            updatePromoMutation({
              _id: `${values._id}`,
              endAt: values.endAt,
              startAt: values.startAt,
              cashbackPercent: values.cashbackPercent,
              discountPercent: values.discountPercent,
              content: JSON.stringify(values.content),
              nameI18n: values.nameI18n,
              descriptionI18n: values.descriptionI18n,
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
                    label={'Скидка %'}
                    name={'discountPercent'}
                    testId={'discountPercent'}
                    type={'number'}
                    min={0}
                    showInlineError
                    isRequired
                  />

                  <FormikInput
                    label={'Кэшбэк %'}
                    name={'cashbackPercent'}
                    testId={'cashbackPercent'}
                    type={'number'}
                    min={0}
                    showInlineError
                    isRequired
                  />

                  <FormikDatePicker
                    label={'Начало акции'}
                    name={'startAt'}
                    testId={'startAt'}
                    showInlineError
                    isRequired
                  />

                  <FormikDatePicker
                    label={'Окончание акции'}
                    name={'endAt'}
                    testId={'endAt'}
                    showInlineError
                    isRequired
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
                          formData.append('promoId', `${promo._id}`);

                          fetch('/api/promo/update-promo-main-banner', {
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
                          formData.append('promoId', `${promo._id}`);
                          formData.append('isMobile', `true`);

                          fetch('/api/promo/update-promo-main-banner', {
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
                          formData.append('promoId', `${promo._id}`);

                          fetch('/api/promo/update-promo-secondary-banner', {
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
                    <Button type={'submit'} testId={'submit-promo'}>
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
                          formData.append('promoId', `${promo._id}`);
                          formData.append('assets', file);
                          const responseFetch = await fetch('/api/promo/add-promo-asset', {
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
      </Inner>
    </ConsolePromoLayout>
  );
};

export default PromoDetails;
