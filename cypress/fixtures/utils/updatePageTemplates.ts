import { DEFAULT_COMPANY_SLUG } from '../../../config/common';
import { PagesGroupTemplateModel, PagesTemplateModel } from '../../../db/dbModels';
import path from 'path';
import { COL_PAGE_TEMPLATES, COL_PAGES_GROUP_TEMPLATES } from '../../../db/collectionNames';
import { MongoClient } from 'mongodb';
require('dotenv').config();

const pages = [
  {
    _id: {
      $oid: '60e58f5423c05000084dfb93',
    },
    nameI18n: {
      ru: 'Описание компании',
    },
    descriptionI18n: {
      ru: 'Ваша компания',
    },
    index: 1,
    pagesGroupId: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    citySlug: 'msk',
    slug: 'vasha_kompaniya',
    content:
      '{"id":"1","version":1,"rows":[{"id":"utt8c9","cells":[{"id":"a5vres","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваша компания"}]}]}},"rows":[],"inline":null}]},{"id":"39mwyp","cells":[{"id":"f6jy8b","size":12,"rows":[{"id":"xnusnv","cells":[{"id":"oyn6ps","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"ru":{"src":"https://winepoint.storage.yandexcloud.net/pages/undefined/1625657327266-2.jpg"}},"rows":[],"inline":null},{"id":"esdi97","size":6,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-THREE","children":[{"text":"На этой странице будет красочно описано о том, какая у вас замечательная компания и как останутся ваши клиенты довольны от сотрудничества с вами."}]}]}},"rows":[],"inline":null}]}],"inline":null,"dataI18n":null}]}]}',
    assetKeys: ['https://winepoint.storage.yandexcloud.net/pages/undefined/1625657327266-2.jpg'],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-07T11:26:12.639Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:06:22.516Z',
    },
  },
  {
    _id: {
      $oid: '60e5904ea52fcf00090a61c9',
    },
    nameI18n: {
      ru: 'Ваши вакансии',
    },
    descriptionI18n: {
      ru: 'Ваши вакансии',
    },
    index: 2,
    pagesGroupId: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    citySlug: 'msk',
    slug: 'vashi_vakansii',
    content:
      '{"id":"1","version":1,"rows":[{"id":"f2ifp7","cells":[{"id":"6mw3t0","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваши вакансии"}]}]}},"rows":[],"inline":null}]},{"id":"cicwok","cells":[{"id":"lgyor4","size":12,"rows":[{"id":"udhupt","cells":[{"id":"tfpplh","size":6,"plugin":{"id":"ory/editor/core/content/image","version":1},"dataI18n":{"ru":{"src":"https://winepoint.storage.yandexcloud.net/pages/undefined/1625657585801-2.jpg"}},"inline":"right","rows":[]},{"id":"0l5xje","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-THREE","children":[{"text":"Тут вы опишете как это приятно и выгодно работать в вашей компании. "}]}]}},"hasInlineNeighbour":"tfpplh","rows":[]}]}],"inline":null,"dataI18n":null}]}]}',
    assetKeys: ['https://winepoint.storage.yandexcloud.net/pages/undefined/1625657585801-2.jpg'],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-07T11:30:22.102Z',
    },
    updatedAt: {
      $date: '2021-07-07T11:33:25.968Z',
    },
  },
  {
    _id: {
      $oid: '60e5912ba52fcf00090a61ca',
    },
    nameI18n: {
      ru: 'Ваш блог',
    },
    descriptionI18n: {
      ru: 'Ваш блог',
    },
    index: 3,
    pagesGroupId: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    citySlug: 'msk',
    slug: 'vash_blog',
    content:
      '{"id":"1","version":1,"rows":[{"id":"akzt56","cells":[{"id":"d3nudi","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваш блог"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-07T11:34:03.917Z',
    },
    updatedAt: {
      $date: '2021-07-07T11:34:54.494Z',
    },
  },
  {
    _id: {
      $oid: '60e594bd23c05000084dfba4',
    },
    nameI18n: {
      ru: 'Бонусная программа',
    },
    descriptionI18n: {
      ru: 'Мощный функционал вашей программы лояльности на базе нашего ресурса позволит повысить продажи от постоянных клиентов. ',
    },
    index: 1,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'bonusnaya_programma',
    content:
      '{"id":"1","version":1,"rows":[{"id":"b1b94m","cells":[{"id":"j7ic7e","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваша привлекательная бонусная программа"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-07T11:49:17.541Z',
    },
    updatedAt: {
      $date: '2021-07-07T12:27:34.631Z',
    },
    mainBanner: {
      index: 2,
      url: 'https://winepoint.storage.yandexcloud.net/pages/bonusnaya_programma/1625660497500-2.jpg',
    },
    showAsMainBanner: true,
  },
  {
    _id: {
      $oid: '60e59e667a682d0008add165',
    },
    nameI18n: {
      ru: 'Дегустации',
    },
    descriptionI18n: {
      ru: 'Приглашайте своих клиентов с их друзьями на ваши интересные дегустации и повышая лояльность. ',
    },
    index: 2,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'degustatsii',
    content:
      '{"id":"1","version":1,"rows":[{"id":"fsyqlm","cells":[{"id":"mtglc4","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваши дегустации"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-07T12:30:30.833Z',
    },
    updatedAt: {
      $date: '2021-07-07T12:32:59.713Z',
    },
    showAsMainBanner: true,
    mainBanner: {
      index: 2,
      url: 'https://winepoint.storage.yandexcloud.net/pages/degustatsii/1625661179217-2.jpg',
    },
  },
  {
    _id: {
      $oid: '60e6eaf7c1cbb80009ae42e4',
    },
    nameI18n: {
      ru: 'Политика конфиденциальности',
    },
    descriptionI18n: {
      ru: 'Политика конфиденциальности',
    },
    index: 4,
    pagesGroupId: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    citySlug: 'msk',
    slug: 'politika_konfidentsialnosti',
    content:
      '{"id":"1","version":1,"rows":[{"id":"8ai3im","cells":[{"id":"sq76pg","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Политика конфиденциальности"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T12:09:27.450Z',
    },
    updatedAt: {
      $date: '2021-07-08T12:09:42.291Z',
    },
  },
  {
    _id: {
      $oid: '60e6f7eb772c210008ad0395',
    },
    nameI18n: {
      ru: 'Отзывы ваших клиентов',
    },
    descriptionI18n: {
      ru: 'Отзывы клиентов',
    },
    index: 5,
    pagesGroupId: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    citySlug: 'msk',
    slug: 'otzivi_klientov',
    content:
      '{"id":"1","version":1,"rows":[{"id":"iw7p2u","cells":[{"id":"ly2135","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Отзывы клиентов"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:04:43.940Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:06:46.085Z',
    },
  },
  {
    _id: {
      $oid: '60e7023a6d93130009dfee47',
    },
    nameI18n: {
      ru: 'Покупка и оплата',
    },
    descriptionI18n: {
      ru: 'Покупка и оплата',
    },
    index: 3,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'pokupka_i_oplata',
    content:
      '{"id":"1","version":1,"rows":[{"id":"bglyvf","cells":[{"id":"adtiwm","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Покупка и оплата"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:48:42.238Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:49:01.112Z',
    },
  },
  {
    _id: {
      $oid: '60e7025ea0edfa00073097e6',
    },
    nameI18n: {
      ru: 'Гарантии',
    },
    descriptionI18n: {
      ru: 'Гарантии',
    },
    index: 4,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'garantii',
    content:
      '{"id":"1","version":1,"rows":[{"id":"k2ocmk","cells":[{"id":"mywuyg","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Гарантии"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:49:18.484Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:49:33.332Z',
    },
  },
  {
    _id: {
      $oid: '60e7027f6d93130009dfee48',
    },
    nameI18n: {
      ru: 'Статус заявки',
    },
    descriptionI18n: {
      ru: 'Статус заявки',
    },
    index: 5,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'status_zayavki',
    content:
      '{"id":"1","version":1,"rows":[{"id":"szwnoq","cells":[{"id":"s3265y","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Статус заявки"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:49:51.634Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:50:03.295Z',
    },
  },
  {
    _id: {
      $oid: '60e70333a0edfa00073097e7',
    },
    nameI18n: {
      ru: 'Ваши акции и предложения',
    },
    descriptionI18n: {
      ru: 'Ваши акции и предложения',
    },
    index: 6,
    pagesGroupId: {
      $oid: '60e58f1723c05000084dfb90',
    },
    citySlug: 'msk',
    slug: 'vashi_aktsii_i_predlozheniya',
    content:
      '{"id":"1","version":1,"rows":[{"id":"uw3gr4","cells":[{"id":"g9wn63","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ваши акции и предложения"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:52:51.962Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:53:29.270Z',
    },
    showAsSecondaryBanner: true,
    secondaryBanner: {
      index: 2,
      url: 'https://winepoint.storage.yandexcloud.net/pages/vashi_aktsii_i_predlozheniya/1625752408572-2.jpg',
    },
  },
  {
    _id: {
      $oid: '60e703996d93130009dfee4d',
    },
    nameI18n: {
      ru: 'Шотландский виски',
    },
    descriptionI18n: {
      ru: 'Шотландский виски',
    },
    index: 1,
    pagesGroupId: {
      $oid: '60e703886d93130009dfee4c',
    },
    citySlug: 'msk',
    slug: 'shotlandskii_viski',
    content:
      '{"id":"1","version":1,"rows":[{"id":"zulb8p","cells":[{"id":"8ihvp0","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Шотландский виски"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:54:33.272Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:55:03.482Z',
    },
  },
  {
    _id: {
      $oid: '60e703cb6d93130009dfee4e',
    },
    nameI18n: {
      ru: 'Ром Bacardi',
    },
    descriptionI18n: {
      ru: 'Ром Bacardi',
    },
    index: 2,
    pagesGroupId: {
      $oid: '60e703886d93130009dfee4c',
    },
    citySlug: 'msk',
    slug: 'rom_bacardi',
    content:
      '{"id":"1","version":1,"rows":[{"id":"zo4ule","cells":[{"id":"hq8ubi","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Ром Bacardi"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:55:23.474Z',
    },
    updatedAt: {
      $date: '2021-07-08T13:55:36.262Z',
    },
  },
  {
    _id: {
      $oid: '60e704726d93130009dfee4f',
    },
    nameI18n: {
      ru: 'Лучшие вина 2021 года',
    },
    descriptionI18n: {
      ru: 'Лучшие вина 2021 года',
    },
    index: 1,
    pagesGroupId: {
      $oid: '60e58f2923c05000084dfb92',
    },
    citySlug: 'msk',
    slug: 'luchshie_vina_2021_goda',
    content:
      '{"id":"1","version":1,"rows":[{"id":"2omxpi","cells":[{"id":"xo6asc","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Лучшие вина 2021 года"}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T13:58:10.653Z',
    },
    updatedAt: {
      $date: '2021-07-08T14:01:43.100Z',
    },
    secondaryBanner: {
      index: 2,
      url: 'https://winepoint.storage.yandexcloud.net/pages/luchshie_vina_2021_goda/1625752897421-2.jpg',
    },
    showAsSecondaryBanner: true,
  },
  {
    _id: {
      $oid: '60e7059a6d93130009dfee56',
    },
    nameI18n: {
      ru: 'Вина с высоким рейтингом до 1000 руб.',
    },
    descriptionI18n: {
      ru: 'Вина с высоким рейтингом до 1000 руб.',
    },
    index: 2,
    pagesGroupId: {
      $oid: '60e58f2923c05000084dfb92',
    },
    citySlug: 'msk',
    slug: 'vina_s_visokim_reitingom_do_1000_rub',
    content:
      '{"id":"1","version":1,"rows":[{"id":"flbp8u","cells":[{"id":"j4v058","size":12,"plugin":{"id":"ory/editor/core/content/slate","version":1},"dataI18n":{"ru":{"slate":[{"type":"HEADINGS/HEADING-ONE","children":[{"text":"Вина с высоким рейтингом до 1000 руб."}]}]}},"rows":[],"inline":null}]}]}',
    assetKeys: [],
    state: 'published',
    companySlug: 'vasha_kompaniya_000010',
    createdAt: {
      $date: '2021-07-08T14:03:06.129Z',
    },
    updatedAt: {
      $date: '2021-07-08T14:04:24.887Z',
    },
    secondaryBanner: {
      index: 2,
      url: 'https://winepoint.storage.yandexcloud.net/pages/vina_s_visokim_reitingom_do_1000_rub/1625753046247-2.jpg',
    },
    showAsSecondaryBanner: true,
  },
];

const pageGroups = [
  {
    _id: {
      $oid: '60e58f0c23c05000084dfb8f',
    },
    nameI18n: {
      ru: 'Ваша компания',
    },
    index: 1,
    companySlug: 'vasha_kompaniya_000010',
    showInFooter: true,
    showInHeader: true,
  },
  {
    _id: {
      $oid: '60e58f1723c05000084dfb90',
    },
    nameI18n: {
      ru: 'Вашим клиентам',
    },
    index: 2,
    companySlug: 'vasha_kompaniya_000010',
    showInFooter: true,
    showInHeader: true,
  },
  {
    _id: {
      $oid: '60e58f2923c05000084dfb92',
    },
    nameI18n: {
      ru: 'Ваши подборки',
    },
    index: 4,
    companySlug: 'vasha_kompaniya_000010',
    showInFooter: true,
    showInHeader: true,
  },
  {
    _id: {
      $oid: '60e703886d93130009dfee4c',
    },
    nameI18n: {
      ru: 'Ваши интересности',
    },
    index: 5,
    companySlug: 'vasha_kompaniya_000010',
    showInFooter: true,
    showInHeader: true,
  },
];

async function getDatabase() {
  const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');
  const uri = process.env.PROD_MONGO_URL;
  if (!uri) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.PROD_MONGO_DB_NAME,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
  };

  // Create connection
  const client = await MongoClient.connect(uri, options);

  // Select the database through the connection
  return client.db(process.env.PROD_MONGO_DB_NAME);
}

async function updatePageTemplates() {
  const db = await getDatabase();

  console.log('Updating page templates');

  const timeStart = new Date().getTime();
  const pageTemplatesCollection = db.collection<PagesTemplateModel>(COL_PAGE_TEMPLATES);
  const pagesGroupTemplatesCollection =
    db.collection<PagesGroupTemplateModel>(COL_PAGES_GROUP_TEMPLATES);

  for await (const pagesGroup of pageGroups) {
    const groupPages = pages.filter(({ pagesGroupId }) => {
      return pagesGroupId.$oid === pagesGroup._id.$oid;
    });

    const createdPagesGroupResult = await pagesGroupTemplatesCollection.insertOne({
      nameI18n: pagesGroup.nameI18n,
      index: pagesGroup.index,
      companySlug: DEFAULT_COMPANY_SLUG,
      showInHeader: pagesGroup.showInHeader,
      showInFooter: pagesGroup.showInFooter,
    });
    const createdPagesGroup = createdPagesGroupResult.ops[0];
    if (!createdPagesGroupResult.result.ok || !createdPagesGroup) {
      continue;
    }

    for await (const groupPage of groupPages) {
      await pageTemplatesCollection.insertOne({
        nameI18n: groupPage.nameI18n,
        descriptionI18n: groupPage.descriptionI18n,
        index: groupPage.index,
        pagesGroupId: createdPagesGroup._id,
        citySlug: groupPage.citySlug,
        slug: groupPage.slug,
        content: groupPage.content,
        assetKeys: [],
        state: groupPage.state as any,
        companySlug: DEFAULT_COMPANY_SLUG,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  console.log('Total time: ', new Date().getTime() - timeStart);
}

(() => {
  updatePageTemplates()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
