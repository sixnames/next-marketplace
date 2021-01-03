import { setSharpImage, StoreFileFormat } from '../assets/setSharpImage';
import { Config, ConfigModel, ConfigVariantEnum } from '../../entities/Config';
import { DEFAULT_CITY, DEFAULT_LANG, SECONDARY_LANG } from '@yagu/shared';

type FindOrCreateConfigTemplate = Pick<
  Config,
  | 'slug'
  | 'nameString'
  | 'description'
  | 'variant'
  | 'order'
  | 'multi'
  | 'cities'
  | 'acceptedFormats'
>;

async function findOrCreateConfig(configTemplate: FindOrCreateConfigTemplate): Promise<Config> {
  const entityExists = await ConfigModel.findOne({ slug: configTemplate.slug });
  if (entityExists) {
    return entityExists;
  }

  const config = ConfigModel.create(configTemplate);

  if (!config) {
    throw Error('Error in findOrCreateConfig');
  }

  return config;
}

interface StoreConfigWithAssetInterface {
  configTemplate: Pick<
    Config,
    | 'slug'
    | 'nameString'
    | 'description'
    | 'variant'
    | 'order'
    | 'multi'
    | 'acceptedFormats'
    | 'cities'
  >;
  sourceImage: string;
  format: StoreFileFormat;
}

async function storeConfigWithAsset({
  configTemplate,
  sourceImage,
  format,
}: StoreConfigWithAssetInterface): Promise<Config> {
  const { slug } = configTemplate;

  const assetPath = await setSharpImage({
    sourceImage: `site-config/${sourceImage}`,
    dist: 'config',
    slug,
    format,
  });

  return findOrCreateConfig({
    ...configTemplate,
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: [`${assetPath}`],
          },
        ],
      },
    ],
  });
}

const SITE_CONFIGS_VARIANT_ASSET = 'asset' as ConfigVariantEnum;
const SITE_CONFIGS_VARIANT_STRING = 'string' as ConfigVariantEnum;
const SITE_CONFIGS_VARIANT_EMAIL = 'email' as ConfigVariantEnum;
const SITE_CONFIGS_VARIANT_TEL = 'tel' as ConfigVariantEnum;
const SITE_CONFIGS_VARIANT_NUMBER = 'number' as ConfigVariantEnum;

export interface CreateInitialSiteConfigsPayloadInterface {
  configSiteLogo: Config;
  configSiteLogoDark: Config;
  configSiteLogoIcon: Config;
  configSiteLogoName: Config;
  configPageDefaultPreviewImage: Config;
  configSiteName: Config;
  configContactEmail: Config;
  configContactPhone: Config;
  configSiteFoundationYear: Config;
  configPageDefaultTitle: Config;
  configPageDefaultDescription: Config;
  configSiteThemeColor: Config;
  configStickyNavVisibleOptionsCount: Config;
  configCatalogueFilterVisibleOptionsCount: Config;
  configCatalogueFilterVisibleAttributesCount: Config;
  configSeoTextTitle: Config;
  configSeoText: Config;
  allConfigs: Config[];
}

export async function createInitialSiteConfigs(): Promise<CreateInitialSiteConfigsPayloadInterface> {
  // Asset configs
  const configSiteLogo = await storeConfigWithAsset({
    sourceImage: `logo.svg`,
    format: 'svg',
    configTemplate: {
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogo',
      nameString: 'Логотип сайта для тёмной темы',
      description: 'Полное изображение логотипа в формате SVG',
      order: 1,
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: [],
    },
  });

  const configSiteLogoDark = await storeConfigWithAsset({
    sourceImage: `logo-dark.svg`,
    format: 'svg',
    configTemplate: {
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoDark',
      nameString: 'Логотип сайта для светлой темы',
      description: 'Полное изображение логотипа в формате SVG',
      order: 2,
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: [],
    },
  });

  const configSiteLogoIcon = await storeConfigWithAsset({
    sourceImage: `logo-icon.svg`,
    format: 'svg',
    configTemplate: {
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoIcon',
      nameString: 'Иконка логотипа сайта',
      description: 'Иконка логотипа в формате SVG',
      order: 3,
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: [],
    },
  });

  const configSiteLogoName = await storeConfigWithAsset({
    sourceImage: `logo-name.svg`,
    format: 'svg',
    configTemplate: {
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'siteLogoName',
      nameString: 'Текст логотипа сайта',
      description: 'Текст логотипа в формате SVG',
      order: 4,
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: [],
    },
  });

  const configPageDefaultPreviewImage = await storeConfigWithAsset({
    sourceImage: `og-image.jpg`,
    format: 'jpg',
    configTemplate: {
      variant: SITE_CONFIGS_VARIANT_ASSET,
      slug: 'pageDefaultPreviewImage',
      nameString: 'Дефолтное превью изображение',
      description:
        'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
      order: 5,
      multi: false,
      acceptedFormats: ['image/jpeg'],
      cities: [],
    },
  });

  const configSiteName = await findOrCreateConfig({
    variant: SITE_CONFIGS_VARIANT_STRING,
    slug: 'siteName',
    nameString: 'Название сайта',
    description: '',
    order: 6,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Site'],
          },
        ],
      },
    ],
  });

  const configContactEmail = await findOrCreateConfig({
    variant: SITE_CONFIGS_VARIANT_EMAIL,
    slug: 'contactEmail',
    nameString: 'Контактный Email',
    description: 'Контактный Email. Можно добавить несколько.',
    order: 7,
    multi: true,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['email@email.com'],
          },
        ],
      },
    ],
  });

  const configContactPhone = await findOrCreateConfig({
    slug: 'contactPhone',
    nameString: 'Контактный телефон',
    description: 'Контактный телефон. Можно добавить несколько.',
    variant: SITE_CONFIGS_VARIANT_TEL,
    order: 8,
    multi: true,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['+79998887766'],
          },
        ],
      },
    ],
  });

  const configSiteFoundationYear = await findOrCreateConfig({
    slug: 'siteFoundationYear',
    nameString: 'Год основания сайта',
    description: '',
    variant: SITE_CONFIGS_VARIANT_NUMBER,
    order: 9,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['2020'],
          },
        ],
      },
    ],
  });

  const configPageDefaultTitle = await findOrCreateConfig({
    slug: 'pageDefaultTitle',
    nameString: 'Дефолтный title страницы',
    description: 'Данное поле будет добавлено в атрибут title если страница не имеет такового',
    variant: SITE_CONFIGS_VARIANT_STRING,
    order: 10,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Дефолтный title страницы'],
          },
          {
            key: SECONDARY_LANG,
            value: ['Page default title'],
          },
        ],
      },
    ],
  });

  const configPageDefaultDescription = await findOrCreateConfig({
    slug: 'pageDefaultDescription',
    nameString: 'Дефолтный description страницы',
    description:
      'Данное поле будет добавлено в атрибут description если страница не имеет такового',
    variant: SITE_CONFIGS_VARIANT_STRING,
    order: 11,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['Дефолтный description страницы'],
          },
          {
            key: SECONDARY_LANG,
            value: ['Page default description'],
          },
        ],
      },
    ],
  });

  const configSiteThemeColor = await findOrCreateConfig({
    slug: 'siteThemeColor',
    nameString: 'Акцент цвет сайта',
    description:
      'Данный цвет будет использован для акцента ключевых элементов сайта. ВНИМАНИЕ! Цвет должен быть в формате RGB!',
    variant: SITE_CONFIGS_VARIANT_STRING,
    order: 12,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['219, 83, 96'],
          },
        ],
      },
    ],
  });

  const configStickyNavVisibleOptionsCount = await findOrCreateConfig({
    slug: 'stickyNavVisibleOptionsCount',
    nameString: 'Количество видимых опций в выпадающем меню.',
    description: '',
    variant: SITE_CONFIGS_VARIANT_NUMBER,
    order: 13,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['3'],
          },
        ],
      },
    ],
  });

  const configCatalogueFilterVisibleOptionsCount = await findOrCreateConfig({
    slug: 'catalogueFilterVisibleOptionsCount',
    nameString: 'Количество видимых опций в фильтре каталога.',
    description: '',
    variant: SITE_CONFIGS_VARIANT_NUMBER,
    order: 14,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['3'],
          },
        ],
      },
    ],
  });

  const configCatalogueFilterVisibleAttributesCount = await findOrCreateConfig({
    slug: 'catalogueFilterVisibleAttributesCount',
    nameString: 'Количество видимых атрибутов в фильтре каталога.',
    description: '',
    variant: SITE_CONFIGS_VARIANT_NUMBER,
    order: 15,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: ['5'],
          },
        ],
      },
    ],
  });

  const configSeoTextTitle = await findOrCreateConfig({
    slug: 'seoTextTitle',
    nameString: 'Заголовок для SEO-текста',
    description: '',
    variant: SITE_CONFIGS_VARIANT_STRING,
    order: 16,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: [`Заголовок для SEO-текста`],
          },
        ],
      },
    ],
  });

  const configSeoText = await findOrCreateConfig({
    slug: 'seoText',
    nameString: 'SEO текст.',
    description: 'Для корректного отображения текст должен быть в формате HTML',
    variant: SITE_CONFIGS_VARIANT_STRING,
    order: 17,
    multi: false,
    acceptedFormats: [],
    cities: [
      {
        key: DEFAULT_CITY,
        translations: [
          {
            key: DEFAULT_LANG,
            value: [
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
        ],
      },
    ],
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
    configStickyNavVisibleOptionsCount,
    configCatalogueFilterVisibleOptionsCount,
    configCatalogueFilterVisibleAttributesCount,
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
    configStickyNavVisibleOptionsCount,
    configCatalogueFilterVisibleOptionsCount,
    configCatalogueFilterVisibleAttributesCount,
    configSeoTextTitle,
    configSeoText,
  };
}
