import {
  ASSETS_DIST_PAGES,
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGE_EDITOR_DEFAULT_VALUE,
  PAGE_STATE_DRAFT,
  PAGE_STATE_PUBLISHED,
} from '../../../../config/common';
import { PageModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const pages: PageModel[] = [
  {
    _id: getObjectId('page a'),
    index: 0,
    slug: 'page_a',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page A',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`/assets/${ASSETS_DIST_PAGES}/page_a/page_a.jpg`],
    pagesGroupId: getObjectId('pages group a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PAGES}/page_a/page_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_a/main-banner.jpg`,
    },
    mainBannerMobile: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_a/main-banner-mobile.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_a/secondary-banner-1.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page b'),
    index: 1,
    slug: 'page_b',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page B',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`/assets/${ASSETS_DIST_PAGES}/page_b/page_b.jpg`],
    pagesGroupId: getObjectId('pages group a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PAGES}/page_b/page_b.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header B"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_b/main-banner.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_b/secondary-banner-2.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page c'),
    index: 0,
    slug: 'page_c',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page C',
    },
    assetKeys: [],
    pagesGroupId: getObjectId('pages group b'),
    state: PAGE_STATE_DRAFT,
    content: JSON.stringify(PAGE_EDITOR_DEFAULT_VALUE),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page d'),
    index: 0,
    slug: 'page_d',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page D',
    },
    assetKeys: [`/assets/${ASSETS_DIST_PAGES}/page_d/page_d.jpg`],
    pagesGroupId: getObjectId('pages group c'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PAGES}/page_d/page_d.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header D"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_d/main-banner.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `/assets/${ASSETS_DIST_PAGES}/page_d/secondary-banner-3.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page e'),
    index: 1,
    slug: 'page_e',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page E',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`/assets/${ASSETS_DIST_PAGES}/page_e/page_e.jpg`],
    pagesGroupId: getObjectId('pages group c'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PAGES}/page_e/page_e.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header E"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('company page a'),
    index: 0,
    slug: 'company_page_a',
    citySlug: DEFAULT_CITY,
    companySlug: 'company_a',
    nameI18n: {
      [DEFAULT_LOCALE]: 'Company page a',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`/assets/${ASSETS_DIST_PAGES}/company_page_a/company_page_a.jpg`],
    pagesGroupId: getObjectId('company pages group a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"/assets/${ASSETS_DIST_PAGES}/company_page_a/company_page_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header E"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = pages;
