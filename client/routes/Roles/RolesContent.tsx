import React, { Fragment } from 'react';
import { ObjectType } from '../../types';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { useGetRoleQuery } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
// import classes from './RolesContent.module.css';

interface RolesContentInterface {
  query?: ObjectType;
}

const RolesContent: React.FC<RolesContentInterface> = ({ query = {} }) => {
  const { role: roleId } = query;
  const { data, loading, error } = useGetRoleQuery({
    variables: {
      id: roleId,
    },
    skip: !roleId,
    fetchPolicy: 'network-only',
  });

  if (!roleId) {
    return <DataLayoutTitle>Выберите роль</DataLayoutTitle>;
  }

  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getRole } = data;
  const { nameString, description } = getRole;
  console.log(getRole);
  return (
    <Fragment>
      <DataLayoutTitle description={description}>{nameString}</DataLayoutTitle>
      <DataLayoutContentFrame>content</DataLayoutContentFrame>
    </Fragment>
  );
};

export default RolesContent;
