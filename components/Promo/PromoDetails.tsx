import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as React from 'react';
import { CompanyInterface, PromoInterface } from '../../db/uiInterfaces';
import { useUpdatePromo } from '../../hooks/mutations/usePromoMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import {
  REQUEST_METHOD_POST,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
} from '../../lib/config/common';
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
          mainBanner: [promo.mainBanner],
          mainBannerMobile: [promo.mainBannerMobile],
          secondaryBanner: [promo.secondaryBanner],
          content: JSON.parse(promo.content),
        }}
        onSubmit={(values) => {
          showLoading();
          updatePromoMutation({
            _id: `${values._id}`,
            nameI18n: values.nameI18n,
            descriptionI18n: values.descriptionI18n || {},
            titleI18n: values.titleI18n || {},

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
            showAsMainBanner: values.showAsMainBanner || false,
            mainBannerTextColor: values.mainBannerTextColor || '#000000',
            mainBannerVerticalTextAlign:
              values.mainBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
            mainBannerHorizontalTextAlign:
              values.mainBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
            mainBannerTextAlign: values.mainBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
            mainBannerTextPadding: noNaN(values.mainBannerTextPadding),
            mainBannerTextMaxWidth: noNaN(values.mainBannerTextMaxWidth),

            //secondary banner
            showAsSecondaryBanner: values.showAsSecondaryBanner || false,
            secondaryBannerTextColor: values.secondaryBannerTextColor || '#000000',
            secondaryBannerVerticalTextAlign:
              values.secondaryBannerVerticalTextAlign || TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
            secondaryBannerHorizontalTextAlign:
              values.secondaryBannerHorizontalTextAlign || TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
            secondaryBannerTextAlign:
              values.secondaryBannerTextAlign || TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
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
                  label={'????????????????'}
                  name={'nameI18n'}
                  testId={'name'}
                  showInlineError
                  isRequired
                />

                <FormikTranslationsInput
                  label={'?????????????????? ?????? ????????-???????? title'}
                  name={'titleI18n'}
                  testId={'title'}
                  showInlineError
                  isRequired
                />

                <FormikTranslationsInput
                  label={'????????????????'}
                  name={'descriptionI18n'}
                  testId={'description'}
                  showInlineError
                  isRequired
                />

                {/*discount*/}
                <FormikInput
                  label={'???????????? %'}
                  name={'discountPercent'}
                  testId={'discountPercent'}
                  type={'number'}
                  min={0}
                  showInlineError
                  isRequired
                />

                <FormikCheckboxLine
                  label={'?????????????????? ???????????? ?????????????????? ????????????????????????'}
                  name={'addCategoryDiscount'}
                />

                <FormikCheckboxLine
                  label={
                    '???????????????????????? ?????????????? ?????????????????? ???????????? ???????????????????????? ?????????? ?? ?????????????????? ????????????????????????'
                  }
                  name={'useBiggestDiscount'}
                />

                {/*cashback*/}
                <FormikInput
                  label={'???????????? %'}
                  name={'cashbackPercent'}
                  testId={'cashbackPercent'}
                  type={'number'}
                  min={0}
                  showInlineError
                  isRequired
                />

                <FormikCheckboxLine
                  label={'?????????????????? ???????????? ?????????????????? ????????????????????????'}
                  name={'addCategoryCashback'}
                />

                <FormikCheckboxLine
                  label={
                    '???????????????????????? ?????????????? ?????????????????? ?????????????? ???????????????????????? ?????????? ?? ?????????????????? ????????????????????????'
                  }
                  name={'useBiggestCashback'}
                />

                <FormikCheckboxLine
                  label={'?????????????????????? ???????????? ????????????????'}
                  name={'allowPayFromCashback'}
                />

                {/*dates*/}
                <FormikDatePicker
                  label={'???????????? ??????????'}
                  name={'startAt'}
                  testId={'startAt'}
                  showInlineError
                  isRequired
                />

                <FormikDatePicker
                  label={'?????????????????? ??????????'}
                  name={'endAt'}
                  testId={'endAt'}
                  showInlineError
                  isRequired
                />

                {/*ui*/}
                <div className={sectionClassName}>
                  <WpTitle tag={'div'} size={'small'}>
                    ?????????????? ???? ?????????????? ????????????????
                  </WpTitle>

                  <FormikCheckboxLine
                    label={'???????????????????? ?? ???????????????? ???? ?????????????? ????????????????'}
                    name={'showAsMainBanner'}
                  />

                  <FormikImageUpload
                    label={'?????????????????????? ???????????? (1250 x 432)'}
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
                    label={'?????????????????????? ???????????? ?? ?????????????????? ???????????? (380 x 400)'}
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
                    label={'???????? ??????????????.'}
                    name={'mainBannerTextColor'}
                    type={'color'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_ALIGN_OPTIONS}
                    label={'???????????????????????? ??????????????.'}
                    name={'mainBannerTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_FLEX_OPTIONS}
                    label={'???????????????????????????????? ?????????????? ???? ??????????????????????.'}
                    name={'mainBannerVerticalTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_VERTICAL_FLEX_OPTIONS}
                    label={'???????????????????????????????? ?????????????? ???? ??????????????????.'}
                    name={'mainBannerHorizontalTextAlign'}
                  />

                  <FormikInput
                    label={'???????????????????????? ???????????? ???????????? (px)'}
                    name={'mainBannerTextMaxWidth'}
                    type={'number'}
                  />

                  <FormikInput
                    label={'???????????? ???????????? ???? ???????????????? ???????? (%)'}
                    name={'mainBannerTextPadding'}
                    type={'number'}
                  />
                </div>

                <div className={sectionClassName}>
                  <WpTitle tag={'div'} size={'small'}>
                    ?????????? ???? ?????????????? ????????????????
                  </WpTitle>

                  <FormikCheckboxLine
                    label={'???????????????????? ?? ?????????? ?????????? ???? ?????????????? ????????????????'}
                    name={'showAsSecondaryBanner'}
                  />

                  <FormikImageUpload
                    label={'?????????????????????? ?????????? (315 x 220)'}
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
                    label={'???????? ??????????????'}
                    name={'secondaryBannerTextColor'}
                    type={'color'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_ALIGN_OPTIONS}
                    label={'???????????????????????? ??????????????.'}
                    name={'secondaryBannerTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_HORIZONTAL_FLEX_OPTIONS}
                    label={'???????????????????????????????? ?????????????? ???? ??????????????????????.'}
                    name={'secondaryBannerVerticalTextAlign'}
                  />

                  <FormikSelect
                    options={TEXT_VERTICAL_FLEX_OPTIONS}
                    label={'???????????????????????????????? ?????????????? ???? ??????????????????.'}
                    name={'secondaryBannerHorizontalTextAlign'}
                  />

                  <FormikInput
                    label={'???????????????????????? ???????????? ???????????? (px)'}
                    name={'secondaryBannerTextMaxWidth'}
                    type={'number'}
                  />

                  <FormikInput
                    label={'???????????? ???????????? ???? ???????????????? ???????? (%)'}
                    name={'secondaryBannerTextPadding'}
                    type={'number'}
                  />
                </div>

                <div className={sectionClassName}>
                  <WpButton type={'submit'} testId={'submit-promo'}>
                    ??????????????????
                  </WpButton>
                </div>

                <div className={sectionClassName}>
                  <WpTitle tag={'div'} size={'small'}>
                    ?????????????? ????????????????
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
