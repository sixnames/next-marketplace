import { DEFAULT_LOCALE, ONE_WEEK } from '../../../../config/common';
import { PromoModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const promo: PromoModel[] = [
  {
    _id: getObjectId('promo a'),
    companyId: getObjectId('company Company A'),
    slug: '000001',
    companySlug: 'company_a',
    cashbackPercent: 10,
    discountPercent: 10,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Promo A',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/promo/promo_a/promo_a.jpg`],
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/promo/promo_a/promo_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/promo/promo_a/main-banner.jpg`,
    },
    mainBannerMobile: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/promo/promo_a/main-banner-mobile.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/promo/promo_a/secondary-banner-1.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
    startAt: new Date(),
    endAt: new Date(new Date().getTime() + ONE_WEEK),
  },
];

// @ts-ignore
export = promo;
