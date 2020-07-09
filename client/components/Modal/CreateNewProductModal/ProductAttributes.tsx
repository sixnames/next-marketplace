import React, { useEffect, useMemo } from 'react';
import classes from './ProductAttributes.module.css';
import ProductAttributesItem from './ProductAttributesItem';
import { useFormikContext } from 'formik';
import FormikCheckboxLine from '../../FormElements/Checkbox/FormikCheckboxLine';
import { get } from 'lodash';
import { GetFeaturesAstQuery, useGetFeaturesAstQuery } from '../../../generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';

export type ProductAttributesGroupType = GetFeaturesAstQuery['getFeaturesAst'][0];
interface ProductAttributesGroupInterface {
  group: ProductAttributesGroupType;
  groupIndex: number;
}

const ProductAttributesGroup: React.FC<ProductAttributesGroupInterface> = ({
  group,
  groupIndex,
}) => {
  const { setFieldValue, values } = useFormikContext();
  const inputName = `attributesGroups[${groupIndex}]`;
  const { id, nameString, attributes } = group;

  const groupAttributesValue = useMemo(
    () =>
      group.attributes.map(({ id, itemId }) => ({
        node: id,
        showInCard: false,
        key: itemId,
        value: [],
      })),
    [group],
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
              groupIndex={groupIndex}
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

interface CreateNewProductAttributesSelectInterface {
  rubrics: string[];
}

const ProductAttributes: React.FC<CreateNewProductAttributesSelectInterface> = ({ rubrics }) => {
  const { data, loading, error } = useGetFeaturesAstQuery({
    variables: {
      selectedRubrics: rubrics,
    },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (!data || error) {
    return <RequestError />;
  }

  const { getFeaturesAst } = data;
  return (
    <div>
      {getFeaturesAst.map((group, index) => {
        return <ProductAttributesGroup key={index} group={group} groupIndex={index} />;
      })}
    </div>
  );
};

export default ProductAttributes;
