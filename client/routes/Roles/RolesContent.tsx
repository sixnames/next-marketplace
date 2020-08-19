import React, { Fragment } from 'react';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import { GetRoleQuery, GetRoleQueryResult } from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import classes from './RolesContent.module.css';
import TabsContent from '../../components/TabsContent/TabsContent';
import RoleRules from './RoleRules';
import RoleAppNavigation from './RoleAppNavigation';
import RoleDetails from './RoleDetails';

export type RoleContentType = GetRoleQuery['getRole'];
export type RoleRuleType = GetRoleQuery['getRole']['rules'][0];
export type RoleOperationType = RoleRuleType['operations'][0];

export interface RoleContentInterface {
  role: RoleContentType;
}

interface RolesContentInterface {
  queryResult: GetRoleQueryResult;
}

const RolesContent: React.FC<RolesContentInterface> = ({ queryResult = {} }) => {
  const { data, loading, error } = queryResult;
  if (loading) return <Spinner />;
  if (error || !data) return <RequestError />;

  const { getRole } = data;
  const { nameString, description } = getRole;

  return (
    <Fragment>
      <DataLayoutTitle testId={'role-title'} description={description}>
        {nameString}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <TabsContent className={classes.content}>
          <RoleRules role={getRole} />
          <RoleAppNavigation role={getRole} />
          <RoleDetails role={getRole} />
        </TabsContent>
      </DataLayoutContentFrame>
    </Fragment>
  );
};

export default RolesContent;
