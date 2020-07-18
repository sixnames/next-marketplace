const { env } = process || { env: {} };

export const { NODE_ENV, HTTP_PORT = 4000 } = env;

export const IN_PROD = NODE_ENV === 'production';
export const IN_TEST = NODE_ENV === 'test';
export const IN_DEV = NODE_ENV === 'development';

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
