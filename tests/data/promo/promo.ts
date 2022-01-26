import {
  ASSETS_DIST_PROMO,
  DEFAULT_LOCALE,
  ONE_WEEK,
  TEXT_HORIZONTAL_ALIGN_OPTIONS,
  TEXT_HORIZONTAL_FLEX_OPTIONS,
  TEXT_VERTICAL_FLEX_OPTIONS,
} from '../../../config/common';
import { PromoModel } from '../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const promo: PromoModel[] = [
  {
    _id: getObjectId('promo a'),
    slug: '000001',
    companyId: getObjectId('company Company A'),
    companySlug: 'company_a',
    nameI18n: {
      [DEFAULT_LOCALE]: 'Promo A',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },

    // discount
    discountPercent: 10,
    addCategoryDiscount: true,
    useBiggestDiscount: false,

    // cashback
    cashbackPercent: 10,
    addCategoryCashback: true,
    useBiggestCashback: false,
    allowPayFromCashback: true,

    // ui configs
    showAsPromoPage: true,
    assetKeys: [`/assets/${ASSETS_DIST_PROMO}/promo_a/page_a.jpg`],
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PROMO}/promo_a/page_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,

    // main banner
    showAsMainBanner: true,
    mainBanner: `/assets/${ASSETS_DIST_PROMO}/promo_a/main-banner.jpg`,
    mainBannerMobile: `/assets/${ASSETS_DIST_PROMO}/promo_a/main-banner-mobile.jpg`,
    mainBannerTextColor: '#000000',
    mainBannerVerticalTextAlign: TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
    mainBannerHorizontalTextAlign: TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
    mainBannerTextAlign: TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
    mainBannerTextPadding: 1,
    mainBannerTextMaxWidth: 20,

    //secondary banner
    showAsSecondaryBanner: true,
    secondaryBanner: `/assets/${ASSETS_DIST_PROMO}/promo_a/secondary-banner-1.jpg`,
    secondaryBannerTextColor: '#000000',
    secondaryBannerVerticalTextAlign: TEXT_VERTICAL_FLEX_OPTIONS[0]._id,
    secondaryBannerHorizontalTextAlign: TEXT_HORIZONTAL_FLEX_OPTIONS[0]._id,
    secondaryBannerTextAlign: TEXT_HORIZONTAL_ALIGN_OPTIONS[0]._id,
    secondaryBannerTextPadding: 1,
    secondaryBannerTextMaxWidth: 10,

    // dates
    updatedAt: new Date(),
    createdAt: new Date(),
    startAt: new Date(),
    endAt: new Date(new Date().getTime() + ONE_WEEK),
  },
];

// @ts-ignore
export = promo;
