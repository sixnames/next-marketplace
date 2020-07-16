import { AttributeModel } from '../entities/Attribute';
import { OptionModel, OptionVariant } from '../entities/Option';
import getLangField from './getLangField';
import { GenderEnum, LanguageType } from '../entities/common';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  DEFAULT_LANG,
  LANG_DEFAULT_TITLE_SEPARATOR,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  LANG_SECONDARY_TITLE_SEPARATOR,
} from '../config';
import { RubricNode } from '../entities/Rubric';
import capitalize from 'capitalize';

interface ProcessedAttributeInterface {
  key: string;
  value: string[];
}

export function getOptionFromParam(paramString: string): { key: string; value: string[] } {
  const param = paramString.split('-');
  return { key: `${param[0]}`, value: [`${param[1]}`] };
}

export function attributesReducer(
  acc: { key: string; value: string[] }[] = [],
  item: string,
): ProcessedAttributeInterface[] {
  const param = getOptionFromParam(item);
  const existingParam = acc.findIndex((item) => item.key === param.key);
  if (existingParam >= 0) {
    const existingItem = acc[existingParam];
    acc[existingParam] = {
      key: param.key,
      value: [...existingItem.value, ...param.value],
    };
    return [...acc];
  }
  return [...acc, { key: param.key, value: param.value }];
}

interface GetCatalogueTitleInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
  rubric: RubricNode;
}

interface GetTitleConfigsInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
}

interface GetTitleStringsInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
  rubricGender: GenderEnum;
  titleSeparator: string;
}

interface TitleConfigInterface {
  positioningInTitle: string;
  options: {
    variants?: OptionVariant[] | null;
    name: LanguageType[];
    gender?: GenderEnum | null;
  }[];
}

interface TitleStringsInterface {
  positioningInTitle: string;
  value: string;
}

async function getTitleConfigs({
  processedAttributes,
  lang,
}: GetTitleConfigsInterface): Promise<TitleConfigInterface[]> {
  return Promise.all(
    processedAttributes.map(async ({ key, value }) => {
      const attribute = await AttributeModel.findOne({ slug: key }).select({
        positioningInTitle: 1,
      });

      const options = await OptionModel.find({ slug: { $in: value } }).select({
        variants: 1,
        name: 1,
        gender: 1,
      });

      const optionsVariants = options.map(({ variants, name, gender }) => {
        return {
          variants,
          name,
          gender,
        };
      });

      return {
        positioningInTitle: getLangField(attribute!.positioningInTitle, lang),
        options: optionsVariants,
      };
    }),
  );
}

async function getTitleStrings({
  processedAttributes,
  lang,
  rubricGender,
  titleSeparator,
}: GetTitleStringsInterface): Promise<TitleStringsInterface[]> {
  const titleConfigs = await getTitleConfigs({ processedAttributes, lang });
  const replaceAttributesGenders = titleConfigs.reduce(
    (acc: GenderEnum[], { positioningInTitle, options }) => {
      if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
        const gendersList = options.reduce((genderAcc: GenderEnum[], { gender }) => {
          if (gender) {
            return [...genderAcc, gender];
          }
          return genderAcc;
        }, []);

        return [...acc, ...gendersList];
      }
      return acc;
    },
    [],
  );

  const finalGender = replaceAttributesGenders.length ? replaceAttributesGenders[0] : rubricGender;

  return titleConfigs.map(({ positioningInTitle, options }) => {
    return {
      positioningInTitle,
      value: options
        .map(({ variants, name }) => {
          if (variants && variants.length) {
            const currentVariant = variants.find(({ key }) => {
              return key === finalGender;
            });
            if (!currentVariant) {
              return LANG_NOT_FOUND_FIELD_MESSAGE;
            }
            return getLangField(currentVariant.value, lang);
          }
          return getLangField(name, lang);
        })
        .join(titleSeparator),
    };
  });
}

export async function getCatalogueTitle({
  processedAttributes,
  lang,
  rubric,
}: GetCatalogueTitleInterface): Promise<string> {
  const {
    catalogueTitle: { gender, defaultTitle, keyword, prefix },
  } = rubric;

  if (!processedAttributes.length || !processedAttributes) {
    return getLangField(defaultTitle, lang);
  }

  const titleSeparator =
    lang === DEFAULT_LANG ? LANG_DEFAULT_TITLE_SEPARATOR : LANG_SECONDARY_TITLE_SEPARATOR;

  const titleConfigs = await getTitleStrings({
    processedAttributes,
    lang,
    rubricGender: gender,
    titleSeparator,
  });
  const rubricKeyword = getLangField(keyword, lang);

  const finalPrefix = prefix ? getLangField(prefix, lang) : '';
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  let finalKeyword = rubricKeyword;
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];

  titleConfigs.forEach(({ positioningInTitle, value }) => {
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      if (finalKeyword === rubricKeyword) {
        finalKeyword = value;
      } else {
        finalKeyword = finalKeyword + titleSeparator + value;
      }
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  return capitalize(
    [finalPrefix, ...beginOfTitle, ...beforeKeyword, finalKeyword, ...afterKeyword, ...endOfTitle]
      .join(' ')
      .toLocaleLowerCase(),
  );
}
