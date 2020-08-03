import React from 'react';
import { useGetAllConfigsQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { CONFIG_VARIANT_ASSET } from '../../config';
import InnerWide from '../../components/Inner/InnerWide';
import FormikConfigInput from '../../components/FormElements/FormikConfigInput/FormikConfigInput';
import { Form, Formik } from 'formik';
import useValidationSchema from '../../hooks/useValidationSchema';
import { updateConfigsClientSchema } from '../../validation/configSchema';

const ConfigsContent: React.FC = () => {
  const { data, loading, error } = useGetAllConfigsQuery();
  const notAssetSchema = useValidationSchema({
    schema: updateConfigsClientSchema,
    messagesKeys: ['validation.configs.id', 'validation.configs.value'],
  });

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;
  const { getAllConfigs } = data;

  const assetConfigs = getAllConfigs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = getAllConfigs.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  console.log({ assetConfigs });
  return (
    <InnerWide testId={'site-configs'}>
      <Formik
        validationSchema={notAssetSchema}
        initialValues={{ inputs: notAssetConfigs }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values }) => {
          return (
            <Form>
              {values.inputs.map(({ id, nameString, description }, index) => {
                return (
                  <FormikConfigInput
                    key={id}
                    name={`inputs[${index}]`}
                    label={nameString}
                    description={description}
                  />
                );
              })}
            </Form>
          );
        }}
      </Formik>
    </InnerWide>
  );
};

export default ConfigsContent;
