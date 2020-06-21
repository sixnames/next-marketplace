import React, { useEffect, useMemo } from 'react';
import classes from './ProductAttributesList.module.css';
import ProductAttributesItem from './ProductAttributesItem';
import { useFormikContext } from 'formik';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';
import { get } from 'lodash';
import { GetFeaturesAstOptionsQuery } from '../../../generated/apolloComponents';

export type ProductAttributesListType = GetFeaturesAstOptionsQuery['getFeaturesASTOptions'][0]['attributesGroups'];
export type ProductAttributesGroupType = ProductAttributesListType[0];

export interface ProductAttributesListInterface {
  attributesGroups: ProductAttributesListType;
}

interface ProductAttributesGroupInterface {
  group: ProductAttributesGroupType;
  index: number;
}

const ProductAttributesGroup: React.FC<ProductAttributesGroupInterface> = ({ group, index }) => {
  const { setFieldValue, values } = useFormikContext();
  const inputName = `attributesGroups[${index}]`;
  const { node } = group;
  const { id, nameString, attributes } = node;

  const groupAttributesValue = useMemo(
    () =>
      node.attributes.map(({ id, itemId }) => ({
        node: id,
        showInCard: false,
        key: itemId,
        value: [],
      })),
    [node.attributes],
  );

  useEffect(() => {
    const currentGroupValue = get(values, inputName);
    if (!currentGroupValue) {
      setFieldValue(inputName, {
        node: id,
        showInCard: true,
        attributes: groupAttributesValue,
      });
    }
  }, [values, id, inputName, setFieldValue, groupAttributesValue]);

  return (
    <div className={classes.frame}>
      <div className={classes.title}>{nameString}</div>
      <FormikCheckboxLine
        label={'Показать группу в карточке товара'}
        name={`${inputName}.showInCard`}
        inList
      />

      <div className={classes.list}>
        {attributes.map((attribute, index) => {
          const attributeInputName = `${inputName}.attributes[${index}]`;
          return (
            <ProductAttributesItem
              attribute={attribute}
              inputName={attributeInputName}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

const ProductAttributesList: React.FC<ProductAttributesListInterface> = ({ attributesGroups }) => {
  return (
    <div>
      {attributesGroups.map((group, index) => {
        return <ProductAttributesGroup key={index} group={group} index={index} />;
      })}
    </div>
  );
};

export default ProductAttributesList;
