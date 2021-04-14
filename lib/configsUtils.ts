import { CONFIG_VARIANT_ASSET, DEFAULT_CITY, DEFAULT_LOCALE } from 'config/common';
import { COL_COMPANIES, COL_CONFIGS } from 'db/collectionNames';
import { CompanyModel, ConfigModel, ConfigVariantModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castDbData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';

interface GetConfigTemplatesInterface {
  assetsPath?: string;
  siteName?: string;
  phone?: string[];
  email?: string[];
  companySlug: string;
  foundationYear?: string;
}

export function getConfigTemplates({
  assetsPath,
  siteName,
  phone,
  email,
  companySlug,
  foundationYear = `${new Date().getFullYear()}`,
}: GetConfigTemplatesInterface): ConfigModel[] {
  const objectStorageDomain = `${process.env.OBJECT_STORAGE_DOMAIN}`;

  return [
    // Site globals
    {
      _id: new ObjectId(),
      companySlug,
      group: 'globals',
      variant: 'string' as ConfigVariantModel,
      slug: 'siteName',
      name: 'Название сайта',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: siteName ? [siteName] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'globals',
      variant: 'number' as ConfigVariantModel,
      slug: 'siteFoundationYear',
      name: 'Год основания сайта',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [foundationYear],
        },
      },
    },

    // Analytics
    {
      _id: new ObjectId(),
      companySlug,
      group: 'analytics',
      variant: 'string' as ConfigVariantModel,
      slug: 'yaVerification',
      name: 'Код верификации сайта в поисковой системе Яндекс',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'analytics',
      variant: 'string' as ConfigVariantModel,
      slug: 'yaMetrica',
      name: 'Код Яндекс метрики',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'analytics',
      variant: 'string' as ConfigVariantModel,
      slug: 'googleAnalytics',
      name: 'Код Google Analytics',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },

    // Site ui
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'asset' as ConfigVariantModel,
      slug: 'siteLogo',
      name: 'Логотип сайта для тёмной темы',
      description: 'Полное изображение логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`https://${objectStorageDomain}${assetsPath}/siteLogo/siteLogo.svg`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'asset' as ConfigVariantModel,
      slug: 'siteLogoDark',
      name: 'Логотип сайта для светлой темы',
      description: 'Полное изображение логотипа в формате SVG',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`https://${objectStorageDomain}${assetsPath}/siteLogoDark/siteLogoDark.svg`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'string' as ConfigVariantModel,
      slug: 'siteThemeColor',
      name: 'Акцент цвет сайта',
      description:
        'Данный цвет будет использован для акцента ключевых элементов сайта. ВНИМАНИЕ! Цвет должен быть в формате RGB! Пример 255, 255, 255',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['219, 83, 96'],
        },
      },
    },

    // Contacts
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'email' as ConfigVariantModel,
      slug: 'contactEmail',
      name: 'Контактный Email',
      description: 'Контактный Email. Можно добавить несколько.',
      multi: true,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: email || [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'tel' as ConfigVariantModel,
      slug: 'phone',
      name: 'Контактный телефон',
      description: 'Контактный телефон. Можно добавить несколько.',
      multi: true,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: phone || [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'facebook',
      name: 'Ссылка на Facebook',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'instagram',
      name: 'Ссылка на Instagram',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'vkontakte',
      name: 'Ссылка на VKontakte',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'odnoklassniki',
      name: 'Ссылка на Odnoklassniki',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'youtube',
      name: 'Ссылка на Youtube',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },

    // SEO
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'pageDefaultPreviewImage',
      name: 'Дефолтное превью изображение',
      description:
        'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
      multi: false,
      acceptedFormats: ['image/jpeg'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [
                `https://${objectStorageDomain}${assetsPath}/pageDefaultPreviewImage/pageDefaultPreviewImage.jpg`,
              ]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'android-chrome-192x192',
      name: 'Иконка для рабочего стола Android 192x192',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [
                `https://${objectStorageDomain}${assetsPath}/android-chrome-192x192/android-chrome-192x192.png`,
              ]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'android-chrome-512x512',
      name: 'Иконка для рабочего стола Android 512x512',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [
                `https://${objectStorageDomain}${assetsPath}/android-chrome-512x512/android-chrome-512x512.png`,
              ]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'apple-touch-icon',
      name: 'Иконка для рабочего стола iOS 180x180',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`https://${objectStorageDomain}${assetsPath}/apple-touch-icon/apple-touch-icon.png`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'favicon.ico',
      name: 'Favicon в формате ico 48x48',
      description: '',
      multi: false,
      acceptedFormats: ['image/x-icon'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`https://${objectStorageDomain}${assetsPath}/favicon/favicon.ico`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'icon.svg',
      name: 'Favicon в формате svg 32x32',
      description: '',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`https://${objectStorageDomain}${assetsPath}/icon/icon.svg`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'string' as ConfigVariantModel,
      slug: 'pageDefaultTitle',
      name: 'Дефолтный title страницы',
      description: 'Данное поле будет добавлено в атрибут title если страница не имеет такового',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: siteName ? [siteName] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'string' as ConfigVariantModel,
      slug: 'pageDefaultDescription',
      name: 'Дефолтный description страницы',
      description:
        'Данное поле будет добавлено в атрибут description если страница не имеет такового',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`Купить алкоголь по лучшей цене в ${siteName}`],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'string' as ConfigVariantModel,
      slug: 'seoTextTitle',
      name: 'Заголовок для SEO-текста на главной странице сайта.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: siteName ? [siteName] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'string' as ConfigVariantModel,
      slug: 'seoText',
      name: 'SEO текст на главной странице сайта.',
      description: 'Для корректного отображения текст должен быть в формате HTML',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },

    // Catalogue
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'stickyNavVisibleAttributesCount',
      name: 'Количество видимых аттрибутов в выпадающем меню шапки сайта.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['3'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'stickyNavVisibleOptionsCount',
      name: 'Количество видимых опций в выпадающем меню шапки сайта.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['5'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'catalogueFilterVisibleAttributesCount',
      name: 'Количество видимых атрибутов в фильтре каталога.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['5'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'catalogueFilterVisibleOptionsCount',
      name: 'Количество видимых опций в фильтре каталога.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['5'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'snippetAttributesCount',
      name: 'Количество видимых атрибутов в сниппете товара каталога.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['5'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'string' as ConfigVariantModel,
      slug: 'catalogueMetaPrefix',
      name: 'Префикс в метатегах каталога',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['Купить'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'string' as ConfigVariantModel,
      slug: 'cardMetaPrefix',
      name: 'Префикс в метатегах карточки',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['Купить'],
        },
      },
    },
  ];
}

interface GetConfigPageDataInterface {
  group: string;
  companyId?: string;
}

interface GetConfigPageDataPayloadInterface {
  assetConfigs: ConfigModel[];
  normalConfigs: ConfigModel[];
}

export async function getConfigPageData({
  companyId,
  group,
}: GetConfigPageDataInterface): Promise<GetConfigPageDataPayloadInterface | null> {
  const db = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);

  if (!companyId || companyId === 'undefined') {
    return null;
  }

  const company = await companiesCollection.findOne({ _id: new ObjectId(companyId) });
  if (!company) {
    return null;
  }

  const companySlug = company.slug;
  const companyConfigs = await configsCollection.find({ companySlug, group }).toArray();
  const initialConfigTemplates = getConfigTemplates({
    companySlug,
  });
  const initialConfigsGroup = initialConfigTemplates.filter((config) => {
    return config.group === group;
  });

  const configTemplates = initialConfigsGroup.reduce((acc: ConfigModel[], template) => {
    const companyConfig = companyConfigs.find(({ slug }) => slug === template.slug);
    if (companyConfig) {
      return [...acc, companyConfig];
    }
    return [...acc, template];
  }, []);

  const assetConfigs = configTemplates.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = configTemplates.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  return {
    assetConfigs: castDbData(assetConfigs),
    normalConfigs: castDbData(notAssetConfigs),
  };
}
