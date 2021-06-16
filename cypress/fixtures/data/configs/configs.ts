import { ObjectId } from 'mongodb';
import { ConfigModel, ConfigVariantModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
import {
  ASSETS_DIST_CONFIGS,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
} from '../../../../config/common';
require('dotenv').config();

interface GetConfigTemplatesInterface {
  assetsPath?: string;
  siteName?: string;
  phone?: string[];
  email?: string[];
  companySlug: string;
  foundationYear?: string;
}

function getConfigTemplates({
  assetsPath,
  siteName,
  phone,
  email,
  companySlug,
  foundationYear = `${new Date().getFullYear()}`,
}: GetConfigTemplatesInterface): ConfigModel[] {
  const fullAssetPath = `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_CONFIGS}/${assetsPath}`;

  return [
    // Site globals
    {
      _id: getObjectId(`${companySlug} siteName`),
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} siteFoundationYear`),
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
    {
      _id: getObjectId(`${companySlug} siteLicense`),
      companySlug,
      group: 'globals',
      variant: 'string' as ConfigVariantModel,
      slug: 'siteLicense',
      name: 'Сведения о лицензии',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },

    // Analytics
    {
      _id: getObjectId(`${companySlug} yaVerification`),
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
      _id: getObjectId(`${companySlug} yaMetrica`),
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
      _id: getObjectId(`${companySlug} googleAnalytics`),
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
      _id: getObjectId(`${companySlug} siteLogo`),
      companySlug,
      group: 'ui',
      variant: 'asset' as ConfigVariantModel,
      slug: 'siteLogo',
      name: 'Логотип сайта для тёмной темы',
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`${fullAssetPath}/siteLogo/siteLogo.svg`] : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} siteLogoDark`),
      companySlug,
      group: 'ui',
      variant: 'asset' as ConfigVariantModel,
      slug: 'siteLogoDark',
      name: 'Логотип сайта для светлой темы',
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`${fullAssetPath}/siteLogoDark/siteLogoDark.svg`] : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} siteThemeColor`),
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
      _id: getObjectId(`${companySlug} contactEmail`),
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
          [DEFAULT_LOCALE]: email || [''],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} phone`),
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
          [DEFAULT_LOCALE]: phone || [''],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} facebook`),
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
      _id: getObjectId(`${companySlug} instagram`),
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
      _id: getObjectId(`${companySlug} vkontakte`),
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
      _id: getObjectId(`${companySlug} odnoklassniki`),
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
      _id: getObjectId(`${companySlug} youtube`),
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
    {
      _id: getObjectId(`${companySlug} twitter`),
      companySlug,
      group: 'contacts',
      variant: 'string' as ConfigVariantModel,
      slug: 'twitter',
      name: 'Ссылка на Twitter',
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
      _id: getObjectId(`${companySlug} pageDefaultPreviewImage`),
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
            ? [`${fullAssetPath}/pageDefaultPreviewImage/pageDefaultPreviewImage.jpg`]
            : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} android-chrome-192x192`),
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
            ? [`${fullAssetPath}/android-chrome-192x192/android-chrome-192x192.png`]
            : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} android-chrome-512x512`),
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
            ? [`${fullAssetPath}/android-chrome-512x512/android-chrome-512x512.png`]
            : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} apple-touch-icon`),
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
            ? [`${fullAssetPath}/apple-touch-icon/apple-touch-icon.png`]
            : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} favicon.ico`),
      companySlug,
      group: 'seo',
      variant: 'asset' as ConfigVariantModel,
      slug: 'favicon.ico',
      name: 'Favicon в формате ico 48x48',
      description: '',
      multi: false,
      acceptedFormats: ['image/x-icon', 'image/vnd.microsoft.icon'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`${fullAssetPath}/favicon/favicon.ico`] : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} icon.svg`),
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
          [DEFAULT_LOCALE]: assetsPath ? [`${fullAssetPath}/icon/icon.svg`] : [],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} pageDefaultTitle`),
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} pageDefaultDescription`),
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
      _id: getObjectId(`${companySlug} seoTextTitle`),
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} seoText`),
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
      _id: getObjectId(`${companySlug} stickyNavVisibleAttributesCount`),
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
      _id: getObjectId(`${companySlug} stickyNavVisibleOptionsCount`),
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
      _id: getObjectId(`${companySlug} catalogueFilterVisibleAttributesCount`),
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
      _id: getObjectId(`${companySlug} catalogueFilterVisibleOptionsCount`),
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
      _id: getObjectId(`${companySlug} snippetAttributesCount`),
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
      _id: getObjectId(`${companySlug} cardListFeaturesCount`),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'cardListFeaturesCount',
      name: 'Количество видимых атрибутов в карточке товара.',
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
      _id: getObjectId(`${companySlug} catalogueMetaPrefix`),
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
          [DEFAULT_LOCALE]: ['купить'],
        },
      },
    },
    {
      _id: getObjectId(`${companySlug} cardMetaPrefix`),
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
          [DEFAULT_LOCALE]: ['купить'],
        },
      },
    },
  ];
}

const defaultConfigs = getConfigTemplates({
  siteName: 'Default site',
  companySlug: DEFAULT_COMPANY_SLUG,
  assetsPath: DEFAULT_COMPANY_SLUG,
});

const companyASlug = 'company_a';
const companyAConfigs = getConfigTemplates({
  siteName: 'Company A',
  companySlug: companyASlug,
  assetsPath: companyASlug,
});

const companyBSlug = 'company_b';
const companyBConfigs = getConfigTemplates({
  siteName: 'Company B',
  companySlug: companyBSlug,
  assetsPath: companyBSlug,
});

// @ts-ignore
export = [...defaultConfigs, ...companyAConfigs, ...companyBConfigs];
