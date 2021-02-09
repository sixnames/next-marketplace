import * as React from 'react';
import { useFormikContext } from 'formik';
import RequestError from 'components/RequestError/RequestError';
import {
  ProductAttributeAstFragment,
  useGetProductAttributesAstQuery,
} from 'generated/apolloComponents';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import classes from 'components/FormTemplates/ProductAttributesInput.module.css';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
} from 'config/common';
import FormikArrayCheckboxLine from 'components/FormElements/Checkbox/FormikArrayCheckboxLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';

interface ProductAttributesInputItemInterface {
  attributeAst: ProductAttributeAstFragment;
  inputName: string;
}

const ProductAttributesInputItem: React.FC<ProductAttributesInputItemInterface> = ({
  attributeAst,
  inputName,
}) => {
  const { attribute } = attributeAst;
  const { variant, options, metric, name } = attribute;
  const firstValueIndex = 0;
  const labelPostfix = metric ? metric.name : '';

  const singleValueInputName = `${inputName}.selectedOptionsSlugs[${firstValueIndex}]`;
  const multipleValueInputName = `${inputName}.selectedOptionsSlugs`;
  const numberInputName = `${inputName}.number`;
  const textInputName = `${inputName}.textI18n`;

  const testId = attribute.name;

  return (
    <div className={classes.attribute}>
      {variant === ATTRIBUTE_VARIANT_NUMBER ? (
        <FormikInput
          min={0}
          label={name}
          labelPostfix={labelPostfix}
          type={'number'}
          name={numberInputName}
          testId={testId}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_STRING ? (
        <FormikTranslationsInput
          label={name}
          labelPostfix={labelPostfix}
          name={textInputName}
          testId={testId}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_SELECT && options && options.length > 0 ? (
        <FormikSelect
          label={name}
          labelPostfix={labelPostfix}
          options={options}
          firstOption={'Не выбрано'}
          name={singleValueInputName}
          testId={testId}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT && options && options.length > 0 ? (
        <InputLine name={multipleValueInputName} label={name}>
          {options.map(({ slug, name }) => {
            return (
              <FormikArrayCheckboxLine
                name={multipleValueInputName}
                value={slug}
                key={slug}
                label={name}
                testId={`${testId}-${name}`}
                inList
              />
            );
          })}
        </InputLine>
      ) : null}

      <FormikCheckboxLine
        label={'Показать в карточке товара'}
        name={`${inputName}.showInCard`}
        testId={`${testId}-showInCard`}
        low
      />

      <FormikCheckboxLine
        label={'Показать в крошках карточки товара'}
        name={`${inputName}.showAsBreadcrumb`}
        testId={`${testId}-showAsBreadcrumb`}
        low
      />
    </div>
  );
};

interface CreateNewProductAttributesSelectInterface {
  productId?: string | null;
  rubricsIds: string[];
}

const ProductAttributesInput: React.FC<CreateNewProductAttributesSelectInterface> = ({
  rubricsIds,
  productId,
}) => {
  const [attributes, setAttributes] = React.useState<ProductAttributeAstFragment[]>([]);
  const { data, error } = useGetProductAttributesAstQuery({
    variables: {
      input: {
        productId,
        rubricsIds,
      },
    },
    fetchPolicy: 'network-only',
  });
  const { setFieldValue, values } = useFormikContext<ProductFormValuesInterface>();

  React.useEffect(() => {
    if (data && data.getProductAttributesAST) {
      setAttributes(data.getProductAttributesAST);
    }
  }, [data, setFieldValue]);

  React.useEffect(() => {
    setFieldValue('attributes', attributes);
  }, [attributes, setFieldValue]);

  if (!data || error) {
    return <RequestError />;
  }

  return (
    <div>
      {values.attributes.map((astAttribute, index) => {
        return (
          <ProductAttributesInputItem
            key={astAttribute.attribute._id}
            attributeAst={astAttribute}
            inputName={`attributes[${index}]`}
          />
        );
      })}
    </div>
  );
};

export default ProductAttributesInput;
