import React, { useEffect, useMemo, useState } from 'react';
import classes from './ProductAttributes.module.css';
import { useFormikContext } from 'formik';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';
import {
  AttributeViewOptionFragment,
  FeaturesAstAttributeFragment,
  FeaturesAstGroupFragment,
  UpdateProductInput,
  useGetFeaturesAstQuery,
} from '../../../generated/apolloComponents';
import RequestError from '../../RequestError/RequestError';
import FormikInput from '../../FormElements/Input/FormikInput';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import InputLine from '../../FormElements/Input/InputLine';
import FormikArrayCheckboxLine from '../../FormElements/Checkbox/FormikArrayCheckboxLine';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  ATTRIBUTE_VIEW_VARIANT_LIST,
} from '@yagu/shared';

interface ProductAttributesItemInterface {
  attribute: FeaturesAstAttributeFragment;
  inputName: string;
  groupName: string;
  viewOptions: AttributeViewOptionFragment[];
}

const ProductAttributesItem: React.FC<ProductAttributesItemInterface> = ({
  attribute,
  inputName,
  groupName,
  viewOptions,
}) => {
  const { variant, optionsGroup, nameString, metric } = attribute;
  const firstValueIndex = 0;
  const labelPostfix = metric ? metric.nameString : '';

  const optionsList = optionsGroup ? optionsGroup.options : [];

  const singleValueInputName = `${inputName}.value[${firstValueIndex}]`;
  const multipleValueInputName = `${inputName}.value`;

  const testId = `${groupName}-${nameString}`;

  return (
    <div className={classes.attribute}>
      {variant === ATTRIBUTE_VARIANT_NUMBER || variant === ATTRIBUTE_VARIANT_STRING ? (
        <FormikInput
          min={variant === 'string' ? undefined : 0}
          label={nameString}
          labelPostfix={labelPostfix}
          type={variant === ATTRIBUTE_VARIANT_STRING ? 'text' : 'number'}
          name={singleValueInputName}
          testId={testId}
        />
      ) : null}

      {variant === ATTRIBUTE_VARIANT_SELECT ? (
        <FormikSelect
          label={nameString}
          labelPostfix={labelPostfix}
          options={optionsList}
          firstOption={'Не выбрано'}
          name={singleValueInputName}
          testId={testId}
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
                testId={`${testId}-${nameString}`}
                inList
              />
            );
          })}
        </InputLine>
      ) : null}

      <FormikSelect
        label={'Тип отображения'}
        name={`${inputName}.viewVariant`}
        testId={`${testId}-viewVariant`}
        options={viewOptions}
      />

      <FormikCheckboxLine
        label={'Показать в карточке товара'}
        name={`${inputName}.showInCard`}
        testId={`${testId}-showInCard`}
        low
      />
    </div>
  );
};

interface ProductAttributesGroupInterface {
  group: FeaturesAstGroupFragment;
  groupIndex: number;
  viewOptions: AttributeViewOptionFragment[];
}

const ProductAttributesGroup: React.FC<ProductAttributesGroupInterface> = ({
  group,
  groupIndex,
  viewOptions,
}) => {
  const { setFieldValue, values } = useFormikContext<UpdateProductInput>();
  const inputName = `attributesGroups[${groupIndex}]`;
  const { id, nameString, attributes } = group;

  const groupAttributesValue = useMemo(
    () =>
      group.attributes.map(({ id, slug }) => ({
        node: id,
        showInCard: false,
        key: slug,
        value: [],
        viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      })),
    [group],
  );

  // Set attributes default values if rubrics changed
  useEffect(() => {
    const currentGroupValue = values.attributesGroups.find(({ node }) => node === id);
    if (!currentGroupValue) {
      setFieldValue(inputName, {
        node: id,
        showInCard: true,
        attributes: groupAttributesValue,
      });
    }

    attributes.forEach((attribute) => {
      const currentAttributeValue = currentGroupValue?.attributes.find(
        ({ node }) => node === attribute.id,
      );
      if (!currentAttributeValue || !currentAttributeValue.key || !currentAttributeValue.node) {
        setFieldValue(inputName, {
          node: id,
          showInCard: true,
          attributes: groupAttributesValue,
        });
      }
    });
  }, [values, id, inputName, setFieldValue, groupAttributesValue, attributes]);

  return (
    <div className={classes.frame}>
      <div className={classes.titleHolder}>
        <div className={classes.title}>{nameString}</div>
        <div>
          <FormikCheckboxLine
            lineClassName={classes.titleCheckboxLine}
            label={'Показать группу в карточке товара'}
            name={`${inputName}.showInCard`}
            low
          />
        </div>
      </div>

      <div className={classes.list}>
        {attributes.map((attribute, index) => {
          const attributeInputName = `${inputName}.attributes[${index}]`;
          return (
            <ProductAttributesItem
              groupName={group.nameString}
              attribute={attribute}
              inputName={attributeInputName}
              viewOptions={viewOptions}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

interface CreateNewProductAttributesSelectInterface {
  rubrics: string[];
}

interface ProductAttributesStateInterface {
  getFeaturesAst: FeaturesAstGroupFragment[];
  getAttributeViewVariantsOptions: AttributeViewOptionFragment[];
}

const ProductAttributes: React.FC<CreateNewProductAttributesSelectInterface> = ({ rubrics }) => {
  const [state, setState] = useState<ProductAttributesStateInterface>({
    getFeaturesAst: [],
    getAttributeViewVariantsOptions: [],
  });

  const { data, loading, error } = useGetFeaturesAstQuery({
    variables: {
      selectedRubrics: rubrics,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setState(data);
    }
  }, [loading, data, error]);

  if (!data || error) {
    return <RequestError />;
  }

  const { getFeaturesAst, getAttributeViewVariantsOptions } = state;

  return (
    <div>
      {getFeaturesAst.map((group, index) => {
        return (
          <ProductAttributesGroup
            viewOptions={getAttributeViewVariantsOptions}
            key={group.id}
            group={group}
            groupIndex={index}
          />
        );
      })}
    </div>
  );
};

export default ProductAttributes;
