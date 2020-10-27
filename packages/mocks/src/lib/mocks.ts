import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANG,
  DEFAULT_PRIORITY,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
  SECONDARY_CITY,
  SECONDARY_COUNTRY,
  SECONDARY_CURRENCY,
  SECONDARY_LANG,
} from '@yagu/config';

export const ME_AS_ADMIN = {
  id: 'adminBro',
  email: 'admin@gmail.com',
  password: 'admin',
  name: 'Admin',
  secondName: 'Secondname',
  lastName: 'Lastname',
  fullName: 'Admin Secondname Lastname',
  shortName: 'A. Lastname',
  phone: '+79990002233',
  isAdmin: true,
  isBookkeeper: false,
  isContractor: false,
  isDriver: false,
  isHelper: false,
  isLogistician: false,
  isManager: false,
  isStage: false,
  isWarehouse: false,
  isSuper: false,
};

export const ISO_LANGUAGES = [
  {
    id: 'ab',
    nameString: 'Abkhaz',
    nativeName: 'аҧсуа',
  },
  {
    id: 'aa',
    nameString: 'Afar',
    nativeName: 'Afaraf',
  },
  {
    id: 'af',
    nameString: 'Afrikaans',
    nativeName: 'Afrikaans',
  },
  {
    id: 'ak',
    nameString: 'Akan',
    nativeName: 'Akan',
  },
  {
    id: 'sq',
    nameString: 'Albanian',
    nativeName: 'Shqip',
  },
  {
    id: 'am',
    nameString: 'Amharic',
    nativeName: 'አማርኛ',
  },
  {
    id: 'ar',
    nameString: 'Arabic',
    nativeName: 'العربية',
  },
  {
    id: 'an',
    nameString: 'Aragonese',
    nativeName: 'Aragonés',
  },
  {
    id: 'hy',
    nameString: 'Armenian',
    nativeName: 'Հայերեն',
  },
  {
    id: 'as',
    nameString: 'Assamese',
    nativeName: 'অসমীয়া',
  },
  {
    id: 'av',
    nameString: 'Avaric',
    nativeName: 'авар мацӀ, магӀарул мацӀ',
  },
  {
    id: 'ae',
    nameString: 'Avestan',
    nativeName: 'avesta',
  },
  {
    id: 'ay',
    nameString: 'Aymara',
    nativeName: 'aymar aru',
  },
  {
    id: 'az',
    nameString: 'Azerbaijani',
    nativeName: 'azərbaycan dili',
  },
  {
    id: 'bm',
    nameString: 'Bambara',
    nativeName: 'bamanankan',
  },
  {
    id: 'ba',
    nameString: 'Bashkir',
    nativeName: 'башҡорт теле',
  },
  {
    id: 'eu',
    nameString: 'Basque',
    nativeName: 'euskara, euskera',
  },
  {
    id: 'be',
    nameString: 'Belarusian',
    nativeName: 'Беларуская',
  },
  {
    id: 'bn',
    nameString: 'Bengali',
    nativeName: 'বাংলা',
  },
  {
    id: 'bh',
    nameString: 'Bihari',
    nativeName: 'भोजपुरी',
  },
  {
    id: 'bi',
    nameString: 'Bislama',
    nativeName: 'Bislama',
  },
  {
    id: 'bs',
    nameString: 'Bosnian',
    nativeName: 'bosanski jezik',
  },
  {
    id: 'br',
    nameString: 'Breton',
    nativeName: 'brezhoneg',
  },
  {
    id: 'bg',
    nameString: 'Bulgarian',
    nativeName: 'български език',
  },
  {
    id: 'my',
    nameString: 'Burmese',
    nativeName: 'ဗမာစာ',
  },
  {
    id: 'ca',
    nameString: 'Catalan; Valencian',
    nativeName: 'Català',
  },
  {
    id: 'ch',
    nameString: 'Chamorro',
    nativeName: 'Chamoru',
  },
  {
    id: 'ce',
    nameString: 'Chechen',
    nativeName: 'нохчийн мотт',
  },
  {
    id: 'ny',
    nameString: 'Chichewa; Chewa; Nyanja',
    nativeName: 'chiCheŵa, chinyanja',
  },
  {
    id: 'zh',
    nameString: 'Chinese',
    nativeName: '中文 (Zhōngwén), 汉语, 漢語',
  },
  {
    id: 'cv',
    nameString: 'Chuvash',
    nativeName: 'чӑваш чӗлхи',
  },
  {
    id: 'kw',
    nameString: 'Cornish',
    nativeName: 'Kernewek',
  },
  {
    id: 'co',
    nameString: 'Corsican',
    nativeName: 'corsu, lingua corsa',
  },
  {
    id: 'cr',
    nameString: 'Cree',
    nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ',
  },
  {
    id: 'hr',
    nameString: 'Croatian',
    nativeName: 'hrvatski',
  },
  {
    id: 'cs',
    nameString: 'Czech',
    nativeName: 'česky, čeština',
  },
  {
    id: 'da',
    nameString: 'Danish',
    nativeName: 'dansk',
  },
  {
    id: 'dv',
    nameString: 'Divehi; Dhivehi; Maldivian;',
    nativeName: 'ދިވެހި',
  },
  {
    id: 'nl',
    nameString: 'Dutch',
    nativeName: 'Nederlands, Vlaams',
  },
  {
    id: SECONDARY_LANG,
    nameString: 'English',
    nativeName: 'English',
  },
  {
    id: 'eo',
    nameString: 'Esperanto',
    nativeName: 'Esperanto',
  },
  {
    id: 'et',
    nameString: 'Estonian',
    nativeName: 'eesti, eesti keel',
  },
  {
    id: 'ee',
    nameString: 'Ewe',
    nativeName: 'Eʋegbe',
  },
  {
    id: 'fo',
    nameString: 'Faroese',
    nativeName: 'føroyskt',
  },
  {
    id: 'fj',
    nameString: 'Fijian',
    nativeName: 'vosa Vakaviti',
  },
  {
    id: 'fi',
    nameString: 'Finnish',
    nativeName: 'suomi, suomen kieli',
  },
  {
    id: 'fr',
    nameString: 'French',
    nativeName: 'français, langue française',
  },
  {
    id: 'ff',
    nameString: 'Fula; Fulah; Pulaar; Pular',
    nativeName: 'Fulfulde, Pulaar, Pular',
  },
  {
    id: 'gl',
    nameString: 'Galician',
    nativeName: 'Galego',
  },
  {
    id: 'ka',
    nameString: 'Georgian',
    nativeName: 'ქართული',
  },
  {
    id: 'de',
    nameString: 'German',
    nativeName: 'Deutsch',
  },
  {
    id: 'el',
    nameString: 'Greek, Modern',
    nativeName: 'Ελληνικά',
  },
  {
    id: 'gn',
    nameString: 'Guaraní',
    nativeName: 'Avañeẽ',
  },
  {
    id: 'gu',
    nameString: 'Gujarati',
    nativeName: 'ગુજરાતી',
  },
  {
    id: 'ht',
    nameString: 'Haitian; Haitian Creole',
    nativeName: 'Kreyòl ayisyen',
  },
  {
    id: 'ha',
    nameString: 'Hausa',
    nativeName: 'Hausa, هَوُسَ',
  },
  {
    id: 'he',
    nameString: 'Hebrew (modern)',
    nativeName: 'עברית',
  },
  {
    id: 'hz',
    nameString: 'Herero',
    nativeName: 'Otjiherero',
  },
  {
    id: 'hi',
    nameString: 'Hindi',
    nativeName: 'हिन्दी, हिंदी',
  },
  {
    id: 'ho',
    nameString: 'Hiri Motu',
    nativeName: 'Hiri Motu',
  },
  {
    id: 'hu',
    nameString: 'Hungarian',
    nativeName: 'Magyar',
  },
  {
    id: 'ia',
    nameString: 'Interlingua',
    nativeName: 'Interlingua',
  },
  {
    id: 'id',
    nameString: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
  },
  {
    id: 'ie',
    nameString: 'Interlingue',
    nativeName: 'Originally called Occidental; then Interlingue after WWII',
  },
  {
    id: 'ga',
    nameString: 'Irish',
    nativeName: 'Gaeilge',
  },
  {
    id: 'ig',
    nameString: 'Igbo',
    nativeName: 'Asụsụ Igbo',
  },
  {
    id: 'ik',
    nameString: 'Inupiaq',
    nativeName: 'Iñupiaq, Iñupiatun',
  },
  {
    id: 'io',
    nameString: 'Ido',
    nativeName: 'Ido',
  },
  {
    id: 'is',
    nameString: 'Icelandic',
    nativeName: 'Íslenska',
  },
  {
    id: 'it',
    nameString: 'Italian',
    nativeName: 'Italiano',
  },
  {
    id: 'iu',
    nameString: 'Inuktitut',
    nativeName: 'ᐃᓄᒃᑎᑐᑦ',
  },
  {
    id: 'ja',
    nameString: 'Japanese',
    nativeName: '日本語 (にほんご／にっぽんご)',
  },
  {
    id: 'jv',
    nameString: 'Javanese',
    nativeName: 'basa Jawa',
  },
  {
    id: 'kl',
    nameString: 'Kalaallisut, Greenlandic',
    nativeName: 'kalaallisut, kalaallit oqaasii',
  },
  {
    id: 'kn',
    nameString: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
  },
  {
    id: 'kr',
    nameString: 'Kanuri',
    nativeName: 'Kanuri',
  },
  {
    id: 'ks',
    nameString: 'Kashmiri',
    nativeName: 'कश्मीरी, كشميري‎',
  },
  {
    id: 'kk',
    nameString: 'Kazakh',
    nativeName: 'Қазақ тілі',
  },
  {
    id: 'km',
    nameString: 'Khmer',
    nativeName: 'ភាសាខ្មែរ',
  },
  {
    id: 'ki',
    nameString: 'Kikuyu, Gikuyu',
    nativeName: 'Gĩkũyũ',
  },
  {
    id: 'rw',
    nameString: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda',
  },
  {
    id: 'ky',
    nameString: 'Kirghiz, Kyrgyz',
    nativeName: 'кыргыз тили',
  },
  {
    id: 'kv',
    nameString: 'Komi',
    nativeName: 'коми кыв',
  },
  {
    id: 'kg',
    nameString: 'Kongo',
    nativeName: 'KiKongo',
  },
  {
    id: 'ko',
    nameString: 'Korean',
    nativeName: '한국어 (韓國語), 조선말 (朝鮮語)',
  },
  {
    id: 'ku',
    nameString: 'Kurdish',
    nativeName: 'Kurdî, كوردی‎',
  },
  {
    id: 'kj',
    nameString: 'Kwanyama, Kuanyama',
    nativeName: 'Kuanyama',
  },
  {
    id: 'la',
    nameString: 'Latin',
    nativeName: 'latine, lingua latina',
  },
  {
    id: 'lb',
    nameString: 'Luxembourgish, Letzeburgesch',
    nativeName: 'Lëtzebuergesch',
  },
  {
    id: 'lg',
    nameString: 'Luganda',
    nativeName: 'Luganda',
  },
  {
    id: 'li',
    nameString: 'Limburgish, Limburgan, Limburger',
    nativeName: 'Limburgs',
  },
  {
    id: 'ln',
    nameString: 'Lingala',
    nativeName: 'Lingála',
  },
  {
    id: 'lo',
    nameString: 'Lao',
    nativeName: 'ພາສາລາວ',
  },
  {
    id: 'lt',
    nameString: 'Lithuanian',
    nativeName: 'lietuvių kalba',
  },
  {
    id: 'lu',
    nameString: 'Luba-Katanga',
    nativeName: '',
  },
  {
    id: 'lv',
    nameString: 'Latvian',
    nativeName: 'latviešu valoda',
  },
  {
    id: 'gv',
    nameString: 'Manx',
    nativeName: 'Gaelg, Gailck',
  },
  {
    id: 'mk',
    nameString: 'Macedonian',
    nativeName: 'македонски јазик',
  },
  {
    id: 'mg',
    nameString: 'Malagasy',
    nativeName: 'Malagasy fiteny',
  },
  {
    id: 'ms',
    nameString: 'Malay',
    nativeName: 'bahasa Melayu, بهاس ملايو‎',
  },
  {
    id: 'ml',
    nameString: 'Malayalam',
    nativeName: 'മലയാളം',
  },
  {
    id: 'mt',
    nameString: 'Maltese',
    nativeName: 'Malti',
  },
  {
    id: 'mi',
    nameString: 'Māori',
    nativeName: 'te reo Māori',
  },
  {
    id: 'mr',
    nameString: 'Marathi (Marāṭhī)',
    nativeName: 'मराठी',
  },
  {
    id: 'mh',
    nameString: 'Marshallese',
    nativeName: 'Kajin M̧ajeļ',
  },
  {
    id: 'mn',
    nameString: 'Mongolian',
    nativeName: 'монгол',
  },
  {
    id: 'na',
    nameString: 'Nauru',
    nativeName: 'Ekakairũ Naoero',
  },
  {
    id: 'nv',
    nameString: 'Navajo, Navaho',
    nativeName: 'Diné bizaad, Dinékʼehǰí',
  },
  {
    id: 'nb',
    nameString: 'Norwegian Bokmål',
    nativeName: 'Norsk bokmål',
  },
  {
    id: 'nd',
    nameString: 'North Ndebele',
    nativeName: 'isiNdebele',
  },
  {
    id: 'ne',
    nameString: 'Nepali',
    nativeName: 'नेपाली',
  },
  {
    id: 'ng',
    nameString: 'Ndonga',
    nativeName: 'Owambo',
  },
  {
    id: 'nn',
    nameString: 'Norwegian Nynorsk',
    nativeName: 'Norsk nynorsk',
  },
  {
    id: 'no',
    nameString: 'Norwegian',
    nativeName: 'Norsk',
  },
  {
    id: 'ii',
    nameString: 'Nuosu',
    nativeName: 'ꆈꌠ꒿ Nuosuhxop',
  },
  {
    id: 'nr',
    nameString: 'South Ndebele',
    nativeName: 'isiNdebele',
  },
  {
    id: 'oc',
    nameString: 'Occitan',
    nativeName: 'Occitan',
  },
  {
    id: 'oj',
    nameString: 'Ojibwe, Ojibwa',
    nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ',
  },
  {
    id: 'cu',
    nameString: 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
    nativeName: 'ѩзыкъ словѣньскъ',
  },
  {
    id: 'om',
    nameString: 'Oromo',
    nativeName: 'Afaan Oromoo',
  },
  {
    id: 'or',
    nameString: 'Oriya',
    nativeName: 'ଓଡ଼ିଆ',
  },
  {
    id: 'os',
    nameString: 'Ossetian, Ossetic',
    nativeName: 'ирон æвзаг',
  },
  {
    id: 'pa',
    nameString: 'Panjabi, Punjabi',
    nativeName: 'ਪੰਜਾਬੀ, پنجابی‎',
  },
  {
    id: 'pi',
    nameString: 'Pāli',
    nativeName: 'पाऴि',
  },
  {
    id: 'fa',
    nameString: 'Persian',
    nativeName: 'فارسی',
  },
  {
    id: 'pl',
    nameString: 'Polish',
    nativeName: 'polski',
  },
  {
    id: 'ps',
    nameString: 'Pashto, Pushto',
    nativeName: 'پښتو',
  },
  {
    id: 'pt',
    nameString: 'Portuguese',
    nativeName: 'Português',
  },
  {
    id: 'qu',
    nameString: 'Quechua',
    nativeName: 'Runa Simi, Kichwa',
  },
  {
    id: 'rm',
    nameString: 'Romansh',
    nativeName: 'rumantsch grischun',
  },
  {
    id: 'rn',
    nameString: 'Kirundi',
    nativeName: 'kiRundi',
  },
  {
    id: 'ro',
    nameString: 'Romanian, Moldavian, Moldovan',
    nativeName: 'română',
  },
  {
    id: DEFAULT_LANG,
    nameString: 'Russian',
    nativeName: 'русский язык',
  },
  {
    id: 'sa',
    nameString: 'Sanskrit (Saṁskṛta)',
    nativeName: 'संस्कृतम्',
  },
  {
    id: 'sc',
    nameString: 'Sardinian',
    nativeName: 'sardu',
  },
  {
    id: 'sd',
    nameString: 'Sindhi',
    nativeName: 'सिन्धी, سنڌي، سندھی‎',
  },
  {
    id: 'se',
    nameString: 'Northern Sami',
    nativeName: 'Davvisámegiella',
  },
  {
    id: 'sm',
    nameString: 'Samoan',
    nativeName: 'gagana faa Samoa',
  },
  {
    id: 'sg',
    nameString: 'Sango',
    nativeName: 'yângâ tî sängö',
  },
  {
    id: 'sr',
    nameString: 'Serbian',
    nativeName: 'српски језик',
  },
  {
    id: 'gd',
    nameString: 'Scottish Gaelic; Gaelic',
    nativeName: 'Gàidhlig',
  },
  {
    id: 'sn',
    nameString: 'Shona',
    nativeName: 'chiShona',
  },
  {
    id: 'si',
    nameString: 'Sinhala, Sinhalese',
    nativeName: 'සිංහල',
  },
  {
    id: 'sk',
    nameString: 'Slovak',
    nativeName: 'slovenčina',
  },
  {
    id: 'sl',
    nameString: 'Slovene',
    nativeName: 'slovenščina',
  },
  {
    id: 'so',
    nameString: 'Somali',
    nativeName: 'Soomaaliga, af Soomaali',
  },
  {
    id: 'st',
    nameString: 'Southern Sotho',
    nativeName: 'Sesotho',
  },
  {
    id: 'es',
    nameString: 'Spanish; Castilian',
    nativeName: 'español, castellano',
  },
  {
    id: 'su',
    nameString: 'Sundanese',
    nativeName: 'Basa Sunda',
  },
  {
    id: 'sw',
    nameString: 'Swahili',
    nativeName: 'Kiswahili',
  },
  {
    id: 'ss',
    nameString: 'Swati',
    nativeName: 'SiSwati',
  },
  {
    id: 'sv',
    nameString: 'Swedish',
    nativeName: 'svenska',
  },
  {
    id: 'ta',
    nameString: 'Tamil',
    nativeName: 'தமிழ்',
  },
  {
    id: 'te',
    nameString: 'Telugu',
    nativeName: 'తెలుగు',
  },
  {
    id: 'tg',
    nameString: 'Tajik',
    nativeName: 'тоҷикӣ, toğikī, تاجیکی‎',
  },
  {
    id: 'th',
    nameString: 'Thai',
    nativeName: 'ไทย',
  },
  {
    id: 'ti',
    nameString: 'Tigrinya',
    nativeName: 'ትግርኛ',
  },
  {
    id: 'bo',
    nameString: 'Tibetan Standard, Tibetan, Central',
    nativeName: 'བོད་ཡིག',
  },
  {
    id: 'tk',
    nameString: 'Turkmen',
    nativeName: 'Türkmen, Түркмен',
  },
  {
    id: 'tl',
    nameString: 'Tagalog',
    nativeName: 'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔',
  },
  {
    id: 'tn',
    nameString: 'Tswana',
    nativeName: 'Setswana',
  },
  {
    id: 'to',
    nameString: 'Tonga (Tonga Islands)',
    nativeName: 'faka Tonga',
  },
  {
    id: 'tr',
    nameString: 'Turkish',
    nativeName: 'Türkçe',
  },
  {
    id: 'ts',
    nameString: 'Tsonga',
    nativeName: 'Xitsonga',
  },
  {
    id: 'tt',
    nameString: 'Tatar',
    nativeName: 'татарча, tatarça, تاتارچا‎',
  },
  {
    id: 'tw',
    nameString: 'Twi',
    nativeName: 'Twi',
  },
  {
    id: 'ty',
    nameString: 'Tahitian',
    nativeName: 'Reo Tahiti',
  },
  {
    id: 'ug',
    nameString: 'Uighur, Uyghur',
    nativeName: 'Uyƣurqə, ئۇيغۇرچە‎',
  },
  {
    id: 'uk',
    nameString: 'Ukrainian',
    nativeName: 'українська',
  },
  {
    id: 'ur',
    nameString: 'Urdu',
    nativeName: 'اردو',
  },
  {
    id: 'uz',
    nameString: 'Uzbek',
    nativeName: 'zbek, Ўзбек, أۇزبېك‎',
  },
  {
    id: 've',
    nameString: 'Venda',
    nativeName: 'Tshivenḓa',
  },
  {
    id: 'vi',
    nameString: 'Vietnamese',
    nativeName: 'Tiếng Việt',
  },
  {
    id: 'vo',
    nameString: 'Volapük',
    nativeName: 'Volapük',
  },
  {
    id: 'wa',
    nameString: 'Walloon',
    nativeName: 'Walon',
  },
  {
    id: 'cy',
    nameString: 'Welsh',
    nativeName: 'Cymraeg',
  },
  {
    id: 'wo',
    nameString: 'Wolof',
    nativeName: 'Wollof',
  },
  {
    id: 'fy',
    nameString: 'Western Frisian',
    nativeName: 'Frysk',
  },
  {
    id: 'xh',
    nameString: 'Xhosa',
    nativeName: 'isiXhosa',
  },
  {
    id: 'yi',
    nameString: 'Yiddish',
    nativeName: 'ייִדיש',
  },
  {
    id: 'yo',
    nameString: 'Yoruba',
    nativeName: 'Yorùbá',
  },
  {
    id: 'za',
    nameString: 'Zhuang, Chuang',
    nativeName: 'Saɯ cueŋƅ, Saw cuengh',
  },
];

// Site config
export const SITE_CONFIGS_LOGO = {
  slug: 'siteLogo',
  nameString: 'Логотип сайта для тёмной темы',
  description: 'Полное изображение логотипа в формате SVG',
  variant: 'asset',
  order: 1,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
};
export const SITE_CONFIGS_LOGO_DARK = {
  slug: 'siteLogoDark',
  nameString: 'Логотип сайта для светлой темы',
  description: 'Полное изображение логотипа в формате SVG',
  variant: 'asset',
  order: 2,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
};
export const SITE_CONFIGS_LOGO_ICON = {
  slug: 'siteLogoIcon',
  nameString: 'Иконка логотипа сайта',
  description: 'Иконка логотипа в формате SVG',
  variant: 'asset',
  order: 3,
  multi: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
};
export const SITE_CONFIGS_LOGO_NAME = {
  slug: 'siteLogoName',
  nameString: 'Текст логотипа сайта',
  description: 'Текст логотипа в формате SVG',
  variant: 'asset',
  order: 4,
  multi: false,
  multiLang: false,
  acceptedFormats: ['image/svg+xml'],
  cities: [],
};
export const SITE_CONFIGS_PREVIEW_IMAGE = {
  slug: 'pageDefaultPreviewImage',
  nameString: 'Дефолтное превью изображение',
  description:
    'Данное поле будет добавлено в атрибуты og:image и twitter:image если страница не имеет таковых. Нужно для корректного отображения ссылки при отправке в соцсетях и чатах.',
  variant: 'asset',
  order: 5,
  multi: false,
  acceptedFormats: ['image/jpeg'],
  cities: [],
};

export const SITE_CONFIGS_INITIAL = [
  {
    slug: 'siteName',
    nameString: 'Название сайта',
    description: '',
    variant: 'string',
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
  },
  {
    slug: 'contactEmail',
    nameString: 'Контактный Email',
    description: 'Контактный Email. Можно добавить несколько.',
    variant: 'email',
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
  },
  {
    slug: 'contactPhone',
    nameString: 'Контактный телефон',
    description: 'Контактный телефон. Можно добавить несколько.',
    variant: 'tel',
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
  },
  {
    slug: 'siteFoundationYear',
    nameString: 'Год основания сайта',
    description: '',
    variant: 'number',
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
  },
  {
    slug: 'pageDefaultTitle',
    nameString: 'Дефолтный title страницы',
    description: 'Данное поле будет добавлено в атрибут title если страница не имеет такового',
    variant: 'string',
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
  },
  {
    slug: 'pageDefaultDescription',
    nameString: 'Дефолтный description страницы',
    description:
      'Данное поле будет добавлено в атрибут description если страница не имеет такового',
    variant: 'string',
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
  },
  {
    slug: 'siteThemeColor',
    nameString: 'Акцент цвет сайта',
    description:
      'Данный цвет будет использован для акцента ключевых элементов сайта. ВНИМАНИЕ! Цвет должен быть в формате RGB!',
    variant: 'string',
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
  },
  {
    slug: 'stickyNavVisibleOptionsCount',
    nameString: 'Количество видимых опций в выпадающем меню.',
    description: '',
    variant: 'number',
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
  },
  {
    slug: 'catalogueFilterVisibleOptionsCount',
    nameString: 'Количество видимых опций фильтре каталога.',
    description: '',
    variant: 'number',
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
  },
];
export const SITE_CONFIGS_All = [
  SITE_CONFIGS_LOGO,
  SITE_CONFIGS_LOGO_DARK,
  SITE_CONFIGS_LOGO_ICON,
  SITE_CONFIGS_LOGO_NAME,
  SITE_CONFIGS_PREVIEW_IMAGE,
  ...SITE_CONFIGS_INITIAL,
];

// Currency
export const INITIAL_CURRENCIES = [{ nameString: DEFAULT_CURRENCY }];
export const MOCK_CURRENCIES = [...INITIAL_CURRENCIES, { nameString: SECONDARY_CURRENCY }];

// Countries and cities
export const INITIAL_COUNTRIES = [{ nameString: DEFAULT_COUNTRY }];
export const MOCK_COUNTRIES = [...INITIAL_COUNTRIES, { nameString: SECONDARY_COUNTRY }];

export const INITIAL_CITIES = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Москва' },
      { key: SECONDARY_LANG, value: 'Moscow' },
    ],
    slug: DEFAULT_CITY,
  },
];

export const MOCK_CITIES = [
  ...INITIAL_CITIES,
  {
    name: [
      { key: DEFAULT_LANG, value: 'Нью Йорк' },
      { key: SECONDARY_LANG, value: 'New York' },
    ],
    slug: SECONDARY_CITY,
  },
];

// Languages
export const INITIAL_LANGUAGES = [
  {
    key: DEFAULT_LANG,
    name: 'Русский',
    nativeName: 'Русский',
    isDefault: true,
  },
];

export const MOCK_LANGUAGES = [
  ...INITIAL_LANGUAGES,
  {
    key: SECONDARY_LANG,
    name: 'Английский',
    nativeName: 'English',
    isDefault: false,
  },
];

export const MOCK_METRICS = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'км/ч' },
      { key: SECONDARY_LANG, value: 'km/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мм' },
      { key: SECONDARY_LANG, value: 'mm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'шт.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м2' },
      { key: SECONDARY_LANG, value: 'm2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мест' },
      { key: SECONDARY_LANG, value: 'places' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'км' },
      { key: SECONDARY_LANG, value: 'km' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кВт' },
      { key: SECONDARY_LANG, value: 'kw' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'р.' },
      { key: SECONDARY_LANG, value: 'rub.' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'лет' },
      { key: SECONDARY_LANG, value: 'years' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'см' },
      { key: SECONDARY_LANG, value: 'cm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '%' },
      { key: SECONDARY_LANG, value: '%' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м' },
      { key: SECONDARY_LANG, value: 'm' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'часов' },
      { key: SECONDARY_LANG, value: 'hours' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кг' },
      { key: SECONDARY_LANG, value: 'kg' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'чел.' },
      { key: SECONDARY_LANG, value: 'people' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м/с' },
      { key: SECONDARY_LANG, value: 'm/s' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'год' },
      { key: SECONDARY_LANG, value: 'year' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мин.' },
      { key: SECONDARY_LANG, value: 'minutes' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'ед.' },
      { key: SECONDARY_LANG, value: 'units' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'мл.' },
      { key: SECONDARY_LANG, value: 'ml' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'л/ч.' },
      { key: SECONDARY_LANG, value: 'p/h' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Hz' },
      { key: SECONDARY_LANG, value: 'Hz' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Вт' },
      { key: SECONDARY_LANG, value: 'Wt' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°' },
      { key: SECONDARY_LANG, value: '°' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: '°C' },
      { key: SECONDARY_LANG, value: '°C' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'кд/м2' },
      { key: SECONDARY_LANG, value: 'kd/m2' },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'м3/ч' },
      { key: SECONDARY_LANG, value: 'm3/h' },
    ],
  },
];

// Options
export const MOCK_OPTIONS_WINE_COLOR = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Белый' },
      { key: SECONDARY_LANG, value: 'White' },
    ],
    priorities: [],
    views: [],
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Белая' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Белый' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Белое' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Красный' },
      { key: SECONDARY_LANG, value: 'Red' },
    ],
    priorities: [],
    views: [],
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Красная' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Красный' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Красное' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
    ],
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Розовый' },
      { key: SECONDARY_LANG, value: 'Pink' },
    ],
    priorities: [],
    views: [],
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: DEFAULT_LANG, value: 'Розовая' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: DEFAULT_LANG, value: 'Розовый' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: DEFAULT_LANG, value: 'Розовое' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
    ],
  },
];

export const MOCK_OPTIONS_WINE_VARIANT = [
  {
    name: [
      { key: DEFAULT_LANG, value: 'Портвейн' },
      { key: SECONDARY_LANG, value: 'Port_wine' },
    ],
    priorities: [],
    views: [],
    slug: 'portvein',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Херес' },
      { key: SECONDARY_LANG, value: 'Heres' },
    ],
    priorities: [],
    views: [],
    slug: 'heres',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Вермут' },
      { key: SECONDARY_LANG, value: 'Vermut' },
    ],
    priorities: [],
    views: [],
    slug: 'varmut',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: DEFAULT_LANG, value: 'Крепленое' },
      { key: SECONDARY_LANG, value: 'Hard' },
    ],
    priorities: [],
    views: [],
    slug: 'kreplenoe',
    gender: GENDER_IT,
  },
];

// Options groups
export const MOCK_OPTIONS_GROUP_COLORS = {
  name: [
    { key: DEFAULT_LANG, value: 'Цвета' },
    { key: SECONDARY_LANG, value: 'Colors' },
  ],
};

export const MOCK_OPTIONS_GROUP_WINE_VARIANTS = {
  name: [
    { key: DEFAULT_LANG, value: 'Типы_вина' },
    { key: SECONDARY_LANG, value: 'Wine_types' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_WINE_COLOR = {
  name: [
    { key: DEFAULT_LANG, value: 'Цвет_вина' },
    { key: SECONDARY_LANG, value: 'Wine_color' },
  ],
  views: [],
  priorities: [],
  slug: 'tsvet_vina',
  variant: ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_VARIANT = {
  name: [
    { key: DEFAULT_LANG, value: 'Тип_вина' },
    { key: SECONDARY_LANG, value: 'Wine_type' },
  ],
  views: [],
  priorities: [],
  slug: 'tip_vina',
  variant: ATTRIBUTE_VARIANT_SELECT,
};

export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: DEFAULT_LANG, value: 'Атрибут_строка' },
    { key: SECONDARY_LANG, value: 'Attribute_string' },
  ],
  views: [],
  priorities: [],
  slug: 'attribute_stroka',
  variant: ATTRIBUTE_VARIANT_STRING,
};

export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: DEFAULT_LANG, value: 'Атрибут_число' },
    { key: SECONDARY_LANG, value: 'Attribute_number' },
  ],
  views: [],
  priorities: [],
  slug: 'attribute_chislo',
  variant: ATTRIBUTE_VARIANT_NUMBER,
};

export const MOCK_ATTRIBUTES_GROUP_WINE_FEATURES = {
  name: [
    { key: DEFAULT_LANG, value: 'Характеристики_вина' },
    { key: SECONDARY_LANG, value: 'Wine_features' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: DEFAULT_LANG, value: 'Группа_атрибутов_для_удаления' },
    { key: SECONDARY_LANG, value: 'Group_for_delete' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES = {
  name: [
    { key: DEFAULT_LANG, value: 'Характеристики_виски' },
    { key: SECONDARY_LANG, value: 'Whiskey_features' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_VARIANT_ALCOHOL = {
  name: [
    { key: DEFAULT_LANG, value: 'Алкоголь' },
    { key: SECONDARY_LANG, value: 'Alcohol' },
  ],
};

export const MOCK_RUBRIC_VARIANT_JUICE = {
  name: [
    { key: DEFAULT_LANG, value: 'Соки' },
    { key: SECONDARY_LANG, value: 'Juice' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: DEFAULT_LANG, value: 'Вино' },
    { key: SECONDARY_LANG, value: 'Wine' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить вино' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'вино' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Шампанское и игристое' },
    { key: SECONDARY_LANG, value: 'Champagne' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить шампанское' },
      { key: SECONDARY_LANG, value: 'Buy a champagne' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'шампанское' },
      { key: SECONDARY_LANG, value: 'champagne' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_C = {
  name: [
    { key: DEFAULT_LANG, value: 'Виски' },
    { key: SECONDARY_LANG, value: 'Whiskey' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить Виски' },
      { key: SECONDARY_LANG, value: 'Buy a Whiskey' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'Виски' },
      { key: SECONDARY_LANG, value: 'Whiskey' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_ONE_D = {
  name: [
    { key: DEFAULT_LANG, value: 'Коньяк' },
    { key: SECONDARY_LANG, value: 'Cognac' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Купить коньяк' },
      { key: SECONDARY_LANG, value: 'Buy a cognac' },
    ],
    prefix: [
      { key: DEFAULT_LANG, value: 'Купить' },
      { key: SECONDARY_LANG, value: 'Buy a' },
    ],
    keyword: [
      { key: DEFAULT_LANG, value: 'коньяк' },
      { key: SECONDARY_LANG, value: 'cognac' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_ONE,
  priority: DEFAULT_PRIORITY,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Второй_уровень_1' },
    { key: SECONDARY_LANG, value: 'Second_level_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Второй уровень 1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Второй уровень 1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_SHE,
  },
  level: RUBRIC_LEVEL_TWO,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_TWO_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Второй_уровень_2' },
    { key: SECONDARY_LANG, value: 'Second_level_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Второй уровень 2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Второй уровень 2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_TWO,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_1_1' },
    { key: SECONDARY_LANG, value: 'Third_level_1_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_1_2' },
    { key: SECONDARY_LANG, value: 'Third_level_1_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 1_2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_A = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_2_1' },
    { key: SECONDARY_LANG, value: 'Third_level_2_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_1' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_1' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_B = {
  name: [
    { key: DEFAULT_LANG, value: 'Третий_уровень_2_2' },
    { key: SECONDARY_LANG, value: 'Third_level_2_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_2' },
      { key: SECONDARY_LANG, value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: DEFAULT_LANG, value: 'Третий уровень 2_2' },
      { key: SECONDARY_LANG, value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
  priority: DEFAULT_PRIORITY,
};

// Products
export const MOCK_PRODUCT_A = {
  priority: 10,
  slug: 'Wine_Brancott_Estate',
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Brancott_Estate' },
    { key: SECONDARY_LANG, value: 'Wine_Brancott_Estate' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Brancott Estate Marlborough Sauvignon Blanc' },
    { key: SECONDARY_LANG, value: 'Wine Brancott Estate Marlborough Sauvignon Blanc' },
  ],
  price: 100,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_B = {
  priority: 9,
  slug: 'Wine_Campo_Vieja',
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Campo_Vieja' },
    { key: SECONDARY_LANG, value: 'Wine_Campo_Vieja' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Campo Vieja Tempranillo Rioja DOC' },
    { key: SECONDARY_LANG, value: 'Wine Campo Vieja Tempranillo Rioja DOC' },
  ],
  price: 200,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_C = {
  priority: 1,
  slug: 'Wine_Val_de_Vie',
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Val_de_Vie' },
    { key: SECONDARY_LANG, value: 'Wine_Val_de_Vie' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Val de Vie, "Barista" Pinotage' },
    { key: SECONDARY_LANG, value: 'Wine Val de Vie, "Barista" Pinotage' },
  ],
  price: 50,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_D = {
  priority: 1,
  slug: 'Wine_Val_de_Vie_C',
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Val_de_Vie_C' },
    { key: SECONDARY_LANG, value: 'Wine_Val_de_Vie_C' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Val de "Barista" Pinotage' },
    { key: SECONDARY_LANG, value: 'Wine Val de, "Barista" Pinotage' },
  ],
  price: 1150,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_E = {
  priority: 1,
  slug: 'Wine_Val_de_Vie_D',
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Val_de_Vie_D' },
    { key: SECONDARY_LANG, value: 'Wine_Val_de_Vie_D' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Vie, "Barista" Pinotage' },
    { key: SECONDARY_LANG, value: 'Wine Vie, "Barista" Pinotage' },
  ],
  price: 500,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_NEW = {
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Sogrape_Vinhos' },
    { key: SECONDARY_LANG, value: 'Wine_Sogrape_Vinhos' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Sogrape Vinhos, Gazela Vinho Verde DOC' },
    { key: SECONDARY_LANG, value: 'Wine Sogrape Vinhos, Gazela Vinho Verde DOC' },
  ],
  price: 2000,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_CREATE = {
  name: [
    { key: DEFAULT_LANG, value: 'Вино_Luis_Felipe_Edwards' },
    { key: SECONDARY_LANG, value: 'Wine_Luis_Felipe_Edwards' },
  ],
  cardName: [
    { key: DEFAULT_LANG, value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
    { key: SECONDARY_LANG, value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
  ],
  price: 2000,
  description: [
    { key: DEFAULT_LANG, value: 'Очень длинное описание товара' },
    { key: SECONDARY_LANG, value: 'Very long product description' },
  ],
};
