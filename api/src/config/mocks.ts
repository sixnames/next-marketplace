import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
  DEFAULT_LANG,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_TWO,
  SECONDARY_LANG,
} from './common';

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
    id: 'en',
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
    id: 'ru',
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

export const INITIAL_LANGUAGES = [
  {
    key: DEFAULT_LANG,
    name: 'Русский',
    nativeName: 'Русский',
    isDefault: true,
  },
];

export const MOCK_LANGUAGES = [
  {
    key: DEFAULT_LANG,
    name: 'Русский',
    nativeName: 'Русский',
    isDefault: true,
  },
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
      { key: 'ru', value: 'км/ч' },
      { key: 'en', value: 'km/h' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мм' },
      { key: 'en', value: 'mm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'шт.' },
      { key: 'en', value: 'units' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м2' },
      { key: 'en', value: 'm2' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мест' },
      { key: 'en', value: 'places' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'км' },
      { key: 'en', value: 'km' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кВт' },
      { key: 'en', value: 'kw' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'руб.' },
      { key: 'en', value: 'rub.' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'лет' },
      { key: 'en', value: 'years' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'см' },
      { key: 'en', value: 'cm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '%' },
      { key: 'en', value: '%' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м' },
      { key: 'en', value: 'm' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'часов' },
      { key: 'en', value: 'hours' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кг' },
      { key: 'en', value: 'kg' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'чел.' },
      { key: 'en', value: 'people' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м/с' },
      { key: 'en', value: 'm/s' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'год' },
      { key: 'en', value: 'year' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мин.' },
      { key: 'en', value: 'minutes' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'ед.' },
      { key: 'en', value: 'units' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'мл.' },
      { key: 'en', value: 'ml' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'л/ч.' },
      { key: 'en', value: 'p/h' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Hz' },
      { key: 'en', value: 'Hz' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Вт' },
      { key: 'en', value: 'Wt' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '°' },
      { key: 'en', value: '°' },
    ],
  },
  {
    name: [
      { key: 'ru', value: '°C' },
      { key: 'en', value: '°C' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'кд/м2' },
      { key: 'en', value: 'kd/m2' },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'м3/ч' },
      { key: 'en', value: 'm3/h' },
    ],
  },
];

// Options
export const MOCK_OPTIONS_WINE_COLOR = [
  {
    name: [
      { key: 'ru', value: 'Белый' },
      { key: 'en', value: 'White' },
    ],
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Белая' },
          { key: 'en', value: 'White' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Белый' },
          { key: 'en', value: 'White' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Белое' },
          { key: 'en', value: 'White' },
        ],
      },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Красный' },
      { key: 'en', value: 'Red' },
    ],
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Красная' },
          { key: 'en', value: 'Red' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Красный' },
          { key: 'en', value: 'Red' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Красное' },
          { key: 'en', value: 'Red' },
        ],
      },
    ],
  },
  {
    name: [
      { key: 'ru', value: 'Розовый' },
      { key: 'en', value: 'Pink' },
    ],
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        key: GENDER_SHE,
        value: [
          { key: 'ru', value: 'Розовая' },
          { key: 'en', value: 'Pink' },
        ],
      },
      {
        key: GENDER_HE,
        value: [
          { key: 'ru', value: 'Розовый' },
          { key: 'en', value: 'Pink' },
        ],
      },
      {
        key: GENDER_IT,
        value: [
          { key: 'ru', value: 'Розовое' },
          { key: 'en', value: 'Pink' },
        ],
      },
    ],
  },
];

export const MOCK_OPTIONS_WINE_TYPE = [
  {
    name: [
      { key: 'ru', value: 'Портвейн' },
      { key: 'en', value: 'Port_wine' },
    ],
    slug: 'portvein',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Херес' },
      { key: 'en', value: 'Heres' },
    ],
    slug: 'heres',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Вермут' },
      { key: 'en', value: 'Vermut' },
    ],
    slug: 'varmut',
    gender: GENDER_HE,
  },
  {
    name: [
      { key: 'ru', value: 'Крепленое' },
      { key: 'en', value: 'Hard' },
    ],
    slug: 'kreplenoe',
    gender: GENDER_IT,
  },
];

// Options groups
export const MOCK_OPTIONS_GROUP_COLORS = {
  name: [
    { key: 'ru', value: 'Цвета' },
    { key: 'en', value: 'Colors' },
  ],
};

export const MOCK_OPTIONS_GROUP_WINE_TYPES = {
  name: [
    { key: 'ru', value: 'Типы_вина' },
    { key: 'en', value: 'Wine_types' },
  ],
};

// Attributes
export const MOCK_ATTRIBUTE_WINE_COLOR = {
  name: [
    { key: 'ru', value: 'Цвет_вина' },
    { key: 'en', value: 'Wine_color' },
  ],
  slug: 'tsvet_vina',
  variant: ATTRIBUTE_TYPE_MULTIPLE_SELECT,
};

export const MOCK_ATTRIBUTE_WINE_TYPE = {
  name: [
    { key: 'ru', value: 'Тип_вина' },
    { key: 'en', value: 'Wine_type' },
  ],
  slug: 'tip_vina',
  variant: ATTRIBUTE_TYPE_SELECT,
};

export const MOCK_ATTRIBUTE_STRING = {
  name: [
    { key: 'ru', value: 'Атрибут_строка' },
    { key: 'en', value: 'Attribute_string' },
  ],
  slug: 'attribute_stroka',
  variant: ATTRIBUTE_TYPE_STRING,
};

export const MOCK_ATTRIBUTE_NUMBER = {
  name: [
    { key: 'ru', value: 'Атрибут_число' },
    { key: 'en', value: 'Attribute_number' },
  ],
  slug: 'attribute_chislo',
  variant: ATTRIBUTE_TYPE_NUMBER,
};

export const MOCK_ATTRIBUTES_GROUP_WINE_FEATURES = {
  name: [
    { key: 'ru', value: 'Характеристики_вина' },
    { key: 'en', value: 'Wine_features' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_FOR_DELETE = {
  name: [
    { key: 'ru', value: 'Группа_атрибутов_для_удаления' },
    { key: 'en', value: 'Group_for_delete' },
  ],
};

export const MOCK_ATTRIBUTES_GROUP_WHISKEY_FEATURES = {
  name: [
    { key: 'ru', value: 'Характеристики_виски' },
    { key: 'en', value: 'Whiskey_features' },
  ],
};

// Rubrics
export const MOCK_RUBRIC_TYPE_ALCOHOL = {
  name: [
    { key: 'ru', value: 'Алкоголь' },
    { key: 'en', value: 'Alcohol' },
  ],
};

export const MOCK_RUBRIC_TYPE_JUICE = {
  name: [
    { key: 'ru', value: 'Соки' },
    { key: 'en', value: 'Juice' },
  ],
};

export const MOCK_RUBRIC_LEVEL_ONE = {
  name: [
    { key: 'ru', value: 'Вино' },
    { key: 'en', value: 'Wine' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Купить вино' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [
      { key: 'ru', value: 'Купить' },
      { key: 'en', value: 'Buy a' },
    ],
    keyword: [
      { key: 'ru', value: 'вино' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_ONE,
  parent: null,
};

export const MOCK_RUBRIC_LEVEL_TWO_A = {
  name: [
    { key: 'ru', value: 'Второй_уровень_1' },
    { key: 'en', value: 'Second_level_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Второй уровень 1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Второй уровень 1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_SHE,
  },
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_TWO_B = {
  name: [
    { key: 'ru', value: 'Второй_уровень_2' },
    { key: 'en', value: 'Second_level_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Второй уровень 2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Второй уровень 2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_HE,
  },
  level: RUBRIC_LEVEL_TWO,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_1' },
    { key: 'en', value: 'Third_level_1_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 1_1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 1_1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_A_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_1_2' },
    { key: 'en', value: 'Third_level_1_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 1_2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 1_2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_A = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_1' },
    { key: 'en', value: 'Third_level_2_1' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 2_1' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 2_1' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

export const MOCK_RUBRIC_LEVEL_THREE_B_B = {
  name: [
    { key: 'ru', value: 'Третий_уровень_2_2' },
    { key: 'en', value: 'Third_level_2_2' },
  ],
  catalogueTitle: {
    defaultTitle: [
      { key: 'ru', value: 'Третий уровень 2_2' },
      { key: 'en', value: 'Buy a wine' },
    ],
    prefix: [],
    keyword: [
      { key: 'ru', value: 'Третий уровень 2_2' },
      { key: 'en', value: 'wine' },
    ],
    gender: GENDER_IT,
  },
  level: RUBRIC_LEVEL_THREE,
};

// Products
export const MOCK_PRODUCT_A = {
  name: [
    { key: 'ru', value: 'Вино_Brancott_Estate' },
    { key: 'en', value: 'Wine_Brancott_Estate' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Brancott Estate Marlborough Sauvignon Blanc' },
    { key: 'en', value: 'Wine Brancott Estate Marlborough Sauvignon Blanc' },
  ],
  price: 100,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_B = {
  name: [
    { key: 'ru', value: 'Вино_Campo_Viejо' },
    { key: 'en', value: 'Wine_Campo_Viejо' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Campo Viejо Tempranillo Rioja DOC' },
    { key: 'en', value: 'Wine Campo Viejо Tempranillo Rioja DOC' },
  ],
  price: 200,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_C = {
  name: [
    { key: 'ru', value: 'Вино_Val_de_Vie' },
    { key: 'en', value: 'Wine_Val_de_Vie' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Val de Vie, "Barista" Pinotage' },
    { key: 'en', value: 'Wine Val de Vie, "Barista" Pinotage' },
  ],
  price: 50,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_NEW = {
  name: [
    { key: 'ru', value: 'Вино_Sogrape_Vinhos' },
    { key: 'en', value: 'Wine_Sogrape_Vinhos' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Sogrape Vinhos, Gazela Vinho Verde DOC' },
    { key: 'en', value: 'Wine Sogrape Vinhos, Gazela Vinho Verde DOC' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};

export const MOCK_PRODUCT_CREATE = {
  name: [
    { key: 'ru', value: 'Вино_Luis_Felipe_Edwards' },
    { key: 'en', value: 'Wine_Luis_Felipe_Edwards' },
  ],
  cardName: [
    { key: 'ru', value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
    { key: 'en', value: 'Вино Luis Felipe Edwards, "Reserva" Shiraz' },
  ],
  price: 2000,
  description: [
    { key: 'ru', value: 'Очень длинное описание товара' },
    { key: 'en', value: 'Very long product description' },
  ],
};
