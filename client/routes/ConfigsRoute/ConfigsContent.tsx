import React from 'react';
import { useGetAllConfigsQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { CONFIG_VARIANT_ASSET } from '../../config';
// import classes from './ConfigsContent.module.css';

const ConfigsContent: React.FC = () => {
  const { data, loading, error } = useGetAllConfigsQuery();

  if (loading) return <Spinner isNested />;
  if (error || !data) return <RequestError />;
  const { getAllConfigs } = data;

  const assetConfigs = getAllConfigs.filter(({ variant }) => variant === CONFIG_VARIANT_ASSET);
  const notAssetConfigs = getAllConfigs.filter(({ variant }) => variant !== CONFIG_VARIANT_ASSET);

  console.log({ assetConfigs, notAssetConfigs });
  return <div data-cy={'site-configs'} />;
};

export default ConfigsContent;
