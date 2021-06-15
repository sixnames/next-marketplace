import {
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
    nameI18n: {
      ru: 'Page A',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/pages/page_a/page_a.jpg`],
    pagesGroupId: getObjectId('pages group a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/pages/page_a/page_a.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header A"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page b'),
    index: 1,
    slug: 'page_b',
    nameI18n: {
      ru: 'Page B',
    },
    assetKeys: [`https://${process.env.OBJECT_STORAGE_DOMAIN}/pages/page_b/page_b.jpg`],
    pagesGroupId: getObjectId('pages group a'),
    state: PAGE_STATE_PUBLISHED,
    content: `{"id":"1","version":1,"rows":[{"id":"el2yzj","cells":[{"id":"ppcfbj","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"default":{"src":"https://${process.env.OBJECT_STORAGE_DOMAIN}/pages/page_b/page_b.jpg"}},"rows":[],"inline":null},{"id":"hzq58d","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"default":{"slate":[{"children":[{"text":"Header B"}],"type":"HEADINGS/HEADING-ONE"},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]},{"children":[{"text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, amet aperiam aspernatur beatae commodi ea eos explicabo fuga iste necessitatibus porro, quam quia repellat sapiente sequi tempora ullam voluptas?"}]}]}},"rows":[],"inline":null}]}]}`,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    _id: getObjectId('page c'),
    index: 0,
    slug: 'page_c',
    nameI18n: {
      ru: 'Page C',
    },
    assetKeys: [],
    pagesGroupId: getObjectId('pages group b'),
    state: PAGE_STATE_DRAFT,
    content: JSON.stringify(PAGE_EDITOR_DEFAULT_VALUE),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

// @ts-ignore
export = pages;
