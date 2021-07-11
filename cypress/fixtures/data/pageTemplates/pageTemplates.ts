import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGE_EDITOR_DEFAULT_VALUE,
  PAGE_STATE_DRAFT,
  PAGE_STATE_PUBLISHED,
} from '../../../../config/common';
import { PagesTemplateModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const pageTemplates: PagesTemplateModel[] = [
  {
    _id: getObjectId('page template a'),
    index: 0,
    slug: 'page_template_a',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page template A',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_a/page_a.jpg`],
    pagesGroupId: getObjectId('pages group template a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_a/page_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_a/main-banner.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_a/secondary-banner-1.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page template b'),
    index: 1,
    slug: 'page_template_b',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page template B',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_b/page_b.jpg`],
    pagesGroupId: getObjectId('pages group template a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_b/page_b.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header B"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_b/main-banner.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_b/secondary-banner-2.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page template c'),
    index: 0,
    slug: 'page_template_c',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page template C',
    },
    assetKeys: [],
    pagesGroupId: getObjectId('pages group template b'),
    state: PAGE_STATE_DRAFT,
    content: JSON.stringify(PAGE_EDITOR_DEFAULT_VALUE),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page template d'),
    index: 0,
    slug: 'page_template_d',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page template D',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_d/page_d.jpg`],
    pagesGroupId: getObjectId('pages group template c'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_d/page_d.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header D"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    showAsMainBanner: true,
    showAsSecondaryBanner: true,
    mainBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_d/main-banner.jpg`,
    },
    secondaryBanner: {
      index: 1,
      url: `https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_d/secondary-banner-3.jpg`,
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page template e'),
    index: 1,
    slug: 'page_template_e',
    citySlug: DEFAULT_CITY,
    companySlug: DEFAULT_COMPANY_SLUG,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Page template E',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_e/page_e.jpg`],
    pagesGroupId: getObjectId('pages group template c'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/templates/page_e/page_e.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header E"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = pageTemplates;
