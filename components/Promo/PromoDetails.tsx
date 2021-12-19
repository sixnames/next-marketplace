import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  REQUEST_METHOD_POST,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
} from '../../config/common';
import { CompanyInterface, PromoInterface } from '../../db/uiInterfaces';
import { useUpdatePromo } from '../../hooks/mutations/usePromoMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { noNaN } from '../../lib/numbers';
import { updatePromoSchema } from '../../validation/promoSchema';
import WpButton from '../button/WpButton';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikDatePicker from '../FormElements/Input/FormikDatePicker';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import FormikImageUpload from '../FormElements/Upload/FormikImageUpload';
import Inner from '../Inner';
import PageEditor from '../PageEditor';
import WpTitle from '../WpTitle';

export interface PromoDetailsInterface {
  promo: PromoInterface;
  basePath: string;
  pageCompany: CompanyInterface;
}

const sectionClassName = 'border-t border-border-300 pt-8 mt-12';

const PromoDetails: React.FC<PromoDetailsInterface> = ({ promo }) => {
  const router = useRouter();
  const validationSchema = useValidationSchema({
    schema: updatePromoSchema,
  });
  const { showLoading, hideLoading, showErrorNotification } = useMutationCallbacks({
    reload: true,
  });
  const [updatePromoMutation] = useUpdatePromo();

  return (
    <Inner testId={'promo-details-page'}>
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
        }}
        onSubmit={(values) => {
          showLoading();
          updatePromoMutation({
            _id: `${values._id}`,
            nameI18n: values.nameI18n,
            descriptionI18n: values.descriptionI18n,

            // discount
            discountPercent: values.discountPercent,
            addCategoryDiscount: values.addCategoryDiscount,
            useBiggestDiscount: values.useBiggestDiscount,

            // cashback
            cashbackPercent: values.cashbackPercent,
            addCategoryCashback: values.addCategoryCashback,
            useBiggestCashback: values.useBiggestCashback,
            allowPayFromCashback: values.allowPayFromCashback,

            // ui configs
            showAsPromoPage: values.showAsPromoPage,
            content: JSON.stringify(values.content),

            // main banner
            showAsMainBanner: values.showAsMainBanner,
            mainBannerTextColor: values.mainBannerTextColor,
            mainBannerVerticalTextAlign: values.mainBannerVerticalTextAlign,
            mainBannerHorizontalTextAlign: values.mainBannerHorizontalTextAlign,
            mainBannerTextAlign: values.mainBannerTextAlign,
            mainBannerTextPadding: noNaN(values.mainBannerTextPadding),
            mainBannerTextMaxWidth: noNaN(values.mainBannerTextMaxWidth),

            //secondary banner
            showAsSecondaryBanner: values.showAsSecondaryBanner,
            secondaryBannerTextColor: values.secondaryBannerTextColor,
            secondaryBannerVerticalTextAlign: values.secondaryBannerVerticalTextAlign,
            secondaryBannerHorizontalTextAlign: values.secondaryBannerHorizontalTextAlign,
            secondaryBannerTextAlign: values.secondaryBannerTextAlign,
            secondaryBannerTextPadding: noNaN(values.secondaryBannerTextPadding),
            secondaryBannerTextMaxWidth: noNaN(values.secondaryBannerTextMaxWidth),

            // dates
            endAt: values.endAt,
            startAt: values.startAt,
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

                {/*discount*/}
                <FormikInput
                  label={'Скидка %'}
                  name={'discountPercent'}
                  testId={'discountPercent'}
                  type={'number'}
                  min={0}
                  showInlineError
                  isRequired
                />

                <FormikCheckboxLine
                  label={'Плюсовать скидку категории пользователя'}
                  name={'addCategoryDiscount'}
                />

                <FormikCheckboxLine
                  label={
                    'Использвоать большее заначение скидки относительно акции и категории пользователя'
                  }
                  name={'useBiggestDiscount'}
                />

                {/*cashback*/}
                <FormikInput
                  label={'Кэшбэк %'}
                  name={'cashbackPercent'}
                  testId={'cashbackPercent'}
                  type={'number'}
                  min={0}
                  showInlineError
                  isRequired
                />

                <FormikCheckboxLine
                  label={'Плюсовать кэшбэк категории пользователя'}
                  name={'addCategoryCashback'}
                />

                <FormikCheckboxLine
                  label={
                    'Использвоать большее заначение кэшбэка относительно акции и категории пользователя'
                  }
                  name={'useBiggestCashback'}
                />

                <FormikCheckboxLine
                  label={'Разрешается оплата кэшбэком'}
                  name={'allowPayFromCashback'}
                />

                {/*dates*/}
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

                {/*ui*/}
                <div className={sectionClassName}>
                  <WpTitle tag={'div'} size={'small'}>
                    Слайдер на главной странице
                  </WpTitle>

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
                  <WpTitle tag={'div'} size={'small'}>
                    Акции на главной странице
                  </WpTitle>

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
                  <WpButton type={'submit'} testId={'submit-promo'}>
                    Сохранить
                  </WpButton>
                </div>

                <div className={sectionClassName}>
                  <WpTitle tag={'div'} size={'small'}>
                    Контент страницы
                  </WpTitle>
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
  );
};

export default PromoDetails;
