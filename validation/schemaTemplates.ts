import { colorRegEx, phoneRegEx } from 'validation/regExp';
import * as Yup from 'yup';
import { ValidationSchemaArgsInterface } from 'types/validataionTypes';
import { MessageSlug } from 'types/messageSlugTypes';
import { DEFAULT_LOCALE } from 'config/common';
import {
  getFieldValidationMessage,
  GetFieldValidationMessageInterface,
} from 'lib/getFieldValidationMessage';

export const minDescriptionLength = 10;
export const maxDescriptionLength = 1000;
export const minNameLength = 2;
export const maxNameLength = 150;
export const minPrice = 1;

// HEX color schema
export const colorSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.lazy((value?: string | null) => {
    return !value
      ? Yup.string().nullable()
      : Yup.string()
          .trim()
          .matches(
            colorRegEx,
            getFieldValidationMessage({
              ...args,
              slug: 'validation.color',
            }),
          );
  });
};

// Email schema
export const emailSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .email(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.email',
      }),
    )
    .trim()
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.email.required',
      }),
    );
};

// Phone schema
export const phoneSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .matches(
      phoneRegEx,
      getFieldValidationMessage({
        ...args,
        slug: 'validation.phone',
      }),
    )
    .required(
      getFieldValidationMessage({
        ...args,
        slug: 'validation.phone.required',
      }),
    );
};

// ObjectId schema
export const objectIdSchema = (args: GetFieldValidationMessageInterface) => {
  return Yup.string().nullable().required(getFieldValidationMessage(args));
};

// Contacts schema
export const contactsInputSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    emails: Yup.array().of(emailSchema(args)),
    phones: Yup.array().of(phoneSchema(args)),
  });
};

// Coordinates schema
export const coordinatesSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    lat: Yup.number()
      .nullable()
      .required(getFieldValidationMessage({ ...args, slug: 'validation.point.lat' })),
    lng: Yup.number()
      .nullable()
      .required(getFieldValidationMessage({ ...args, slug: 'validation.point.lng' })),
  }).nullable();
};

// Address schema
export const addressSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.object({
    formattedAddress: Yup.string()
      .nullable()
      .required(getFieldValidationMessage({ ...args, slug: 'validation.address' })),
    point: coordinatesSchema(args),
  })
    .nullable()
    .required(getFieldValidationMessage({ ...args, slug: 'validation.address' }));
};

interface RequiredFieldSchemaInterface extends ValidationSchemaArgsInterface {
  slug: MessageSlug;
  min?: number;
  max?: number;
}

// Required string schema
export const requiredStringSchema = ({
  messages,
  locale,
  min,
  max,
  slug,
}: RequiredFieldSchemaInterface) => {
  const minLength = min || minNameLength;
  const maxLength = max || maxNameLength;

  return Yup.string()
    .min(
      minLength,
      getFieldValidationMessage({ messages, locale, slug: 'validation.string.min' }) +
        ` ${minLength}`,
    )
    .max(
      maxLength,
      getFieldValidationMessage({ messages, locale, slug: 'validation.string.max' }) +
        ` ${maxLength}`,
    )
    .required(getFieldValidationMessage({ messages, locale, slug: slug }));
};

// Required number schema
export const requiredNumberSchema = ({
  messages,
  locale,
  min,
  slug,
}: RequiredFieldSchemaInterface) => {
  const minLength = min || 0;

  return Yup.number()
    .min(
      minLength,
      getFieldValidationMessage({ messages, locale, slug: 'validation.number.min' }) +
        ` ${minLength}`,
    )
    .required(getFieldValidationMessage({ messages, locale, slug: slug }));
};

// Required url schema
export const requiredUrlSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string().url(getFieldValidationMessage({ ...args, slug: 'validation.url' }));
};

// Required asset schema
export const requiredAssetSchema = ({ slug, ...args }: RequiredFieldSchemaInterface) => {
  const message = getFieldValidationMessage({
    ...args,
    slug: slug,
  });

  return Yup.array()
    .of(
      Yup.mixed()
        .required(message)
        .test('file', message, (value) => {
          return value;
        }),
    )
    .min(1, message)
    .required(message);
};

// Not required url schema
export const notRequiredUrlSchema = (args: ValidationSchemaArgsInterface) => {
  return Yup.string()
    .url(getFieldValidationMessage({ ...args, slug: 'validation.url' }))
    .nullable();
};

// Not domain url schema
const domainPatterns = {
  domain: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
  cyrillicDomain:
    /^((http|https):\/\/)?[a-zа-я0-9]+([\-\.]{1}[a-zа-я0-9]+)*\.[a-zа-я]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
};
export const notRequiredDomainSchema = (args: ValidationSchemaArgsInterface) => {
  const domainRules = [domainPatterns.domain, domainPatterns.cyrillicDomain];

  return Yup.string()
    .test({
      message: getFieldValidationMessage({ ...args, slug: 'validation.domain' }),
      test: (value: any) => {
        return (
          value === null ||
          value === '' ||
          value === undefined ||
          domainRules.some((regex) => {
            return regex.test(value);
          })
        );
      },
    })
    .nullable();
};

// Required string translation schema
export const requiredStringTranslationSchema = (args: RequiredFieldSchemaInterface) => {
  return Yup.object({
    [DEFAULT_LOCALE]: requiredStringSchema(args),
  });
};

// Not required string translation schema
export const notRequiredStringTranslationSchema = () => {
  return Yup.object({
    [DEFAULT_LOCALE]: Yup.string().nullable(),
  }).nullable();
};

// Required number translation schema
export const requiredNumberTranslationSchema = (args: RequiredFieldSchemaInterface) => {
  return Yup.object({
    [DEFAULT_LOCALE]: requiredNumberSchema(args),
  });
};

// Not required number translation schema
export const notRequiredNumberTranslationSchema = () => {
  return Yup.object({
    [DEFAULT_LOCALE]: Yup.number().nullable(),
  }).nullable();
};
