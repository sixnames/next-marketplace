import { ASSETS_DIST_CONFIGS, DEFAULT_CITY, DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { COL_CONFIGS } from 'db/collectionNames';
import { ConfigModel, ConfigVariantModel, StoreFileFormat } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { Collection, ObjectId } from 'mongodb';
import path from 'path';
import { findOrCreateTestAsset } from 'lib/s3';

type FindOrCreateConfigTemplate = Pick<
  ConfigModel,
  'slug' | 'name' | 'description' | 'variant' | 'multi' | 'cities' | 'acceptedFormats' | '_id'
>;

interface FindOrCreateConfigInterface {
  configTemplate: FindOrCreateConfigTemplate;
  configCollection: Collection<ConfigModel>;
}

async function createConfig({
  configTemplate,
  configCollection,
}: FindOrCreateConfigInterface): Promise<ConfigModel> {
  const config = await configCollection.insertOne({
    ...configTemplate,
  });

  const createdConfig = config.ops[0];

  if (!config.result.ok || !createdConfig) {
    throw Error('Error in findOrCreateConfig');
  }

  return createdConfig;
}

interface StoreConfigWithAssetInterface extends FindOrCreateConfigInterface {
  sourceImage: string;
  format: StoreFileFormat;
}

async function storeConfigWithAsset({
  configTemplate,
  configCollection,
  sourceImage,
}: StoreConfigWithAssetInterface): Promise<ConfigModel> {
  const { slug } = configTemplate;

  const localFilePath = path.join(process.cwd(), 'db', 'initialData', sourceImage);
  const s3Url = await findOrCreateTestAsset({
    localFilePath,
    dist: `${ASSETS_DIST_CONFIGS}/${slug}`,
    fileName: slug,
  });

  return createConfig({
    configCollection,
    configTemplate: {
      ...configTemplate,
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [s3Url],
        },
      },
    },
  });
}

const SITE_CONFIGS_VARIANT_ASSET = 'asset' as ConfigVariantModel;
const SITE_CONFIGS_VARIANT_STRING = 'string' as ConfigVariantModel;
const SITE_CONFIGS_VARIANT_EMAIL = 'email' as ConfigVariantModel;
const SITE_CONFIGS_VARIANT_TEL = 'tel' as ConfigVariantModel;
const SITE_CONFIGS_VARIANT_NUMBER = 'number' as ConfigVariantModel;

export interface CreateTestSiteConfigsPayloadInterface {
  configSiteLogo: ConfigModel;
  configSiteLogoDark: ConfigModel;
  configSiteLogoIcon: ConfigModel;
  configSiteLogoName: ConfigModel;
  configPageDefaultPreviewImage: ConfigModel;
  configSiteName: ConfigModel;
  configContactEmail: ConfigModel;
  configContactPhone: ConfigModel;
  configSiteFoundationYear: ConfigModel;
  configPageDefaultTitle: ConfigModel;
  configPageDefaultDescription: ConfigModel;
  configSiteThemeColor: ConfigModel;
  configStickyNavVisibleAttributesCount: ConfigModel;
  configStickyNavVisibleOptionsCount: ConfigModel;
  configCatalogueFilterVisibleAttributesCount: ConfigModel;
  configCatalogueFilterVisibleOptionsCount: ConfigModel;
  configSeoTextTitle: ConfigModel;
  configSeoText: ConfigModel;
  allConfigs: ConfigModel[];
}

export async function createTestSiteConfigs(): Promise<CreateTestSiteConfigsPayloadInterface> {
  const db = await getDatabase();
  const configCollection = db.collection<ConfigModel>(COL_CONFIGS);

  // Asset configs
  const configSiteLogo = await storeConfigWithAsset({
    configCollection,
    sourceImage: `logo.svg`,
    format: 'svg',
    configTemplate: {
      _id: new ObjectId('604cad81b604c1c320c32683'),
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogo',
      name: 'Логотип сайта для тёмной темы',
      description: 'Полное изображение логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {},
    },
  });

  const configSiteLogoDark = await storeConfigWithAsset({
    configCollection,
    sourceImage: `logo-dark.svg`,
    format: 'svg',
    configTemplate: {
      _id: new ObjectId('604cad81b604c1c320c32684'),
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoDark',
      name: 'Логотип сайта для светлой темы',
      description: 'Полное изображение логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {},
    },
  });

  const configSiteLogoIcon = await storeConfigWithAsset({
    configCollection,
    sourceImage: `logo-icon.svg`,
    format: 'svg',
    configTemplate: {
      _id: new ObjectId('604cad81b604c1c320c32685'),
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoIcon',
      name: 'Иконка логотипа сайта',
      description: 'Иконка логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {},
    },
  });

  const configSiteLogoName = await storeConfigWithAsset({
    configCollection,
    sourceImage: `logo-name.svg`,
    format: 'svg',
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32686'),
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoName',
      name: 'Текст логотипа сайта',
      description: 'Текст логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {},
    },
  });

  const configPageDefaultPreviewImage = await storeConfigWithAsset({
    configCollection,
    sourceImage: `og-image.jpg`,
    format: 'jpg',
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32687'),
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'pageDefaultPreviewImage',
      name: 'Дефолтное превью изображение',
      description:
        'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
      multi: false,
      acceptedFormats: ['image/jpeg'],
      cities: {},
    },
  });

  const configSiteName = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32688'),
      variant: SITE_CONFIGS_VARIANT_STRING,
      slug: 'siteName',
      name: 'Название сайта',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`Site`],
        },
      },
    },
  });

  const configContactEmail = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32689'),
      variant: SITE_CONFIGS_VARIANT_EMAIL,
      slug: 'contactEmail',
      name: 'Контактный Email',
      description: 'Контактный Email. Можно добавить несколько.',
      multi: true,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`email@email.com`],
        },
      },
    },
  });

  const configContactPhone = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268a'),
      slug: 'contactPhone',
      name: 'Контактный телефон',
      description: 'Контактный телефон. Можно добавить несколько.',
      variant: SITE_CONFIGS_VARIANT_TEL,
      multi: true,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`+79998887766`],
        },
      },
    },
  });

  const configSiteFoundationYear = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268b'),
      slug: 'siteFoundationYear',
      name: 'Год основания сайта',
      description: '',
      variant: SITE_CONFIGS_VARIANT_NUMBER,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`2021`],
        },
      },
    },
  });

  const configPageDefaultTitle = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268c'),
      slug: 'pageDefaultTitle',
      name: 'Дефолтный title страницы',
      description: 'Данное поле будет добавлено в атрибут title если страница не имеет такового',
      variant: SITE_CONFIGS_VARIANT_STRING,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`Дефолтный title страницы`],
          [SECONDARY_LOCALE]: [`Page default title`],
        },
      },
    },
  });

  const configPageDefaultDescription = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268d'),
      slug: 'pageDefaultDescription',
      name: 'Дефолтный description страницы',
      description:
        'Данное поле будет добавлено в атрибут description если страница не имеет такового',
      variant: SITE_CONFIGS_VARIANT_STRING,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`Дефолтный description страницы`],
          [SECONDARY_LOCALE]: [`Page default description`],
        },
      },
    },
  });

  const configSiteThemeColor = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268e'),
      slug: 'siteThemeColor',
      name: 'Акцент цвет сайта',
      description:
        'Данный цвет будет использован для акцента ключевых элементов сайта. ВНИМАНИЕ! Цвет должен быть в формате RGB!',
      variant: SITE_CONFIGS_VARIANT_STRING,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['219, 83, 96'],
        },
      },
    },
  });

  const configStickyNavVisibleAttributesCount = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604325cbab3d5114fb2bc07d'),
      slug: 'stickyNavVisibleAttributesCount',
      name: 'Количество видимых аттрибутов в выпадающем меню.',
      description: '',
      variant: SITE_CONFIGS_VARIANT_NUMBER,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['3'],
        },
      },
    },
  });

  const configStickyNavVisibleOptionsCount = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c3268f'),
      slug: 'stickyNavVisibleOptionsCount',
      name: 'Количество видимых опций в выпадающем меню.',
      description: '',
      variant: SITE_CONFIGS_VARIANT_NUMBER,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['3'],
        },
      },
    },
  });

  const configCatalogueFilterVisibleAttributesCount = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604325cbab3d5114fb2bc07f'),
      slug: 'catalogueFilterVisibleOptionsCount',
      name: 'Количество видимых атрибутов в фильтре каталога.',
      description: '',
      variant: SITE_CONFIGS_VARIANT_NUMBER,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['3'],
        },
      },
    },
  });

  const configCatalogueFilterVisibleOptionsCount = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32690'),
      slug: 'catalogueFilterVisibleOptionsCount',
      name: 'Количество видимых опций в фильтре каталога.',
      description: '',
      variant: SITE_CONFIGS_VARIANT_NUMBER,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['3'],
        },
      },
    },
  });

  const configSeoTextTitle = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32691'),
      slug: 'seoTextTitle',
      name: 'Заголовок для SEO-текста',
      description: '',
      variant: SITE_CONFIGS_VARIANT_STRING,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['Заголовок для SEO-текста'],
        },
      },
    },
  });

  const configSeoText = await createConfig({
    configCollection,
    configTemplate: {
      _id: new ObjectId('604cad82b604c1c320c32692'),
      slug: 'seoText',
      name: 'SEO текст.',
      description: 'Для корректного отображения текст должен быть в формате HTML',
      variant: SITE_CONFIGS_VARIANT_STRING,
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [
            `
            <div>
              <p>Купить вино в сети магазинов WineStyle — вас ждет широкий выбор алкогольных напитков со всего света: вы можете купить вино классическое французское (белое французское, красное французское, замковые вина шато, бургундское вино, вина бордо) и итальянское вино (вино кьянти, тоскана), вино Нового света, демократичное и элитное вино, коньяк, виски и подарочные наборы, ну и, разумеется, шампанское и игристые вина.</p>
              <p>Купить алкоголь — в нашем ассортименте коньяк Хеннесси, виски Чивас ригал. В сети винных магазинов WineStyle соблюдаются все условия хранения вин и крепких спиртных напитков, поэтому наши товары всегда отличаются высочайшим качеством. Поиск алкогольных напитков в нашем каталоге — это быстро, современно, удобно!</p>
              <p>Купить вино в сети магазинов WineStyle — вас ждет широкий выбор алкогольных напитков со всего света: вы можете купить вино классическое французское (белое французское, красное французское, замковые вина шато, бургундское вино, вина бордо) и итальянское вино (вино кьянти, тоскана), вино Нового света, демократичное и элитное вино, коньяк, виски и подарочные наборы, ну и, разумеется, шампанское и игристые вина.</p>
              <p>Купить алкоголь — в нашем ассортименте коньяк Хеннесси, виски Чивас ригал. В сети винных магазинов WineStyle соблюдаются все условия хранения вин и крепких спиртных напитков, поэтому наши товары всегда отличаются высочайшим качеством. Поиск алкогольных напитков в нашем каталоге — это быстро, современно, удобно!</p>
            </div>
            `,
          ],
        },
      },
    },
  });

  const allConfigs = [
    configSiteLogo,
    configSiteLogoDark,
    configSiteLogoIcon,
    configSiteLogoName,
    configPageDefaultPreviewImage,
    configSiteName,
    configContactEmail,
    configContactPhone,
    configSiteFoundationYear,
    configPageDefaultTitle,
    configPageDefaultDescription,
    configSiteThemeColor,
    configStickyNavVisibleAttributesCount,
    configStickyNavVisibleOptionsCount,
    configCatalogueFilterVisibleAttributesCount,
    configCatalogueFilterVisibleOptionsCount,
    configSeoTextTitle,
    configSeoText,
  ];

  return {
    allConfigs,
    configSiteLogo,
    configSiteLogoDark,
    configSiteLogoIcon,
    configSiteLogoName,
    configPageDefaultPreviewImage,
    configSiteName,
    configContactEmail,
    configContactPhone,
    configSiteFoundationYear,
    configPageDefaultTitle,
    configPageDefaultDescription,
    configSiteThemeColor,
    configStickyNavVisibleAttributesCount,
    configStickyNavVisibleOptionsCount,
    configCatalogueFilterVisibleAttributesCount,
    configCatalogueFilterVisibleOptionsCount,
    configSeoTextTitle,
    configSeoText,
  };
}
