import {
  CONFIG_VARIANT_ADDRESS,
  CONFIG_VARIANT_ASSET,
  CONFIG_VARIANT_BOOLEAN,
  CONFIG_VARIANT_CATEGORIES_TREE,
  CONFIG_VARIANT_COLOR,
  CONFIG_VARIANT_CONSTRUCTOR,
  CONFIG_VARIANT_EMAIL,
  CONFIG_VARIANT_NUMBER,
  CONFIG_VARIANT_PASSWORD,
  CONFIG_VARIANT_PHONE,
  CONFIG_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  MAIN_BANNER_AUTOPLAY_SPEED,
  PAGE_EDITOR_DEFAULT_VALUE_STRING,
} from '../config/common';
import { ConfigModel } from '../db/dbModels';
import { ObjectId } from 'mongodb';

export interface GetConfigTemplatesInterface {
  assetsPath?: string;
  siteName?: string;
  phone?: string[];
  email?: string[];
  companySlug: string;
  foundationYear?: string;
  address?: string;
}

export function getConfigTemplates({
  assetsPath,
  siteName,
  phone,
  email,
  companySlug,
  foundationYear = `${new Date().getFullYear()}`,
  address,
}: GetConfigTemplatesInterface): ConfigModel[] {
  return [
    // Site globals
    {
      _id: new ObjectId(),
      companySlug,
      group: 'globals',
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      _id: new ObjectId(),
      companySlug,
      group: 'globals',
      variant: CONFIG_VARIANT_STRING,
      slug: 'smsApiKey',
      name: 'SMS API ключ',
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
      group: 'globals',
      variant: CONFIG_VARIANT_EMAIL,
      slug: 'smsApiEmail',
      name: 'SMS API Email',
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
      group: 'globals',
      variant: CONFIG_VARIANT_STRING,
      slug: 'smsApiSign',
      name: 'SMS API подпись',
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
      group: 'globals',
      variant: CONFIG_VARIANT_STRING,
      slug: 'emailApiHost',
      name: 'Email API Хост',
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
      group: 'globals',
      variant: CONFIG_VARIANT_EMAIL,
      slug: 'emailApiLogin',
      name: 'Email API Логин',
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
      group: 'globals',
      variant: CONFIG_VARIANT_PASSWORD,
      slug: 'emailApiPassword',
      name: 'Email API Пароль',
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
      group: 'globals',
      variant: CONFIG_VARIANT_PASSWORD,
      slug: 'textUniquenessApiKey',
      name: 'API ключ для проверки уникальности текса',
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
      _id: new ObjectId(),
      companySlug,
      group: 'analytics',
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_ASSET,
      slug: 'siteLogo',
      name: 'Логотип сайта для тёмной темы',
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`/assets${assetsPath}/siteLogo/siteLogo.svg`] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'siteLogoDark',
      name: 'Логотип сайта для светлой темы',
      description: 'Полное изображение логотипа в формате SVG или PNG',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`/assets${assetsPath}/siteLogoDark/siteLogoDark.svg`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'ui',
      variant: CONFIG_VARIANT_STRING,
      slug: 'siteLogoWidth',
      name: 'Ширина логотипа в шапке сайта (px / em / rem / %)',
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
      variant: CONFIG_VARIANT_STRING,
      slug: 'siteMobileLogoWidth',
      name: 'Ширина логотипа в шапке сайта при мобильной версии (px / em / rem / %)',
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_COLOR,
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
      variant: CONFIG_VARIANT_BOOLEAN,
      slug: 'showAdultModal',
      name: 'Показывать попап с предупреждением о совершеннолетии',
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
      group: 'ui',
      variant: CONFIG_VARIANT_BOOLEAN,
      slug: 'showBlog',
      name: 'Показывать блог на сайте',
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
      group: 'ui',
      variant: CONFIG_VARIANT_BOOLEAN,
      slug: 'showBlogPostViews',
      name: 'Показывать счётчик просмотров блог-поста',
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
      group: 'ui',
      variant: CONFIG_VARIANT_CATEGORIES_TREE,
      slug: 'visibleCategoriesInNavDropdown',
      name: 'Видимые категории в выпадающем меню',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [],
        },
      },
    },

    // Contacts
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: CONFIG_VARIANT_EMAIL,
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
      variant: CONFIG_VARIANT_PHONE,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: CONFIG_VARIANT_STRING,
      slug: 'telegram',
      name: 'Ссылка на Telegram',
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
      variant: CONFIG_VARIANT_ADDRESS,
      slug: 'actualAddress',
      name: 'Фактический адрес компании',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [address || '{}'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'mapMarkerDarkTheme',
      name: 'Изображение маркера на карте с тёмной темой (40 x 40)',
      description: '',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`/marker.svg`],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'mapMarkerLightTheme',
      name: 'Изображение маркера на карте со светлой темой (40 x 40)',
      description: '',
      multi: false,
      acceptedFormats: ['image/svg+xml', 'image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [`/marker.svg`],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'contacts',
      variant: CONFIG_VARIANT_CONSTRUCTOR,
      slug: 'contactsContent',
      name: 'Контент на странице контактов',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [PAGE_EDITOR_DEFAULT_VALUE_STRING],
        },
      },
    },

    // SEO
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'pageDefaultPreviewImage',
      name: 'Дефолтное превью изображение',
      description:
        'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
      multi: false,
      acceptedFormats: ['image/jpeg'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`/assets${assetsPath}/pageDefaultPreviewImage/pageDefaultPreviewImage.jpg`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'android-chrome-192x192',
      name: 'Иконка для рабочего стола Android 192x192',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`/assets${assetsPath}/android-chrome-192x192/android-chrome-192x192.png`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'android-chrome-512x512',
      name: 'Иконка для рабочего стола Android 512x512',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`/assets${assetsPath}/android-chrome-512x512/android-chrome-512x512.png`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'apple-touch-icon',
      name: 'Иконка для рабочего стола iOS 180x180',
      description: '',
      multi: false,
      acceptedFormats: ['image/png'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath
            ? [`/assets${assetsPath}/apple-touch-icon/apple-touch-icon.png`]
            : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'favicon-ico',
      name: 'Favicon в формате ico 48x48',
      description: '',
      multi: false,
      acceptedFormats: ['image/x-icon', 'image/vnd.microsoft.icon'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`/assets${assetsPath}/favicon/favicon.ico`] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_ASSET,
      slug: 'icon-svg',
      name: 'Favicon в формате svg 32x32',
      description: '',
      multi: false,
      acceptedFormats: ['image/svg+xml'],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: assetsPath ? [`/assets${assetsPath}/icon/icon.svg`] : [],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'seo',
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_CONSTRUCTOR,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
      slug: 'stickyNavVisibleCategoriesCount',
      name: 'Количество видимых категорий в выпадающем меню шапки сайта.',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: ['4'],
        },
      },
    },
    {
      _id: new ObjectId(),
      companySlug,
      group: 'catalogue',
      variant: CONFIG_VARIANT_NUMBER,
      slug: 'stickyNavVisibleSubCategoriesCount',
      name: 'Количество видимых подкатегорий в выпадающем меню шапки сайта.',
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_NUMBER,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
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
      variant: CONFIG_VARIANT_STRING,
      slug: 'buyButtonText',
      name: 'Текст кнопки при оформлении заказа',
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
      group: 'project',
      variant: CONFIG_VARIANT_BOOLEAN,
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
    {
      _id: new ObjectId(),
      companySlug,
      group: 'project',
      variant: CONFIG_VARIANT_BOOLEAN,
      slug: 'showReservationDate',
      name: 'Использовать в заказах дату брони',
      description: '',
      multi: false,
      acceptedFormats: [],
      cities: {
        [DEFAULT_CITY]: {
          [DEFAULT_LOCALE]: [''],
        },
      },
    },
  ];
}
