import {
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  MAIN_BANNER_AUTOPLAY_SPEED,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
} from '../config/common';
import { ConfigModel, ConfigVariantModel } from '../db/dbModels';
import { ObjectId } from 'mongodb';

export interface GetConfigTemplatesInterface {
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
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
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
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
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
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
      slug: 'siteLogoWidth',
      name: 'Ширина логотипа в шаке сайта (px / em / rem / %)',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['10rem'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'string' as ConfigVariantModel,
      slug: 'siteMobileLogoWidth',
      name: 'Ширина логотипа в шаке сайта при мобильной версии (px / em / rem / %)',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['7rem'],
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
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteTopBarBgLightTheme',
      name: 'Цвет фона вспомогательной навигации при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#f2f3f3'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'headerTopBarBgDarkTheme',
      name: 'Цвет фона вспомогательной навигации при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'headerTopBarTextLightTheme',
      name: 'Цвет текста вспомогательной навигации при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'headerTopBarTextDarkTheme',
      name: 'Цвет текста вспомогательной навигации при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#ffffff'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavBarBgLightTheme',
      name: 'Цвет фона навигации при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#F2F3F3'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavBarBgDarkTheme',
      name: 'Цвет фона навигации при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavBarTextLightTheme',
      name: 'Цвет текста навигации при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavBarTextDarkTheme',
      name: 'Цвет текста навигации при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#ffffff'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownBgLightTheme',
      name: 'Цвет фона выпадающего меню при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#F2F3F3'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownBgDarkTheme',
      name: 'Цвет фона выпадающего меню при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownTextLightTheme',
      name: 'Цвет ссылок выпадающего меню при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownTextDarkTheme',
      name: 'Цвет ссылок выпадающего меню при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#ffffff'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownAttributeLightTheme',
      name: 'Цвет названия атрибута в выпадающем меню при светлой теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#2B3039'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'color' as ConfigVariantModel,
      slug: 'siteNavDropdownAttributeDarkTheme',
      name: 'Цвет названия атрибута в выпадающем меню при тёмной теме',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['#ffffff'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: 'boolean' as ConfigVariantModel,
      slug: 'showAdultModal',
      name: 'Показывать попап с предупреждением о совершеннолетии',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['true'],
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
          [DEFAULT_LOCALE]: email || [''],
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
          [DEFAULT_LOCALE]: phone || [''],
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
    {
      _id: new ObjectId(),
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
      acceptedFormats: ['image/x-icon', 'image/vnd.microsoft.icon'],
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
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
          [DEFAULT_LOCALE]: siteName ? [siteName] : [''],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: 'constructor' as ConfigVariantModel,
      slug: 'seoText',
      name: 'SEO текст на главной странице сайта.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [PAGE_EDITOR_DEFAULT_VALUE_STRING],
        },
      },
    },

    // Catalogue
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'number' as ConfigVariantModel,
      slug: 'mainBannerAutoplaySpeed',
      name: 'Интервал времени между слайдами баннера на главной странице (миллисекунды)',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`${MAIN_BANNER_AUTOPLAY_SPEED}`],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: 'boolean' as ConfigVariantModel,
      slug: 'showCardArticle',
      name: 'Показывать артикул в карточке товара',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['false'],
        },
      },
    },
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
          [DEFAULT_LOCALE]: ['купить'],
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
          [DEFAULT_LOCALE]: ['купить'],
        },
      },
    },

    // Project
    {
      _id: new ObjectId(),
      companySlug,
      group: 'project',
      variant: 'boolean' as ConfigVariantModel,
      slug: 'useUniqueConstructor',
      name: 'Использовать уникальный конструктор в карточке товара для каждой компании',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['false'],
        },
      },
    },
  ];
}
