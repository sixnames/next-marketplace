import {
  ASSETS_DIST_BLOG,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  PAGE_STATE_PUBLISHED,
} from '../../../../config/common';
import { BlogPostModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

require('dotenv').config();

const blogPosts: BlogPostModel[] = [
  {
    _id: getObjectId('post a'),
    slug: 'post_a',
    companySlug: DEFAULT_COMPANY_SLUG,
    titleI18n: {
      [DEFAULT_LOCALE]: 'Post A',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    previewImage: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_a/previewImage.jpg`,
    assetKeys: [
      `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_a/post_a.jpg`,
    ],
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_a/post_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    authorId: getObjectId('admin'),
    selectedOptionsSlugs: [],
    source: 'Source site.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('post b'),
    slug: 'post_b',
    companySlug: DEFAULT_COMPANY_SLUG,
    titleI18n: {
      [DEFAULT_LOCALE]: 'Post B',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    previewImage: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_b/previewImage.jpg`,
    assetKeys: [
      `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_b/post_b.jpg`,
    ],
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_b/post_b.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    authorId: getObjectId('admin'),
    selectedOptionsSlugs: [],
    source: 'Source site-b.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
  {
    _id: getObjectId('post c'),
    slug: 'post_c',
    companySlug: DEFAULT_COMPANY_SLUG,
    titleI18n: {
      [DEFAULT_LOCALE]: 'Post C',
    },
    descriptionI18n: {
      [DEFAULT_LOCALE]:
        'consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos',
    },
    previewImage: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_c/previewImage.jpg`,
    assetKeys: [
      `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_c/post_c.jpg`,
    ],
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_BLOG}/post_c/post_c.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    authorId: getObjectId('admin'),
    selectedOptionsSlugs: [],
    source: 'Source site-c.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    ...DEFAULT_COUNTERS_OBJECT,
  },
];

// @ts-ignore
export = blogPosts;
