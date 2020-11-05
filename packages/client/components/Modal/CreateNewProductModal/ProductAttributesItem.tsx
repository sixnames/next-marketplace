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
import { FeaturesAstAttributeFragment } from '../../../generated/apolloComponents';

interface ProductAttributesItemInterface {
  attribute: FeaturesAstAttributeFragment;
  inputName: string;
  groupIndex: number;
}

const ProductAttributesItem: React.FC<ProductAttributesItemInterface> = ({
  attribute,
  inputName,
  groupIndex,
}) => {
  const { variant, optionsGroup, nameString, metric } = attribute;
  const firstValueIndex = 0;
  const labelPostfix = metric ? metric.nameString : '';

  const optionsList = optionsGroup ? optionsGroup.options : [];

  const singleValueInputName = `${inputName}.value[${firstValueIndex}]`;
  const multipleValueInputName = `${inputName}.value`;

  return (
    <div className={classes.frame}>
      {variant === ATTRIBUTE_VARIANT_NUMBER || variant === ATTRIBUTE_VARIANT_STRING ? (
        <FormikInput
          min={variant === 'string' ? undefined : 0}
          label={nameString}
          labelPostfix={labelPostfix}
          type={variant === ATTRIBUTE_VARIANT_STRING ? 'text' : 'number'}
          name={singleValueInputName}
          testId={`${nameString}-${groupIndex}`}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_SELECT ? (
        <FormikSelect
          label={nameString}
          labelPostfix={labelPostfix}
          options={optionsList}
          firstOption={'Не выбрано'}
          name={singleValueInputName}
          testId={`${nameString}-${groupIndex}`}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT && optionsGroup ? (
        <InputLine name={multipleValueInputName} label={nameString}>
          {optionsList.map(({ slug, nameString }) => {
            return (
              <FormikArrayCheckboxLine
                name={multipleValueInputName}
                value={slug}
                key={slug}
                label={nameString}
                testId={`${nameString}-${groupIndex}`}
                inList
              />
            );
          })}
        </InputLine>
      ) : null}

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
