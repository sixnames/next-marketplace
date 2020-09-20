import React from 'react';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';
import classes from './ProductAttributesItem.module.css';
import FormikArrayCheckboxLine from '../../FormElements/Checkbox/FormikArrayCheckboxLine';
import InputLine from '../../FormElements/Input/InputLine';
import {
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
} from '@yagu/config';
import { ProductAttributesGroupType } from './ProductAttributes';

export type AttributeType = ProductAttributesGroupType['attributes'][0];

interface ProductAttributesItemInterface {
  attribute: AttributeType;
  inputName: string;
  groupIndex: number;
}

const ProductAttributesItem: React.FC<ProductAttributesItemInterface> = ({
  attribute,
  inputName,
  groupIndex,
}) => {
  const { variant, options, nameString, metric } = attribute;
  const firstValueIndex = 0;
  const labelPostfix = metric ? metric.nameString : '';

  const optionsList = options ? options.options : [];

  const singleValueInputName = `${inputName}.value[${firstValueIndex}]`;
  const multipleValueInputName = `${inputName}.value`;

  function getAttributeInput() {
    if (variant === ATTRIBUTE_VARIANT_NUMBER || variant === ATTRIBUTE_VARIANT_STRING) {
      return (
        <FormikInput
          min={variant === 'string' ? undefined : 0}
          label={nameString}
          labelPostfix={labelPostfix}
          type={variant === ATTRIBUTE_VARIANT_STRING ? 'text' : 'number'}
          name={singleValueInputName}
          testId={`${nameString}-${groupIndex}`}
        />
      );
    }

    if (variant === ATTRIBUTE_VARIANT_SELECT) {
      return (
        <FormikSelect
          label={nameString}
          labelPostfix={labelPostfix}
          options={optionsList}
          firstOption={'Не выбрано'}
          name={singleValueInputName}
          testId={`${nameString}-${groupIndex}`}
        />
      );
    }

    if (variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT && options) {
      return (
        <InputLine name={multipleValueInputName} label={nameString}>
          {optionsList.map(({ id, nameString }) => {
            return (
              <FormikArrayCheckboxLine
                name={multipleValueInputName}
                value={id}
                key={id}
                label={nameString}
                testId={`${nameString}-${groupIndex}`}
                inList
              />
            );
          })}
        </InputLine>
      );
    }

    return null;
  }

  return (
    <div className={classes.frame}>
      {getAttributeInput()}

      <FormikCheckboxLine
        label={'Показать в карточке товара'}
        name={`${inputName}.showInCard`}
        testId={`${nameString}-${groupIndex}-showInCard`}
        low
      />
    </div>
  );
};

export default ProductAttributesItem;
