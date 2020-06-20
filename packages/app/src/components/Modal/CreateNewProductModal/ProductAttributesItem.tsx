import React from 'react';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';
import { ProductAttributesGroupType } from './ProductAttributesList';
import classes from './ProductAttributesItem.module.css';
import FormikArrayCheckboxLine from '../../FormElements/Checkbox/FormikArrayCheckboxLine';
import InputLine from '../../FormElements/Input/InputLine';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
} from '@rg/config';

export type AttributeType = ProductAttributesGroupType['node']['attributes'][0];

interface ProductAttributesItemInterface {
  attribute: AttributeType;
  inputName: string;
}

const ProductAttributesItem: React.FC<ProductAttributesItemInterface> = ({
  attribute,
  inputName,
}) => {
  const { type, options, name, metric, slug } = attribute;
  const firstValueIndex = 0;
  const labelPostfix = metric ? metric.name : '';

  const optionsList = options ? options.options : [];

  const singleValueInputName = `${inputName}.value.${slug}[${firstValueIndex}]`;
  const multipleValueInputName = `${inputName}.value.${slug}`;

  function getAttributeInput() {
    if (type === ATTRIBUTE_TYPE_NUMBER || type === ATTRIBUTE_TYPE_STRING) {
      return (
        <FormikInput
          min={type === 'string' ? undefined : 0}
          label={name}
          labelPostfix={labelPostfix}
          type={type === ATTRIBUTE_TYPE_STRING ? 'text' : 'number'}
          name={singleValueInputName}
          testId={name}
        />
      );
    }

    if (type === ATTRIBUTE_TYPE_SELECT) {
      return (
        <FormikSelect
          label={name}
          labelPostfix={labelPostfix}
          options={optionsList}
          firstOption={'Не выбрано'}
          name={singleValueInputName}
          testId={slug}
        />
      );
    }

    if (type === ATTRIBUTE_TYPE_MULTIPLE_SELECT && options) {
      return (
        <InputLine name={multipleValueInputName} label={name}>
          {optionsList.map(({ id, name }) => {
            return (
              <FormikArrayCheckboxLine
                name={multipleValueInputName}
                value={id}
                key={id}
                label={name}
                testId={name}
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
        testId={`${name}-showInCard`}
        low
      />
    </div>
  );
};

export default ProductAttributesItem;
