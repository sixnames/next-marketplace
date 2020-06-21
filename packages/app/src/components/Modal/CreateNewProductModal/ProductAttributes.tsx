import React, { Fragment, useEffect } from 'react';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import ProductAttributesList from './ProductAttributesList';
import InputLine from '../../FormElements/Input/InputLine';
import Button from '../../Buttons/Button';
import { useFormikContext } from 'formik';
import { ObjectType } from '../../../types';
import { get } from 'lodash';
import {
  GetFeaturesAstOptionsQuery,
  useGetFeaturesAstOptionsQuery,
} from '../../../generated/apolloComponents';

interface CreateNewProductAttributesSelectInterface {
  disabled?: boolean;
}

interface ProductAttributesConsumerInterface {
  featuresASTOptions: GetFeaturesAstOptionsQuery['getFeaturesASTOptions'];
}

const ProductAttributesConsumer: React.FC<ProductAttributesConsumerInterface> = ({
  featuresASTOptions,
}) => {
  const { setFieldValue, values } = useFormikContext<ObjectType>();
  const sourceName = 'attributesSource';
  const groupsName = 'attributesGroups';
  const { attributesSource } = values;

  useEffect(() => {
    const source = get(values, sourceName);
    const featuresASTIds = featuresASTOptions.map(({ id }) => id);

    if (source && !featuresASTIds.includes(source)) {
      setFieldValue(sourceName, null);
      setFieldValue(groupsName, []);
    }
  }, [setFieldValue, values, featuresASTOptions]);

  if (!featuresASTOptions) {
    return null;
  }

  const currentAST = featuresASTOptions.find(({ id }) => id === attributesSource);

  if (!currentAST) {
    return null;
  }
  return <ProductAttributesList attributesGroups={currentAST.attributesGroups} />;
};

const ProductAttributes: React.FC<CreateNewProductAttributesSelectInterface> = ({ disabled }) => {
  const { setFieldValue, values } = useFormikContext<ObjectType>();
  const sourceName = 'attributesSource';
  const groupsName = 'attributesGroups';
  const sourceResetName = 'attributes-source-reset';
  const { rubrics } = values;

  const { data, loading, error } = useGetFeaturesAstOptionsQuery({
    fetchPolicy: 'network-only',
    variables: {
      selected: rubrics,
    },
  });

  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getFeaturesASTOptions } = data;

  function attributesSourceResetHandler() {
    setFieldValue(sourceName, null);
    setFieldValue(groupsName, []);
  }

  return (
    <Fragment>
      <FormikSelect
        options={getFeaturesASTOptions}
        name={sourceName}
        testId={sourceName}
        label={'Источник атрибутов'}
        firstOption={'Не выбран'}
        disabled={disabled}
        isRequired
      />

      {disabled && (
        <InputLine name={sourceResetName}>
          <Button
            title={
              'Внимание! При нажатии данной кнопки разблокируется селект "Источник атрибутов" и будут стёрты все ранее заполненные поля атрибутов.'
            }
            testId={sourceResetName}
            onClick={attributesSourceResetHandler}
          >
            Изменить источник атрибутов
          </Button>
        </InputLine>
      )}

      <ProductAttributesConsumer featuresASTOptions={getFeaturesASTOptions} />
    </Fragment>
  );
};

export default ProductAttributes;
